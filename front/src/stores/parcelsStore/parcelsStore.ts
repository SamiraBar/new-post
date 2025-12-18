import { create } from 'zustand';
import axiosApi from '@/axiosApi.ts';
import axios, { isAxiosError } from 'axios';
import type { ParcelState } from './types';
import type { CreateParcelData, IParcel, Order, PaginatedParcelsResponse } from '@/types';

interface SearchFilters {
  trackingNumber?: string;
  sender?: string;
  recipient?: string;
}

interface ExtendedParcelState extends ParcelState {
  searchFilters: SearchFilters;
  setSearchFilters: (filters: SearchFilters) => void;
  createParcelLoading: boolean;
  createParcelError: { error: string } | null;
  createdTrackingNumber: string | null;
  createParcel: (order: Order) => Promise<string | null>;
  updatePartnerTrackingNumberLoading: boolean;
  updatePartnerTrackingNumberError: { error: string } | null;
  updatePartnerTrackingNumber: (
    id: string,
    partnerTrackingNumber: string | null,
  ) => Promise<boolean>;
  printStickerLoading: boolean;
  printStickerError: { error: string } | null;
  printSticker: (
    trackingNumber: string,
    recipientName: string,
    address: string,
  ) => Promise<boolean>;
}

export const useParcelsStore = create<ExtendedParcelState>()((set, get) => ({
  parcels: [],
  parcel: null,
  getParcelsLoading: false,
  getParcelsError: null,
  parcelsResponse: null,
  getParcelLoading: false,
  getParcelError: null,
  editParcelStatusLoading: false,
  editParcelStatusError: null,
  createParcelLoading: false,
  createParcelError: null,
  createdTrackingNumber: null,
  searchFilters: {},
  updatePartnerTrackingNumberLoading: false,
  updatePartnerTrackingNumberError: null,
  printStickerLoading: false,
  printStickerError: null,

  setSearchFilters(filters: SearchFilters) {
    set({ searchFilters: filters });
    get().getParcels(1);
  },

  async getParcels(page: number) {
    try {
      set({
        getParcelsLoading: true,
        getParcelsError: null,
      });

      const { searchFilters } = get();
      const params = new URLSearchParams();

      if (searchFilters.trackingNumber?.trim()) {
        params.append('trackingNumber', searchFilters.trackingNumber.trim());
      }
      if (searchFilters.sender?.trim()) {
        params.append('sender', searchFilters.sender.trim());
      }
      if (searchFilters.recipient?.trim()) {
        params.append('recipient', searchFilters.recipient.trim());
      }

      params.append('page', String(page));

      const url = `/parcels?${params.toString()}`;

      const { data } = await axiosApi.get<PaginatedParcelsResponse>(url);

      if (page === 1) {
        set({
          parcels: data.parcels,
          parcelsResponse: data,
        });
      } else {
        const current = get().parcels || [];
        const newParcels = data.parcels.filter((p) => !current.some((c) => c._id === p._id));

        set((state) => ({
          parcels: [...(state.parcels ?? []), ...newParcels],
          parcelsResponse: data,
        }));
      }

      return true;
    } catch (e: unknown) {
      let errorMessage = '';

      if (axios.isAxiosError(e)) {
        errorMessage = e.response?.data?.error || e.message;
      } else if (e instanceof Error) {
        errorMessage = e.message;
      } else if (typeof e === 'string') {
        errorMessage = e;
      }

      set({ getParcelsError: { error: errorMessage } });
      return false;
    } finally {
      set({ getParcelsLoading: false });
    }
  },

  async getParcelById(id: string) {
    try {
      set({
        getParcelLoading: true,
        getParcelError: null,
      });
      const { data } = await axiosApi.get<IParcel>(`/parcels/${id}`);
      set({ parcel: data });
      return true;
    } catch (e: unknown) {
      let errorMessage = '';
      if (axios.isAxiosError(e)) {
        errorMessage = e.response?.data?.error || e.message;
      } else if (e instanceof Error) {
        errorMessage = e.message;
      } else if (typeof e === 'string') {
        errorMessage = e;
      }
      set({ getParcelError: { error: errorMessage } });
      return false;
    } finally {
      set({ getParcelLoading: false });
    }
  },

  async editParcelStatus(trackingNumber: string, status: string) {
    set({
      editParcelStatusLoading: true,
      editParcelStatusError: null,
    });
    try {
      const { data } = await axiosApi.patch<{
        message: string;
        parcel: IParcel;
      }>(`/parcels/tracking/${trackingNumber}/status`, { status });
      set({
        editParcelStatusLoading: false,
        parcel: data.parcel,
      });
      return true;
    } catch (e) {
      if (isAxiosError(e) && e.response) {
        set({
          editParcelStatusError: e.response.data.error,
          editParcelStatusLoading: false,
        });
      }
    }
    return false;
  },

  async createParcel(order: Order) {
    set({
      createParcelLoading: true,
      createParcelError: null,
      createdTrackingNumber: null,
    });

    try {
      const parcelData: CreateParcelData = {
        partnerTrackingNumber: null,
        sender: {
          fullName: order.sender.name,
          phoneNumber: order.sender.phone,
          email: order.sender.email,
          description: order.inParcel || 'No description',
          address: order.originCity,
          inn_passport: order.sender.inn_passport,
        },
        recipient: {
          fullName: order.receiver.name,
          phoneNumber: order.receiver.phone,
          email: order.receiver.email,
          address: order.destinationCity,
          description: 'Recipient',
          city: order.destinationCity,
        },
        originCity: order.originCity,
        destinationCity: order.destinationCity,
        originOffice: order.originOffice || null,
        destinationOffice: order.destinationOffice || null,
        weight: order.parcelWeight,
        isPaid: false,
        partnerStickerReceived: false,
        deliveryType: order.deliveryType,
        partnerType: order.partnerType,
      };

      if (order.deliveryType === 'courier') {
        const fullAddress = [
          order.receiver.city || order.destinationCity,
          order.receiver.street,
          order.receiver.house,
          order.receiver.apartment ? `кв. ${order.receiver.apartment}` : '',
        ]
          .filter(Boolean)
          .join(', ');

        parcelData.recipient = {
          ...parcelData.recipient,
          city: order.receiver.city || order.destinationCity,
          street: order.receiver.street || '',
          house: order.receiver.house || '',
          apartment: order.receiver.apartment || '',
          address: fullAddress,
        };
      }

      if (order.pvzData && order.deliveryType === 'pickup') {
        parcelData.pvzData = {
          code: order.pvzData.code,
          name: order.pvzData.name,
          address: order.pvzData.address,
          phone: order.pvzData.phone,
          worktime: order.pvzData.worktime,
          maxweight: order.pvzData.maxweight,
          parentcode: order.pvzData.parentcode,
          parentname: order.pvzData.parentname,
          town: order.pvzData.town,
          towncode: order.pvzData.towncode,
          region: order.pvzData.region,
          acceptcash: order.pvzData.acceptcash,
          acceptcard: order.pvzData.acceptcard,
        };

        parcelData.recipient = {
          ...parcelData.recipient,
          address: order.pvzData.address,
          city: order.pvzData.town || order.destinationCity,
        };
      }

      const { data } = await axiosApi.post<{
        message: string;
        parcel: IParcel;
        trackingNumber: string;
        warning?: string;
      }>('/parcels', parcelData);

      if (data.warning) {
        console.warn('E-Kit sync warning:', data.warning);
      }

      set({
        createParcelLoading: false,
        parcel: data.parcel,
        createdTrackingNumber: data.trackingNumber,
      });

      return data.trackingNumber;
    } catch (e: unknown) {
      let errorMessage = 'Failed to create parcel';

      if (axios.isAxiosError(e)) {
        errorMessage = e.response?.data?.error || e.message;
      } else if (e instanceof Error) {
        errorMessage = e.message;
      } else if (typeof e === 'string') {
        errorMessage = e;
      }

      set({
        createParcelError: { error: errorMessage },
        createParcelLoading: false,
      });

      return null;
    }
  },

  async updatePartnerTrackingNumber(id: string, partnerTrackingNumber: string | null) {
    set({ updatePartnerTrackingNumberLoading: true, updatePartnerTrackingNumberError: null });
    try {
      const { data } = await axiosApi.patch<{ message: string; parcel: IParcel }>(
        `/parcels/${id}/partner-tracking-number`,
        { partnerTrackingNumber },
      );
      set({ parcel: data.parcel, updatePartnerTrackingNumberLoading: false });
      get().getParcels(1);
      return true;
    } catch (e: unknown) {
      let errorMessage = 'Failed to update partnerTrackingNumber';
      if (axios.isAxiosError(e)) errorMessage = e.response?.data?.error || e.message;
      else if (e instanceof Error) errorMessage = e.message;
      else if (typeof e === 'string') errorMessage = e;

      set({
        updatePartnerTrackingNumberError: { error: errorMessage },
        updatePartnerTrackingNumberLoading: false,
      });
      return false;
    }
  },

  async printSticker(trackingNumber: string, recipientName: string, address: string) {
    set({ printStickerLoading: true, printStickerError: null });
    try {
      const { data } = await axiosApi.post<{ success: boolean; message: string }>(
        '/printer/print',
        {
          trackingNumber,
          recipientName,
          address,
        },
      );

      set({ printStickerLoading: false });
      return data.success;
    } catch (e: unknown) {
      let errorMessage = 'Failed to print sticker';

      if (axios.isAxiosError(e)) {
        errorMessage = e.response?.data?.error || e.message;
      } else if (e instanceof Error) {
        errorMessage = e.message;
      } else if (typeof e === 'string') {
        errorMessage = e;
      }

      set({
        printStickerError: { error: errorMessage },
        printStickerLoading: false,
      });
      return false;
    }
  },
}));

export default useParcelsStore;

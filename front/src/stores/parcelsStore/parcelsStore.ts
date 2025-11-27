import { create } from 'zustand';
import axiosApi from '@/axiosApi.ts';
import axios, { isAxiosError } from 'axios';
import type { ParcelState } from './types';
import type { IParcel, Order, PaginatedParcelsResponse } from '@/types';

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
      const parcelData = {
        partnerTrackingNumber: null,
        sender: {
          fullName: order.sender.name,
          phoneNumber: order.sender.phone,
          email: order.sender.email,
          description: order.inParcel || 'No description',
          inn_passport: order.sender.inn_passport,
        },
        recipient: {
          fullName: order.receiver.name,
          phoneNumber: order.receiver.phone,
          email: order.receiver.email,
          address: order.receiver.address || '',
          description: 'Recipient',
        },
        originCity: order.originCity,
        destinationCity: order.destinationCity,
        weight: order.parcelWeight,
        isPaid: false,
        partnerStickerReceived: false,
      };

      const { data } = await axiosApi.post<{
        message: string;
        parcel: IParcel;
        trackingNumber: string;
      }>('/parcels', parcelData);

      set({
        createParcelLoading: false,
        parcel: data.parcel,
        createdTrackingNumber: data.trackingNumber,
      });

      get().getParcels(1);

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
}));

export default useParcelsStore;

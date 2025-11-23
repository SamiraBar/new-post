import { create } from 'zustand';
import axiosApi from '@/axiosApi.ts';
import axios, { isAxiosError } from 'axios';
import type { ParcelState } from './types';
import type {IParcel, Order} from '@/types';

interface parcelData {
  parcels: IParcel[];
  currentPage: number;
  hasMore: boolean;
  total: number;
}

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
    get().getParcels();
  },

  async getParcels() {
    try {
      set({
        getParcelsLoading: true,
        getParcelsError: null,
      });

      const params = new URLSearchParams();
      const { searchFilters } = get();

      if (searchFilters.trackingNumber && searchFilters.trackingNumber.trim()) {
        params.append('trackingNumber', searchFilters.trackingNumber.trim());
      }
      if (searchFilters.sender && searchFilters.sender.trim()) {
        params.append('sender', searchFilters.sender.trim());
      }
      if (searchFilters.recipient && searchFilters.recipient.trim()) {
        params.append('recipient', searchFilters.recipient.trim());
      }

      const queryString = params.toString();
      const url = queryString ? `/parcels?${queryString}` : '/parcels';

      const { data } = await axiosApi.get<parcelData>(url);
      set({ parcels: data.parcels });
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

      get().getParcels();

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

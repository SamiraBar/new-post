import { create } from 'zustand';
import axiosApi from '@/axiosApi.ts';
import axios from 'axios';
import type { ParcelState } from './types';
import type { IParcel } from '@/types';
import { useAdminStore } from '../adminStore/adminStore';

export const useParcelsStore = create<ParcelState>()((set) => ({
  parcels: [],
  parcel: null,
  getParcelsLoading: false,
  getParcelsError: null,
  getParcelLoading: false,
  getParcelError: null,

  async getParcels() {
    const token = useAdminStore.getState().admin?.token;
    if (!token) {
      set({ getParcelsError: { error: 'Invalid user token' } });
      return false;
    }
    try {
      set({ getParcelsLoading: true, getParcelsError: null });
      const { data } = await axiosApi.get<IParcel[]>('/parcels', {
        headers: { Authorization: token },
      });
      set({ parcels: data });
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
    const token = useAdminStore.getState().admin?.token;
    if (!token) {
      set({ getParcelError: { error: 'Invalid user token' } });
      return false;
    }

    try {
      set({ getParcelLoading: true, getParcelError: null });
      const { data } = await axiosApi.get<IParcel>(`/parcels/${id}`, {
        headers: { Authorization: token },
      });
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
}));

export default useParcelsStore;

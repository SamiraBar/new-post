import { create } from 'zustand';
import axiosApi from '@/axiosApi.ts';
import axios, { isAxiosError } from 'axios';
import type { ParcelState } from './types';
import type { IParcel, PaginatedParcelsResponse } from '@/types';

export const useParcelsStore = create<ParcelState>()((set, getState) => ({
  parcels: [],
  parcel: null,
  parcelsResponse: null,
  getParcelsLoading: false,
  getParcelsError: null,
  getParcelLoading: false,
  getParcelError: null,
  editParcelStatusLoading: false,
  editParcelStatusError: null,

  async getParcels(p: number) {
    try {
      set({
        getParcelsLoading: true,
        getParcelsError: null
      });
      const {data} = await axiosApi.get<PaginatedParcelsResponse>('/parcels?page=' + p);

      if (data.parcels && data.parcels.length > 0) {
        const current = getState().parcels || [];

        const newParcels = data.parcels.filter(
          (p) => !current.some((c) => c._id === p._id)
        );

        if (newParcels.length > 0) {
          set((state) => ({
            parcels: [...(state.parcels ?? []), ...newParcels],
            parcelsResponse: data,
          }));
        }
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
      set({getParcelsError: {error: errorMessage}});
      return false;
    } finally {
      set({getParcelsLoading: false});
    }
  },

  async getParcelById(id: string) {
    try {
      set({
        getParcelLoading: true,
        getParcelError: null
      });
      const {data} = await axiosApi.get<IParcel>(`/parcels/${id}`);
      set({parcel: data});
      return true;
    } catch (e) {
      let errorMessage = '';
      if (axios.isAxiosError(e)) {
        errorMessage = e.response?.data?.error || e.message;
      } else if (e instanceof Error) {
        errorMessage = e.message;
      } else if (typeof e === 'string') {
        errorMessage = e;
      }
      set({getParcelError: {error: errorMessage}});
      return false;
    } finally {
      set({getParcelLoading: false});
    }
  },

  async editParcelStatus(trackingNumber: string, status: string) {
    set({
      editParcelStatusLoading: true,
      editParcelStatusError: null
    });
    try {
      const {data} = await axiosApi.patch<{
        message: string;
        parcel: IParcel
      }>(`/parcels/tracking/${trackingNumber}/status`, {status});
      set({
        editParcelStatusLoading: false,
        parcel: data.parcel
      });
      return true;
    } catch (e) {
      if (isAxiosError(e) && e.response) {
        set({
          editParcelStatusError: e.response.data.error,
          editParcelStatusLoading: false
        });
      }
    }
    return false;
  }
}));


export default useParcelsStore;

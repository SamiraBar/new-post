import { create } from 'zustand';
import axiosApi from '@/axiosApi.ts';
import axios from 'axios';
import type { CreateOfficeData, IAdminOffice, IOffice, UpdateOfficeData } from '@/stores/officesStore/types.ts';



interface OfficeState {
  offices: IOffice[];
  adminOffices: IAdminOffice[];
  office: IAdminOffice | null;
  getOfficesLoading: boolean;
  getOfficesError: { error: string } | null;
  getAdminOfficesLoading: boolean;
  getAdminOfficesError: { error: string } | null;
  getOfficeLoading: boolean;
  getOfficeError: { error: string } | null;
  createOfficeLoading: boolean;
  createOfficeError: { error: string } | null;
  updateOfficeLoading: boolean;
  updateOfficeError: { error: string } | null;
  deleteOfficeLoading: boolean;
  deleteOfficeError: { error: string } | null;

  getOffices: (type: 'admin' | 'all') => Promise<boolean>;
  getOfficeById: (id: string) => Promise<boolean>;
  createOffice: (officeData: CreateOfficeData) => Promise<IOffice | null>;
  updateOffice: (id: string, officeData: UpdateOfficeData) => Promise<boolean>;
  deleteOffice: (id: string) => Promise<boolean>;
  clearOfficeError: () => void;
}

export const useOfficesStore = create<OfficeState>()((set) => ({
  offices: [],
  adminOffices: [],
  office: null,
  getOfficesLoading: false,
  getOfficesError: null,
  getAdminOfficesLoading: false,
  getAdminOfficesError: null,
  getOfficeLoading: false,
  getOfficeError: null,
  createOfficeLoading: false,
  createOfficeError: null,
  updateOfficeLoading: false,
  updateOfficeError: null,
  deleteOfficeLoading: false,
  deleteOfficeError: null,

  async getOffices(type: 'admin' | 'all' = 'all') {
    try {
      if (type === 'admin') {
        set({
          getAdminOfficesLoading: true,
          getAdminOfficesError: null,
        });
      } else {
        set({
          getOfficesLoading: true,
          getOfficesError: null,
        });
      }

      const endpoint = type === 'admin' ? '/offices/admin' : '/offices';

      if (type === 'admin') {
        const { data } = await axiosApi.get<IAdminOffice[]>(endpoint);
        set({
          adminOffices: data,
          getAdminOfficesLoading: false,
        });
      } else {
        const { data } = await axiosApi.get<IOffice[]>(endpoint);
        set({
          offices: data,
          getOfficesLoading: false,
        });
      }

      return true;
    } catch (e: unknown) {
      let errorMessage = 'Failed to fetch offices';

      if (axios.isAxiosError(e)) {
        errorMessage = e.response?.data?.error || e.message;
      } else if (e instanceof Error) {
        errorMessage = e.message;
      } else if (typeof e === 'string') {
        errorMessage = e;
      }

      if (type === 'admin') {
        set({
          getAdminOfficesError: { error: errorMessage },
          getAdminOfficesLoading: false,
        });
      } else {
        set({
          getOfficesError: { error: errorMessage },
          getOfficesLoading: false,
        });
      }

      return false;
    }
  },

  async getOfficeById(id: string) {
    try {
      set({
        getOfficeLoading: true,
        getOfficeError: null,
      });

      const { data } = await axiosApi.get<IAdminOffice>(`/offices/${id}`);

      set({
        office: data,
        getOfficeLoading: false,
      });

      return true;
    } catch (e: unknown) {
      let errorMessage = 'Failed to fetch office';

      if (axios.isAxiosError(e)) {
        errorMessage = e.response?.data?.error || e.message;
      } else if (e instanceof Error) {
        errorMessage = e.message;
      } else if (typeof e === 'string') {
        errorMessage = e;
      }

      set({
        getOfficeError: { error: errorMessage },
        getOfficeLoading: false,
      });

      return false;
    }
  },

  async createOffice(officeData: CreateOfficeData) {
    try {
      set({
        createOfficeLoading: true,
        createOfficeError: null,
      });

      const { data } = await axiosApi.post<IAdminOffice>('/offices', officeData);

      set((state) => ({
        adminOffices: [...state.adminOffices, data],
        office: data,
        createOfficeLoading: false,
      }));

      return data;
    } catch (e: unknown) {
      let errorMessage = 'Failed to create office';

      if (axios.isAxiosError(e)) {
        errorMessage = e.response?.data?.error || e.message;
      } else if (e instanceof Error) {
        errorMessage = e.message;
      } else if (typeof e === 'string') {
        errorMessage = e;
      }

      set({
        createOfficeError: { error: errorMessage },
        createOfficeLoading: false,
      });
      return null;
    }
  },

  async updateOffice(id: string, officeData: UpdateOfficeData) {
    try {
      set({
        updateOfficeLoading: true,
        updateOfficeError: null,
      });

      const { data } = await axiosApi.patch<IAdminOffice>(`/offices/${id}`, officeData);

      set((state) => ({
        adminOffices: state.adminOffices.map((office) => (office._id === id ? data : office)),
        office: data,
        updateOfficeLoading: false,
      }));

      return true;
    } catch (e: unknown) {
      let errorMessage = 'Failed to update office';

      if (axios.isAxiosError(e)) {
        errorMessage = e.response?.data?.error || e.message;
      } else if (e instanceof Error) {
        errorMessage = e.message;
      } else if (typeof e === 'string') {
        errorMessage = e;
      }

      set({
        updateOfficeError: { error: errorMessage },
        updateOfficeLoading: false,
      });

      return false;
    }
  },

  async deleteOffice(id: string) {
    try {
      set({
        deleteOfficeLoading: true,
        deleteOfficeError: null,
      });

      await axiosApi.delete(`/offices/${id}`);

      set((state) => ({
        adminOffices: state.adminOffices.filter((office) => office._id !== id),
        office: state.office?._id === id ? null : state.office,
        deleteOfficeLoading: false,
      }));
      return true;
    } catch (e: unknown) {
      let errorMessage = 'Failed to delete office';

      if (axios.isAxiosError(e)) {
        errorMessage = e.response?.data?.error || e.message;
      } else if (e instanceof Error) {
        errorMessage = e.message;
      } else if (typeof e === 'string') {
        errorMessage = e;
      }

      set({
        deleteOfficeError: { error: errorMessage },
        deleteOfficeLoading: false,
      });
      return false;
    }
  },

  clearOfficeError() {
    set({
      getOfficesError: null,
      getOfficeError: null,
      createOfficeError: null,
      updateOfficeError: null,
      deleteOfficeError: null,
    });
  },
}));

export default useOfficesStore;
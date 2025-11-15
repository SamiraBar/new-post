import { create } from 'zustand';
import axiosApi from '@/axiosApi.ts';
import type { AdminState } from '@/stores/adminStore/types.ts';
import type { Admin, AdminMutation } from '@/types';
import axios, { isAxiosError } from 'axios';
import { persist } from 'zustand/middleware';

export const useAdminStore = create<AdminState>()(
  persist(
    (set) => ({
      allAdmins: null,
      admin: null,
      loginLoading: false,
      loginError: null,
      createAdminError: null,

      async login(data) {
        try {
          set({ loginLoading: true, loginError: null });
          const { data: admin } = await axiosApi.post<Admin>('/admins/', data);
          set({ admin });
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
          set({ loginError: { error: errorMessage } });
          return false;
        } finally {
          set({ loginLoading: false });
        }
      },

      async getAllAdmins() {
        const { data: allAdmins } = await axiosApi.get<Admin[]>('/admins/');
        set({ allAdmins });
      },

      async createAdmin(data: AdminMutation) {
        try {
          set({ createAdminError: null });

          await axiosApi.post('/admins/create', data);

          return true;
        } catch (e) {
          if (isAxiosError(e)) {
            const errors = e.response?.data?.error?.message || e.message;
            set({ createAdminError: errors });
          }
          return false;
        }
      },

      async deleteAdmin(id: string) {
        await axiosApi.delete(`/admins/${id}`);
      },

      async logout() {
        await axiosApi.delete('/admins/');
        set({ admin: null });
      },
    }),
    {
      name: 'new-post-admin',
      partialize: (state) => ({ admin: state.admin }),
    },
  ),
);

export default useAdminStore;

import { create } from 'zustand';
import axiosApi from '@/axiosApi.ts';
import type { AdminState } from '@/stores/adminStore/types.ts';
import type { Admin } from '@/types';
import axios from 'axios';
import { persist } from 'zustand/middleware';

export const useAdminStore = create<AdminState>()(
  persist(
    (set) => ({
      admin: null,
      loginLoading: false,
      loginError: null,

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

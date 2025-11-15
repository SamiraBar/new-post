import type { GlobalError, LoginMutation, Admin, AdminMutation } from '@/types';

export interface AdminState {
  allAdmins: Admin[] | null;
  admin: Admin | null;
  loginLoading: boolean;
  loginError: GlobalError | null;
  createAdminError: string | null;


  createAdmin: (data: AdminMutation) => Promise<boolean>;
  login: (data: LoginMutation) => Promise<boolean>;
  getAllAdmins: () => Promise<void>;
  logout: () => Promise<void>;
  deleteAdmin: (id: string) => Promise<void>;
}

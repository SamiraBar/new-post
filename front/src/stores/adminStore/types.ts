import type { GlobalError, LoginMutation, Admin, AdminMutation, AdminEditing } from '@/types';

export interface AdminState {
  allAdmins: Admin[] | null;
  admin: Admin | null;
  loginLoading: boolean;
  loginError: GlobalError | null;
  createAdminError: string | null;
  editAdminError: string | null;


  createAdmin: (data: AdminMutation) => Promise<boolean>;
  editAdmin: (data: AdminEditing) => Promise<boolean>;
  login: (data: LoginMutation) => Promise<boolean>;
  getAllAdmins: () => Promise<void>;
  logout: () => Promise<void>;
  deleteAdmin: (id: string) => Promise<void>;
}

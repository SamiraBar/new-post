import type {
  GlobalError,
  LoginMutation,
  Admin,
  AdminMutation,
  AdminEditing,
  AdminSelfEdit,
} from '@/types';

export interface AdminState {
  allAdmins: Admin[] | null;
  admin: Admin | null;
  loginLoading: boolean;
  loginError: GlobalError | null;
  createAdminError: string | null;
  editAdminError: string | null;
  editSelfError: string | null;

  createAdmin: (data: AdminMutation) => Promise<boolean>;
  editAdmin: (data: AdminEditing) => Promise<boolean>;
  editSelf: (data: AdminSelfEdit) => Promise<boolean>;
  login: (data: LoginMutation) => Promise<boolean>;
  getAllAdmins: () => Promise<void>;
  logout: (forced?: boolean) => Promise<void>;
  deleteAdmin: (id: string) => Promise<void>;
}

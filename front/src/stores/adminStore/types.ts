import type { GlobalError, LoginMutation, Admin } from '@/types';

export interface AdminState {
  admin: Admin | null;
  loginLoading: boolean;
  loginError: GlobalError | null;

  login: (data: LoginMutation) => Promise<boolean>;
  logout: () => Promise<void>;
}

import type {GlobalError, LoginMutation, User} from "@/types";

export interface UserState {
  user: User | null;
  loginLoading: boolean;
  loginError: GlobalError | null;

  login: (data: LoginMutation) => Promise<boolean>;
  logout: () => Promise<void>;
}
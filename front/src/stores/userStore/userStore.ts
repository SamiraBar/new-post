import {create} from "zustand";
import axiosApi from "@/axiosApi.ts";
import type {UserState} from "@/stores/userStore/types.ts";
import type {User} from "@/types";
import axios from "axios";
import {persist} from "zustand/middleware";

export const useUserStore = create<UserState>() (
  persist ((set) => ({
    user: null,
    loginLoading: false,
    loginError: null,

    async login(data) {
      try {
        set({loginLoading: true, loginError: null});
        const {data: user} = await axiosApi.post<User>("/users/", data);
        set({user});
        return true;
      } catch (e: unknown) {
        let errorMessage = "";

        if (axios.isAxiosError(e)) {
          errorMessage = e.response?.data?.error || e.message;
        } else if (e instanceof Error) {
          errorMessage = e.message;
        } else if (typeof e === "string") {
          errorMessage = e;
        }
        set({loginError: {error: errorMessage}});
        return false;
      } finally {
        set({loginLoading: false});
      }
    },

    async logout() {
      await axiosApi.delete("/users/");
      set({user: null});
    },
  }),
    {
      name: "new-post-user",
      partialize: (state) => ({ user: state.user }),
    }
));

export default useUserStore;

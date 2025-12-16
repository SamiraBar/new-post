import axios from 'axios';
import { API_URL } from './constants.ts';
import useAdminStore from '@/stores/adminStore/adminStore.ts';
import { toast } from 'sonner';

const axiosApi = axios.create({
  baseURL: API_URL,
});

axiosApi.interceptors.request.use(
  (config) => {
    const token = useAdminStore.getState().admin?.token;
    if (token) config.headers.Authorization = token;
    return config;
  },
  (error) => Promise.reject(error),
);

let isLoggingOut = false;

axiosApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error?.response?.status === 401 && !isLoggingOut) {
      isLoggingOut = true;

      const msg = error?.response?.data?.error || 'The token is invalid or has expired!';

      toast.error(msg);

      const { logout } = useAdminStore.getState();
      await logout(true);

      if (window.location.pathname !== '/admin/login') {
        window.location.href = '/admin/login';
      }
    }

    return Promise.reject(error);
  },
);


export default axiosApi;

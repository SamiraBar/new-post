import axios from 'axios';
import { API_URL } from './constants.ts';
import useAdminStore from '@/stores/adminStore/adminStore.ts';

const axiosApi = axios.create({
  baseURL: API_URL,
});

axiosApi.interceptors.request.use(
  (config) => {
    const token = useAdminStore.getState().admin?.token;
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  });

axiosApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const msg = error.response.data?.error;

      if (msg === 'Токен устарел!' || msg === 'Токен недействителен или истёк!') {
        const { admin, logout } = useAdminStore.getState();

        if (admin) logout();

        window.location.href = '/admin/login';
      }
    }

    return Promise.reject(error);
  },
);

export default axiosApi;

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
  }
);

export default axiosApi;

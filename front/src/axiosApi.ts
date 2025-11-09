import axios from 'axios';
import { API_URL } from './constants.ts';

const axiosApi = axios.create({
  baseURL: API_URL,
});

export default axiosApi;

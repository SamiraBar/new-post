import axios from 'axios';
import { API_URL } from './constants';

const axiosPublic = axios.create({
  baseURL: API_URL,
});

export default axiosPublic;

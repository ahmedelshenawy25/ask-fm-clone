/* eslint-disable no-param-reassign */
import axios from 'axios';

const baseURL = process.env.NODE_ENV === 'development' ? 'http://localhost:5000/api' : '/api';

const axiosInstance = axios.create({
  baseURL
});

axiosInstance.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${localStorage.token}`;

  return config;
});

export default axiosInstance;

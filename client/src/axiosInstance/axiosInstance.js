/* eslint-disable no-param-reassign */
import axios from 'axios';
import history from '../history';

const baseURL = process.env.NODE_ENV === 'development' ? 'http://localhost:5000/api' : '/api';

const axiosInstance = axios.create({
  baseURL
});

axiosInstance.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${localStorage.token}`;

  return config;
});

axiosInstance.interceptors.response.use((response) => response, (error) => {
  if (error.response.status === 401) {
    history.push('/logout');
  }

  return Promise.reject(error);
});

export default axiosInstance;

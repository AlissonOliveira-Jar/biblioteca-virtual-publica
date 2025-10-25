import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  
  (error) => {
    if (axios.isAxiosError(error) && error.response) {
      const status = error.response.status;

      if (status >= 500 && status <= 504) {
        window.location.href = '/server-error';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

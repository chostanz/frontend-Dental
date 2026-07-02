import axios from 'axios';
import Swal from "sweetalert2";
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';

let isRedirecting = false;

const apiClient = axios.create({
  baseURL: apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {

    if (error.response?.status === 401 && !isRedirecting) {

      isRedirecting = true;

      localStorage.removeItem("token");

      await Swal.fire({
        icon: "warning",
        title: "Sesi telah berakhir",
        text: "Silakan login kembali.",
        confirmButtonText: "OK",
      });

      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default apiClient;

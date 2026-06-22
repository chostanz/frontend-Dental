import axios from 'axios';

// 1. Buat instance dasar
const apiClient = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    // Ambil token dari penyimpanan browser (localStorage)
    const token = localStorage.getItem('token');
    
    // Jika token ada, tambahkan format "Bearer <token>" ke header
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 3. (Opsional) Tambahkan Interceptor untuk Response
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Tangani jika token expired / unauthorized dari backend
    if (error.response && error.response.status === 401) {
      console.warn("Token expired atau tidak valid. Silakan login kembali.");
      // Anda bisa menambahkan logika otomatis logout / hapus token di sini
      // localStorage.removeItem('token');
      // window.location.href = '/login'; 
    }
    return Promise.reject(error);
  }
);

export default apiClient;
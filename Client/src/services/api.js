import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('agriToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('agriToken');
      localStorage.removeItem('agriUser');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// Auth
export const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
};

// Farms
export const farmService = {
  getAll: () => api.get('/farms'),
  create: (data) => api.post('/farms', data),
  delete: (id) => api.delete(`/farms/${id}`),
};

// Crops
export const cropService = {
  getAll: () => api.get('/crops'),
  getByFarm: (farmId) => api.get(`/crops?farm=${farmId}`),
  create: (data) => api.post('/crops', data),
  delete: (id) => api.delete(`/crops/${id}`),
  getInfo: () => api.get('/crops/info'),
};

// Products
export const productService = {
  getAll: () => api.get('/products'),
  getOne: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
};

// Orders
export const orderService = {
  create: (data) => api.post('/orders', data),
  getMyOrders: () => api.get('/orders/my'),
  getAll: () => api.get('/orders'),
  updateStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
};

// Admin
export const adminService = {
  getDashboard: () => api.get('/admin/dashboard'),
  getUsers: () => api.get('/admin/users'),
  updateUserRole: (id, role) => api.put(`/admin/users/${id}/role`, { role }),
};

// Weather
export const weatherService = {
  getWeather: (city) => api.get(`/weather?city=${encodeURIComponent(city)}`),
};

export default api;

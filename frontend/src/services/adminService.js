import api from './api';

const adminService = {
  // Dashboard
  getDashboardStats: async () => {
    const response = await api.get('/admin/dashboard/stats');
    return response;
  },

  // Product Management
  getAllProducts: async (params) => {
    const response = await api.get('/products', { params });
    return response;
  },

  createProduct: async (productData) => {
    const response = await api.post('/products', productData);
    return response;
  },

  updateProduct: async (id, productData) => {
    const response = await api.put(`/products/${id}`, productData);
    return response;
  },

  deleteProduct: async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response;
  },

  // Order Management
  getAllOrders: async (params) => {
    const response = await api.get('/admin/orders', { params });
    return response;
  },

  updateOrderStatus: async (orderId, status) => {
    const response = await api.put(`/admin/orders/${orderId}`, { status });
    return response;
  },

  // User Management
  getAllUsers: async (params) => {
    const response = await api.get('/admin/users', { params });
    return response;
  },

  updateUserRole: async (userId, role) => {
    const response = await api.put(`/admin/users/${userId}/role`, { role });
    return response;
  },

  // Reports
  getSalesReport: async (params) => {
    const response = await api.get('/admin/reports/sales', { params });
    return response;
  },

  getInventoryReport: async () => {
    const response = await api.get('/admin/reports/inventory');
    return response;
  },
};

export default adminService;

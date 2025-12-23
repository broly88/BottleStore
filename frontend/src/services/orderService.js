import api from './api';

const getUserOrders = async (params = {}) => {
  const queryParams = new URLSearchParams();

  Object.keys(params).forEach(key => {
    if (params[key]) {
      queryParams.append(key, params[key]);
    }
  });

  return await api.get(`/orders?${queryParams.toString()}`);
};

const getOrderById = async (orderId) => {
  return await api.get(`/orders/${orderId}`);
};

const cancelOrder = async (orderId) => {
  return await api.put(`/orders/${orderId}/cancel`);
};

const orderService = {
  getUserOrders,
  getOrderById,
  cancelOrder,
};

export default orderService;

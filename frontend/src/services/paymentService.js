import api from './api';

const createPaymentIntent = async (orderData) => {
  return await api.post('/payment/create-payment-intent', orderData);
};

const getPaymentStatus = async (orderId) => {
  return await api.get(`/payment/order/${orderId}/status`);
};

const paymentService = {
  createPaymentIntent,
  getPaymentStatus,
};

export default paymentService;

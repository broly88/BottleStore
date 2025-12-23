import api from './api';

const getCart = async () => {
  return await api.get('/cart');
};

const addToCart = async (productId, quantity = 1) => {
  return await api.post('/cart/items', { productId, quantity });
};

const updateCartItem = async (itemId, quantity) => {
  return await api.put(`/cart/items/${itemId}`, { quantity });
};

const removeFromCart = async (itemId) => {
  return await api.delete(`/cart/items/${itemId}`);
};

const clearCart = async () => {
  return await api.delete('/cart');
};

const cartService = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
};

export default cartService;

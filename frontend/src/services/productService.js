import api from './api';

const getProducts = async (filters = {}) => {
  const params = new URLSearchParams();

  Object.keys(filters).forEach(key => {
    if (filters[key]) {
      params.append(key, filters[key]);
    }
  });

  return await api.get(`/products?${params.toString()}`);
};

const getProductBySlug = async (slug) => {
  return await api.get(`/products/slug/${slug}`);
};

const getProductById = async (id) => {
  return await api.get(`/products/${id}`);
};

const getFeaturedProducts = async (limit = 10) => {
  return await api.get(`/products/featured?limit=${limit}`);
};

const getCategories = async () => {
  return await api.get('/products/categories');
};

const productService = {
  getProducts,
  getProductBySlug,
  getProductById,
  getFeaturedProducts,
  getCategories,
};

export default productService;

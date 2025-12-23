import api from './api';

const register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  if (response.token) {
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(response.user));
  }
  return response;
};

const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  if (response.token) {
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(response.user));
  }
  return response;
};

const logout = async () => {
  await api.post('/auth/logout');
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

const getMe = async () => {
  const response = await api.get('/auth/me');
  if (response.user) {
    localStorage.setItem('user', JSON.stringify(response.user));
  }
  return response;
};

const updateProfile = async (userData) => {
  const response = await api.put('/auth/me', userData);
  if (response.user) {
    localStorage.setItem('user', JSON.stringify(response.user));
  }
  return response;
};

const verifyEmail = async (token) => {
  return await api.post('/auth/verify-email', { token });
};

const forgotPassword = async (email) => {
  return await api.post('/auth/forgot-password', { email });
};

const resetPassword = async (token, password) => {
  return await api.post('/auth/reset-password', { token, password });
};

const authService = {
  register,
  login,
  logout,
  getMe,
  updateProfile,
  verifyEmail,
  forgotPassword,
  resetPassword,
};

export default authService;

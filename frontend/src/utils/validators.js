import { MIN_AGE } from './constants';
import { calculateAge } from './formatters';

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password) => {
  if (password.length < 8) {
    return 'Password must be at least 8 characters long';
  }
  if (!/[a-z]/.test(password)) {
    return 'Password must contain at least one lowercase letter';
  }
  if (!/[A-Z]/.test(password)) {
    return 'Password must contain at least one uppercase letter';
  }
  if (!/\d/.test(password)) {
    return 'Password must contain at least one number';
  }
  return null;
};

export const validatePhone = (phone) => {
  const re = /^(\+27|0)[0-9]{9}$/;
  return re.test(phone);
};

export const validateAge = (dateOfBirth) => {
  const age = calculateAge(dateOfBirth);
  return age >= MIN_AGE;
};

export const validatePostalCode = (postalCode) => {
  const re = /^[0-9]{4}$/;
  return re.test(postalCode);
};

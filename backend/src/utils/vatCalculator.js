const VAT_RATE = 0.15;

export const calculateVAT = (amount) => {
  const vatAmount = amount * VAT_RATE;
  return parseFloat(vatAmount.toFixed(2));
};

export const addVAT = (amount) => {
  const total = amount * (1 + VAT_RATE);
  return parseFloat(total.toFixed(2));
};

export const removeVAT = (amountWithVAT) => {
  const amountWithoutVAT = amountWithVAT / (1 + VAT_RATE);
  return parseFloat(amountWithoutVAT.toFixed(2));
};

export const getVATFromTotal = (amountWithVAT) => {
  const vatAmount = amountWithVAT - removeVAT(amountWithVAT);
  return parseFloat(vatAmount.toFixed(2));
};

export const formatZAR = (amount) => {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
  }).format(amount);
};

export default {
  calculateVAT,
  addVAT,
  removeVAT,
  getVATFromTotal,
  formatZAR,
  VAT_RATE,
};

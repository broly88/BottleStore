import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

export const stripeConfig = {
  currency: process.env.STRIPE_CURRENCY || 'ZAR',
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
};

export default stripe;

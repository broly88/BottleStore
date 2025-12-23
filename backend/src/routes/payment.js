import express from 'express';
import {
  createPaymentIntent,
  handleWebhook,
  getPaymentStatus,
} from '../controllers/paymentController.js';
import { protect } from '../middleware/auth.js';
import { requireAgeVerification } from '../middleware/ageVerification.js';

const router = express.Router();

router.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  handleWebhook
);

router.post(
  '/create-payment-intent',
  protect,
  requireAgeVerification,
  createPaymentIntent
);

router.get(
  '/order/:orderId/status',
  protect,
  getPaymentStatus
);

export default router;

import express from 'express';
import {
  createOrder,
  getUserOrders,
  getOrderById,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
} from '../controllers/orderController.js';
import { protect } from '../middleware/auth.js';
import { requireAgeVerification } from '../middleware/ageVerification.js';
import { adminOnly } from '../middleware/adminAuth.js';

const router = express.Router();

router.use(protect);

router.post('/', requireAgeVerification, createOrder);
router.get('/', getUserOrders);
router.get('/:id', getOrderById);
router.put('/:id/cancel', cancelOrder);

router.get('/admin/all', adminOnly, getAllOrders);
router.put('/admin/:id/status', adminOnly, updateOrderStatus);

export default router;

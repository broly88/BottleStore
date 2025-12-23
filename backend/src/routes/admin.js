import express from 'express';
import {
  getDashboardStats,
  getSalesReport,
  getInventoryReport,
  getAllUsers,
  updateUserRole,
} from '../controllers/adminController.js';
import { protect } from '../middleware/auth.js';
import { adminOnly } from '../middleware/adminAuth.js';

const router = express.Router();

router.use(protect);
router.use(adminOnly);

router.get('/dashboard/stats', getDashboardStats);
router.get('/reports/sales', getSalesReport);
router.get('/reports/inventory', getInventoryReport);
router.get('/users', getAllUsers);
router.put('/users/:id/role', updateUserRole);

export default router;

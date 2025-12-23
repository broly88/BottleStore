import express from 'express';
import {
  getAllProducts,
  getProductBySlug,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
  getCategories,
} from '../controllers/productController.js';
import { protect } from '../middleware/auth.js';
import { adminOnly } from '../middleware/adminAuth.js';
import { validate } from '../middleware/validation.js';
import { createProductValidator, updateProductValidator } from '../validators/productValidator.js';

const router = express.Router();

router.get('/', getAllProducts);
router.get('/featured', getFeaturedProducts);
router.get('/categories', getCategories);
router.get('/slug/:slug', getProductBySlug);
router.get('/:id', getProductById);

router.post('/', protect, adminOnly, createProductValidator, validate, createProduct);
router.put('/:id', protect, adminOnly, updateProductValidator, validate, updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);

export default router;

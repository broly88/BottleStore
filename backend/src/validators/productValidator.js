import { body } from 'express-validator';

export const createProductValidator = [
  body('name')
    .trim()
    .isLength({ min: 3 })
    .withMessage('Product name must be at least 3 characters long'),
  body('description')
    .optional()
    .trim(),
  body('category')
    .isIn(['wine', 'beer', 'spirits', 'cider', 'other'])
    .withMessage('Invalid category'),
  body('subcategory')
    .optional()
    .trim(),
  body('brand')
    .optional()
    .trim(),
  body('alcoholContent')
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage('Alcohol content must be between 0 and 100'),
  body('volumeMl')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Volume must be a positive integer'),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('stockQuantity')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Stock quantity must be a non-negative integer'),
  body('lowStockThreshold')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Low stock threshold must be a non-negative integer'),
];

export const updateProductValidator = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 3 })
    .withMessage('Product name must be at least 3 characters long'),
  body('description')
    .optional()
    .trim(),
  body('category')
    .optional()
    .isIn(['wine', 'beer', 'spirits', 'cider', 'other'])
    .withMessage('Invalid category'),
  body('subcategory')
    .optional()
    .trim(),
  body('brand')
    .optional()
    .trim(),
  body('alcoholContent')
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage('Alcohol content must be between 0 and 100'),
  body('volumeMl')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Volume must be a positive integer'),
  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('stockQuantity')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Stock quantity must be a non-negative integer'),
  body('lowStockThreshold')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Low stock threshold must be a non-negative integer'),
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean'),
  body('featured')
    .optional()
    .isBoolean()
    .withMessage('featured must be a boolean'),
];

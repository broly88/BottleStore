import express from 'express';
import {
  getUserAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from '../controllers/addressController.js';
import { protect } from '../middleware/auth.js';
import { body } from 'express-validator';
import { validate } from '../middleware/validation.js';

const router = express.Router();

router.use(protect);

const addressValidator = [
  body('streetAddress')
    .trim()
    .isLength({ min: 5 })
    .withMessage('Street address must be at least 5 characters long'),
  body('city')
    .trim()
    .isLength({ min: 2 })
    .withMessage('City must be at least 2 characters long'),
  body('province')
    .isIn([
      'Eastern Cape',
      'Free State',
      'Gauteng',
      'KwaZulu-Natal',
      'Limpopo',
      'Mpumalanga',
      'Northern Cape',
      'North West',
      'Western Cape'
    ])
    .withMessage('Invalid South African province'),
  body('postalCode')
    .trim()
    .isLength({ min: 4, max: 4 })
    .withMessage('Postal code must be 4 digits'),
];

router.get('/', getUserAddresses);
router.post('/', addressValidator, validate, createAddress);
router.put('/:id', updateAddress);
router.delete('/:id', deleteAddress);
router.put('/:id/set-default', setDefaultAddress);

export default router;

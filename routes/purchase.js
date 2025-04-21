import express from 'express';
import {checkAuthToken} from '../middleware/checkAuthToken.js';
import {
  createPurchase, 
  getPurchases,
  cancelPurchase ,
  completePurchase
} from '../controllers/purchaseController.js';

const router = express.Router();


router.use(checkAuthToken);

// Route to create a new purchase
router.post('/', createPurchase);

// Route to get all purchases of a user (buyer or seller)
router.get('/', getPurchases);

// Route to cancel a purchase
router.delete('/:purchaseId', cancelPurchase);

// Route to complete a purchase
router.patch('/purchase/:id/complete' , completePurchase);

export default router;
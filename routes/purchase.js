import express from 'express';
import {checkAuthToken} from '../middlewares/checkAuthToken.js';
import {
  createPurchase,  
} from '../controllers/purchaseController.js';

const router = express.Router();


router.use(checkAuthToken); // Apply the authentication middleware to all routes in this router

// Route to create a new purchase
router.post('/', createPurchase);

// Route to get all purchases of a user (buyer or seller)

// 

export default router;
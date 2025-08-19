import { Router } from 'express';
import authRoutes from './auth';
import chatbotRoutes from './chatbotRoutes';
import notificationRoutes from './notificationRoutes';
import priceComparisonRoutes from './priceComparisonRoutes';
import affiliateRoutes from './affiliateRoutes';
import referralRoutes from './referralRoutes';
import importRoutes from './importRoutes';

// Import controllers
import * as wishlistController from '../controllers/wishlistController';
import * as priceTrackingController from '../controllers/priceTrackingController';
import { healthCheck } from '../controllers/index';

const router = Router();

// Health check
router.get('/health', healthCheck);

// Authentication routes
router.use('/auth', authRoutes);

// AI Chatbot routes
router.use('/ai', chatbotRoutes);

// Notification routes
router.use('/notifications', notificationRoutes);

// Price comparison routes  
router.use('/compare', priceComparisonRoutes);

// Affiliate routes
router.use('/affiliate', affiliateRoutes);

// Referral routes
router.use('/referral', referralRoutes);

// Import routes
router.use('/import', importRoutes);

// Wishlist routes
router.get('/wishlist', wishlistController.getWishListItems);
router.post('/wishlist', wishlistController.addWishListItem);
router.put('/wishlist', wishlistController.editWishListItem);
router.delete('/wishlist', wishlistController.deleteWishListItem);

// Price tracking routes
router.post('/products/track', priceTrackingController.trackPrice);
router.get('/users/:userId/summary', priceTrackingController.getUserTrackingSummary);
router.get('/products/:productId/check-price', priceTrackingController.checkPriceNow);

export default router;

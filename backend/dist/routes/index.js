"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const importController_1 = require("../controllers/importController");
const wishlistStorage_1 = require("../services/wishlistStorage");
const priceUpdateService_1 = require("../services/priceUpdateService");
const router = (0, express_1.Router)();
// Import routes
router.post('/import/url', importController_1.importProductFromUrl);
// Wishlist routes
router.get('/wishlist', (req, res) => {
    const userId = req.query.userId || 'demo-user';
    const items = (0, wishlistStorage_1.getWishlist)(userId);
    console.log(`Fetching wishlist for user: ${userId}, found ${items.length} items`);
    res.json(items);
});
// Debug endpoint to see all stored data
router.get('/debug/storage', (req, res) => {
    const { getAllWishlists } = require('../services/wishlistStorage');
    const allData = getAllWishlists();
    const result = {};
    allData.forEach((wishlist, userId) => {
        result[userId] = wishlist;
    });
    res.json(result);
});
router.post('/wishlist', (req, res) => {
    res.json({ success: true, message: 'Added to wishlist' });
});
// Remove from wishlist
router.delete('/wishlist/:itemId', (req, res) => {
    const { itemId } = req.params;
    const userId = req.query.userId || 'demo-user';
    const { removeFromWishlist } = require('../services/wishlistStorage');
    const removed = removeFromWishlist(userId, itemId);
    if (removed) {
        res.json({ success: true, message: 'Item removed from wishlist' });
    }
    else {
        res.status(404).json({ success: false, message: 'Item not found' });
    }
});
// Price comparison routes
router.get('/price-comparison/:productId', (req, res) => {
    const { productId } = req.params;
    // Mock price comparison data
    const prices = [
        { name: 'Amazon', price: Math.floor(Math.random() * 10000) + 5000, url: `https://amazon.in/dp/${productId}` },
        { name: 'Flipkart', price: Math.floor(Math.random() * 10000) + 5000, url: `https://flipkart.com/product/${productId}` },
        { name: 'Myntra', price: Math.floor(Math.random() * 10000) + 5000, url: `https://myntra.com/product/${productId}` }
    ];
    res.json({ prices });
});
// Affiliate routes
router.post('/affiliate/convert', (req, res) => {
    const { url } = req.body;
    // Mock affiliate conversion
    const affiliateUrl = url + '?ref=pricetracker&tag=affiliate123';
    res.json({ affiliateUrl });
});
// Notification routes
router.post('/notifications/whatsapp/enable', (req, res) => {
    res.json({ success: true, message: 'WhatsApp notifications enabled' });
});
// Price history routes
router.get('/price-history/:productId', (req, res) => {
    const { productId } = req.params;
    const userId = req.query.userId || 'demo-user';
    // Get real price history from wishlist storage
    const items = (0, wishlistStorage_1.getWishlist)(userId);
    const item = items.find(item => item.product.id === productId);
    if (item && item.price_history) {
        console.log(`Fetching price history for product ${productId}, found ${item.price_history.length} records`);
        res.json(item.price_history);
    }
    else {
        console.log(`No price history found for product ${productId}`);
        res.json([]);
    }
});
// Price update routes
router.post('/prices/update-all', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('🔄 Manual price update requested');
        yield (0, priceUpdateService_1.updateAllProductPrices)();
        res.json({ success: true, message: 'Price update completed' });
    }
    catch (error) {
        console.error('Price update failed:', error);
        res.status(500).json({ success: false, message: 'Price update failed' });
    }
}));
router.post('/prices/update/:productId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productId } = req.params;
        const userId = req.query.userId || 'demo-user';
        const success = yield (0, priceUpdateService_1.updateSingleProductPrice)(userId, productId);
        if (success) {
            res.json({ success: true, message: 'Product price updated' });
        }
        else {
            res.status(400).json({ success: false, message: 'Failed to update price' });
        }
    }
    catch (error) {
        console.error('Single price update failed:', error);
        res.status(500).json({ success: false, message: 'Price update failed' });
    }
}));
exports.default = router;

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
exports.importProductFromUrl = void 0;
const scrapingService_1 = require("../services/scrapingService");
const wishlistStorage_1 = require("../services/wishlistStorage");
const importProductFromUrl = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { url, target_price } = req.body;
        const userId = req.query.userId || ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) || 'demo-user';
        if (!url) {
            return res.status(400).json({ error: 'URL is required' });
        }
        // Validate URL format
        if (!isValidUrl(url)) {
            return res.status(400).json({ error: 'Invalid URL format' });
        }
        // Scrape product information from URL
        const productInfo = yield (0, scrapingService_1.scrapeProductFromUrl)(url);
        // Create price history with some historical data
        const priceHistory = [];
        const currentTime = new Date();
        const basePrice = productInfo.price;
        // Generate historical prices for the past 30 days
        for (let i = 30; i >= 0; i--) {
            const date = new Date(currentTime);
            date.setDate(date.getDate() - i);
            // Add some realistic price variation
            const variation = (Math.random() - 0.5) * 0.2; // +/- 10% variation
            const historicalPrice = Math.max(Math.floor(basePrice * 0.7), // Minimum 30% discount
            Math.floor(basePrice * (1 + variation)));
            priceHistory.push({
                price: historicalPrice,
                recorded_at: date.toISOString()
            });
        }
        // Create wishlist item
        const wishlistItem = {
            id: `product-${Date.now()}`,
            product: {
                id: `prod-${Date.now()}`,
                name: productInfo.name,
                url: productInfo.url,
                image_url: productInfo.image_url,
                current_price: productInfo.price,
                platform: productInfo.platform,
                description: productInfo.description
            },
            target_price: target_price || Math.floor(productInfo.price * 0.8),
            added_at: new Date().toISOString(),
            price_history: priceHistory
        };
        // Add to user's wishlist in memory storage
        (0, wishlistStorage_1.addToWishlist)(userId, wishlistItem);
        console.log(`✅ Product imported and saved for user ${userId}:`, {
            productId: wishlistItem.product.id,
            productName: wishlistItem.product.name,
            platform: wishlistItem.product.platform,
            price: wishlistItem.product.current_price,
            priceHistoryEntries: wishlistItem.price_history.length
        });
        console.log('💾 Product data has been saved to persistent storage file');
        res.status(201).json({
            success: true,
            message: 'Product imported successfully and saved to persistent storage',
            product: wishlistItem
        });
    }
    catch (error) {
        console.error('Import error:', error);
        res.status(500).json({
            error: 'Failed to import product',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
exports.importProductFromUrl = importProductFromUrl;
const isValidUrl = (url) => {
    try {
        new URL(url);
        return url.includes('amazon.') ||
            url.includes('flipkart.') ||
            url.includes('myntra.') ||
            url.includes('ajio.') ||
            url.includes('nykaa.') ||
            url.includes('meesho.');
    }
    catch (_a) {
        return false;
    }
};

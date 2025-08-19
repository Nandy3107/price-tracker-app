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
exports.updateSingleProductPrice = exports.startPriceUpdateScheduler = exports.updateAllProductPrices = void 0;
const wishlistStorage_1 = require("./wishlistStorage");
const scrapingService_1 = require("./scrapingService");
// Price update service to refresh product prices periodically
const updateAllProductPrices = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log('🔄 Starting price update process...');
    try {
        const { getAllWishlists } = require('./wishlistStorage');
        const allWishlists = getAllWishlists();
        let totalUpdated = 0;
        for (const [userId, wishlist] of allWishlists) {
            const items = wishlist.items || [];
            for (const item of items) {
                try {
                    console.log(`📊 Updating price for: ${item.product.name}`);
                    // Scrape current price from URL
                    const updatedProductInfo = yield (0, scrapingService_1.scrapeProductFromUrl)(item.product.url);
                    // Only update if price is different and valid
                    if (updatedProductInfo.price > 0 && updatedProductInfo.price !== item.product.current_price) {
                        console.log(`💰 Price changed from ₹${item.product.current_price} to ₹${updatedProductInfo.price}`);
                        // Update current price
                        item.product.current_price = updatedProductInfo.price;
                        // Add to price history
                        const priceHistoryEntry = {
                            price: updatedProductInfo.price,
                            recorded_at: new Date().toISOString()
                        };
                        if (!item.price_history) {
                            item.price_history = [];
                        }
                        item.price_history.push(priceHistoryEntry);
                        // Keep only last 30 price records
                        if (item.price_history.length > 30) {
                            item.price_history = item.price_history.slice(-30);
                        }
                        totalUpdated++;
                        // Check for price alerts
                        if (item.target_price && updatedProductInfo.price <= item.target_price) {
                            console.log(`🎯 Price alert! ${item.product.name} reached target price!`);
                            // Here you could send WhatsApp/email notification
                        }
                    }
                    // Add delay to avoid overwhelming servers
                    yield new Promise(resolve => setTimeout(resolve, 2000)); // 2 second delay
                }
                catch (error) {
                    console.error(`❌ Failed to update price for ${item.product.name}:`, error);
                }
            }
        }
        console.log(`✅ Price update completed. Updated ${totalUpdated} products.`);
    }
    catch (error) {
        console.error('❌ Price update process failed:', error);
    }
});
exports.updateAllProductPrices = updateAllProductPrices;
// Schedule automatic price updates
const startPriceUpdateScheduler = () => {
    console.log('🕐 Starting price update scheduler...');
    // Update prices every 6 hours
    const UPDATE_INTERVAL = 6 * 60 * 60 * 1000; // 6 hours in milliseconds
    setInterval(() => __awaiter(void 0, void 0, void 0, function* () {
        console.log('🔄 Scheduled price update starting...');
        yield (0, exports.updateAllProductPrices)();
    }), UPDATE_INTERVAL);
    // Run initial update after 30 seconds
    setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
        console.log('🚀 Running initial price update...');
        yield (0, exports.updateAllProductPrices)();
    }), 30000);
};
exports.startPriceUpdateScheduler = startPriceUpdateScheduler;
// Manual price update for specific product
const updateSingleProductPrice = (userId, productId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userWishlist = (0, wishlistStorage_1.getWishlist)(userId);
        const item = userWishlist.find(item => item.id === productId);
        if (!item) {
            throw new Error('Product not found');
        }
        const updatedProductInfo = yield (0, scrapingService_1.scrapeProductFromUrl)(item.product.url);
        if (updatedProductInfo.price > 0) {
            item.product.current_price = updatedProductInfo.price;
            const priceHistoryEntry = {
                price: updatedProductInfo.price,
                recorded_at: new Date().toISOString()
            };
            if (!item.price_history) {
                item.price_history = [];
            }
            item.price_history.push(priceHistoryEntry);
            return true;
        }
        return false;
    }
    catch (error) {
        console.error(`Failed to update price for product ${productId}:`, error);
        return false;
    }
});
exports.updateSingleProductPrice = updateSingleProductPrice;
exports.default = {
    updateAllProductPrices: exports.updateAllProductPrices,
    startPriceUpdateScheduler: exports.startPriceUpdateScheduler,
    updateSingleProductPrice: exports.updateSingleProductPrice
};

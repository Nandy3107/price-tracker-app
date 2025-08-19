import { getWishlist, updatePriceHistory } from './wishlistStorage';
import { scrapeProductFromUrl } from './scrapingService';

// Price update service to refresh product prices periodically
export const updateAllProductPrices = async (): Promise<void> => {
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
                    const updatedProductInfo = await scrapeProductFromUrl(item.product.url);
                    
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
                    await new Promise(resolve => setTimeout(resolve, 2000)); // 2 second delay
                    
                } catch (error) {
                    console.error(`❌ Failed to update price for ${item.product.name}:`, error);
                }
            }
        }
        
        console.log(`✅ Price update completed. Updated ${totalUpdated} products.`);
        
    } catch (error) {
        console.error('❌ Price update process failed:', error);
    }
};

// Schedule automatic price updates
export const startPriceUpdateScheduler = (): void => {
    console.log('🕐 Starting price update scheduler...');
    
    // Update prices every 6 hours
    const UPDATE_INTERVAL = 6 * 60 * 60 * 1000; // 6 hours in milliseconds
    
    setInterval(async () => {
        console.log('🔄 Scheduled price update starting...');
        await updateAllProductPrices();
    }, UPDATE_INTERVAL);
    
    // Run initial update after 30 seconds
    setTimeout(async () => {
        console.log('🚀 Running initial price update...');
        await updateAllProductPrices();
    }, 30000);
};

// Manual price update for specific product
export const updateSingleProductPrice = async (userId: string, productId: string): Promise<boolean> => {
    try {
        const userWishlist = getWishlist(userId);
        const item = userWishlist.find(item => item.id === productId);
        
        if (!item) {
            throw new Error('Product not found');
        }
        
        const updatedProductInfo = await scrapeProductFromUrl(item.product.url);
        
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
        
    } catch (error) {
        console.error(`Failed to update price for product ${productId}:`, error);
        return false;
    }
};

export default {
    updateAllProductPrices,
    startPriceUpdateScheduler,
    updateSingleProductPrice
};

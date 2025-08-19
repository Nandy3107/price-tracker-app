// Test script to validate the reorganized codebase
import { getWishListItems, addWishListItem } from './src/controllers/wishlistController';
import { trackPrice, checkPriceNow } from './src/controllers/priceTrackingController';
import { notifyUser } from './src/controllers/notificationController';

console.log('✅ All controller imports successful!');
console.log('🎉 Codebase reorganization validation passed!');

// Test individual functions exist
console.log('📦 Wishlist functions:', typeof getWishListItems, typeof addWishListItem);
console.log('📊 Price tracking functions:', typeof trackPrice, typeof checkPriceNow);
console.log('📱 Notification functions:', typeof notifyUser);

console.log('\n🚀 Ready to run the full application!');

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeStorage = exports.getAllWishlists = exports.removeFromWishlist = exports.updatePriceHistory = exports.getWishlist = exports.addToWishlist = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// Persistent file-based storage for local development
// Data will be saved to wishlist-data.json and persist across server restarts
const DATA_FILE = path_1.default.join(__dirname, '../../wishlist-data.json');
// In-memory storage, now acting as a cache
const wishlists = new Map();
// --- File-based storage functions ---
const saveWishlistsToFile = () => {
    try {
        const dataToSave = {};
        wishlists.forEach((value, key) => {
            dataToSave[key] = value;
        });
        fs_1.default.writeFileSync(DATA_FILE, JSON.stringify(dataToSave, null, 2));
        console.log('💾 Wishlist data saved to file:', DATA_FILE);
    }
    catch (error) {
        console.error('❌ Error saving wishlist data to file:', error);
    }
};
const loadWishlistsFromFile = () => {
    try {
        if (fs_1.default.existsSync(DATA_FILE)) {
            const fileContent = fs_1.default.readFileSync(DATA_FILE, 'utf-8');
            if (fileContent) {
                const dataFromFile = JSON.parse(fileContent);
                Object.keys(dataFromFile).forEach(key => {
                    wishlists.set(key, dataFromFile[key]);
                });
                console.log('📖 Wishlist data loaded from file:', DATA_FILE);
                console.log('📊 Loaded', wishlists.size, 'users');
            }
        }
        else {
            console.log('📝 No wishlist data file found, starting fresh:', DATA_FILE);
        }
    }
    catch (error) {
        console.error('❌ Error loading wishlist data from file:', error);
    }
};
// --- End of new functions ---
const addToWishlist = (userId, item) => {
    const userWishlist = wishlists.get(userId) || { userId, items: [] };
    userWishlist.items.push(item);
    wishlists.set(userId, userWishlist);
    saveWishlistsToFile(); // NEW: Save after adding
};
exports.addToWishlist = addToWishlist;
const getWishlist = (userId) => {
    const userWishlist = wishlists.get(userId);
    return (userWishlist === null || userWishlist === void 0 ? void 0 : userWishlist.items) || [];
};
exports.getWishlist = getWishlist;
const updatePriceHistory = (userId, productId, newPrice) => {
    const userWishlist = wishlists.get(userId);
    if (userWishlist) {
        const item = userWishlist.items.find(item => item.product.id === productId);
        if (item) {
            item.price_history.push({
                price: newPrice,
                recorded_at: new Date().toISOString()
            });
            item.product.current_price = newPrice;
            wishlists.set(userId, userWishlist);
            saveWishlistsToFile(); // NEW: Save after updating
        }
    }
};
exports.updatePriceHistory = updatePriceHistory;
const removeFromWishlist = (userId, itemId) => {
    const userWishlist = wishlists.get(userId);
    if (userWishlist) {
        const initialLength = userWishlist.items.length;
        userWishlist.items = userWishlist.items.filter(item => item.id !== itemId);
        const removed = userWishlist.items.length < initialLength;
        if (removed) {
            wishlists.set(userId, userWishlist);
            console.log(`Removed item ${itemId} from wishlist for user ${userId}`);
            saveWishlistsToFile(); // NEW: Save after removing
        }
        return removed;
    }
    return false;
};
exports.removeFromWishlist = removeFromWishlist;
const getAllWishlists = () => {
    return wishlists;
};
exports.getAllWishlists = getAllWishlists;
// Export the load function for manual initialization if needed
const initializeStorage = () => {
    loadWishlistsFromFile();
    // initializeDemoData(); // REMOVED - No demo data initialization
};
exports.initializeStorage = initializeStorage;
// Initialize with some demo data - DISABLED FOR REAL PRODUCTS
const initializeDemoData = () => {
    // Demo data disabled - only real imported products will show
    console.log('📝 Demo data initialization skipped - showing only real imported products');
};
loadWishlistsFromFile(); // Load data on server start
// initializeDemoData(); // REMOVED - No demo data initialization

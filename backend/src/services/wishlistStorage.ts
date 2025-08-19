import fs from 'fs';
import path from 'path';

// Persistent file-based storage for local development
// Data will be saved to wishlist-data.json and persist across server restarts

const DATA_FILE = path.join(__dirname, '../../wishlist-data.json');

interface WishlistItem {
  id: string;
  product: {
    id: string;
    name: string;
    url: string;
    image_url: string;
    current_price: number;
    platform: string;
    description?: string;
  };
  target_price?: number;
  added_at: string; // Changed to string for JSON serialization
  price_history: Array<{
    price: number;
    recorded_at: string; // Changed to string for JSON serialization
  }>;
}

interface UserWishlist {
  userId: string;
  items: WishlistItem[];
}

// In-memory storage, now acting as a cache
const wishlists: Map<string, UserWishlist> = new Map();

// --- File-based storage functions ---

const saveWishlistsToFile = () => {
  try {
    const dataToSave: { [key: string]: UserWishlist } = {};
    wishlists.forEach((value, key) => {
      dataToSave[key] = value;
    });
    fs.writeFileSync(DATA_FILE, JSON.stringify(dataToSave, null, 2));
    console.log('💾 Wishlist data saved to file:', DATA_FILE);
  } catch (error) {
    console.error('❌ Error saving wishlist data to file:', error);
  }
};

const loadWishlistsFromFile = () => {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const fileContent = fs.readFileSync(DATA_FILE, 'utf-8');
      if (fileContent) {
        const dataFromFile = JSON.parse(fileContent);
        Object.keys(dataFromFile).forEach(key => {
          wishlists.set(key, dataFromFile[key]);
        });
        console.log('📖 Wishlist data loaded from file:', DATA_FILE);
        console.log('📊 Loaded', wishlists.size, 'users');
      }
    } else {
      console.log('📝 No wishlist data file found, starting fresh:', DATA_FILE);
    }
  } catch (error) {
    console.error('❌ Error loading wishlist data from file:', error);
  }
};

// --- End of new functions ---

export const addToWishlist = (userId: string, item: WishlistItem): void => {
  const userWishlist = wishlists.get(userId) || { userId, items: [] };
  userWishlist.items.push(item);
  wishlists.set(userId, userWishlist);
  saveWishlistsToFile(); // NEW: Save after adding
};

export const getWishlist = (userId: string): WishlistItem[] => {
  const userWishlist = wishlists.get(userId);
  return userWishlist?.items || [];
};

export const updatePriceHistory = (userId: string, productId: string, newPrice: number): void => {
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

export const removeFromWishlist = (userId: string, itemId: string): boolean => {
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

export const getAllWishlists = (): Map<string, UserWishlist> => {
  return wishlists;
};

// Export the load function for manual initialization if needed
export const initializeStorage = (): void => {
  loadWishlistsFromFile();
  // initializeDemoData(); // REMOVED - No demo data initialization
};

// Initialize with some demo data - DISABLED FOR REAL PRODUCTS
const initializeDemoData = () => {
  // Demo data disabled - only real imported products will show
  console.log('📝 Demo data initialization skipped - showing only real imported products');
};

loadWishlistsFromFile(); // Load data on server start
// initializeDemoData(); // REMOVED - No demo data initialization

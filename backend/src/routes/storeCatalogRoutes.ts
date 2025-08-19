import express from 'express';
import { storeCategories } from '../data/storeCategories';

const router = express.Router();

// GET /api/stores - returns all supported stores in all categories
router.get('/', (req, res) => {
  const stores = Object.values(storeCategories).flat();
  const categories = Object.keys(storeCategories);
  res.json({ stores, totalStores: stores.length, categories });
});

// GET /api/stores/category/:category - returns stores for a specific category
router.get('/category/:category', (req, res) => {
  const { category } = req.params;
  const stores = (storeCategories as any)[category] || [];
  res.json({ stores, totalStores: stores.length });
});

export default router;

import { Router } from 'express';
import { getPriceComparison, comparePricesAcrossPlatforms } from '../controllers/priceComparisonController';

const router = Router();

router.get('/:productId', getPriceComparison);
router.post('/compare', comparePricesAcrossPlatforms);

export default router;

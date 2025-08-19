import { Router } from 'express';
import { importProductFromUrl } from '../controllers/importController';

const router = Router();

router.post('/url', importProductFromUrl);

export default router;

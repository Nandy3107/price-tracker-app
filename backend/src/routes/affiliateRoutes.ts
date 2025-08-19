import { Router } from 'express';
import { getAffiliateLink, generateAffiliateLink } from '../controllers/affiliateController';

const router = Router();

router.post('/convert', getAffiliateLink);
router.post('/generate', generateAffiliateLink);

export default router;

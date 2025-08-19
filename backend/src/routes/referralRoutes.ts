import { Router } from 'express';
import { getReferralCode, processCashback, handleReferral } from '../controllers/referralController';

const router = Router();

router.get('/code', getReferralCode);
router.post('/cashback', processCashback);
router.post('/process', handleReferral);

export default router;

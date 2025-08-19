import { Router } from 'express';
import { register, login, googleAuth, googleCallback, verifyGoogleToken } from '../controllers/authController';

const router = Router();

router.post('/register', register);
router.post('/login', login);

// Google OAuth routes
router.get('/google', googleAuth);
router.get('/google/callback', googleCallback);
router.post('/google/verify', verifyGoogleToken);

export default router;
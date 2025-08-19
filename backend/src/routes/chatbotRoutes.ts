import { Router } from 'express';
import { chatWithBot } from '../controllers/chatbotController';

const router = Router();

router.post('/chat', chatWithBot);

export default router;

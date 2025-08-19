import { Router } from 'express';
import { enableNotifications, sendNotification, notifyUser, sendWhatsAppMessage } from '../controllers/notificationController';

const router = Router();

router.post('/enable', enableNotifications);
router.post('/send', sendNotification);
router.post('/notify-user', notifyUser);
router.post('/send-whatsapp', sendWhatsAppMessage);

export default router;

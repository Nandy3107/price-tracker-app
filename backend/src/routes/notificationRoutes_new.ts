import { Router } from 'express';
import { enableNotifications, sendNotification, notifyUser } from '../controllers/notificationController';

const router = Router();

router.post('/enable', enableNotifications);
router.post('/send', sendNotification);
router.post('/notify-user', notifyUser);

export default router;

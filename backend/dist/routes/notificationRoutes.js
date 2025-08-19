"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const notificationController_1 = require("../controllers/notificationController");
const router = (0, express_1.Router)();
router.post('/whatsapp/enable', notificationController_1.enableNotifications);
router.post('/whatsapp/send', notificationController_1.sendNotification);
exports.default = router;

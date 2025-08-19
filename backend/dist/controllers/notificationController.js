"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendNotification = exports.enableNotifications = void 0;
const notificationService_1 = require("../services/notificationService");
const enableNotifications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { productId } = req.body;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id; // Assuming auth middleware sets user
    if (!productId || !userId) {
        return res.status(400).json({ error: 'Missing productId or user not authenticated' });
    }
    const success = yield (0, notificationService_1.enableWhatsAppNotifications)(userId, productId);
    res.json({ success, message: 'WhatsApp notifications enabled' });
});
exports.enableNotifications = enableNotifications;
const sendNotification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { phoneNumber, productName, newPrice } = req.body;
    if (!phoneNumber || !productName || !newPrice) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    const success = yield (0, notificationService_1.sendPriceDropNotification)(phoneNumber, productName, newPrice);
    res.json({ success });
});
exports.sendNotification = sendNotification;

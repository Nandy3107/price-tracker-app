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
exports.sendPriceDropNotification = exports.enableWhatsAppNotifications = void 0;
// WhatsApp Notification Service
const enableWhatsAppNotifications = (userId, productId) => __awaiter(void 0, void 0, void 0, function* () {
    // Stub: Replace with real WhatsApp API integration
    console.log(`Enabling WhatsApp notifications for user ${userId} and product ${productId}`);
    return true;
});
exports.enableWhatsAppNotifications = enableWhatsAppNotifications;
const sendPriceDropNotification = (phoneNumber, productName, newPrice) => __awaiter(void 0, void 0, void 0, function* () {
    // Stub: Replace with real WhatsApp Business API
    console.log(`Sending WhatsApp notification to ${phoneNumber}: ${productName} price dropped to ₹${newPrice}`);
    return true;
});
exports.sendPriceDropNotification = sendPriceDropNotification;

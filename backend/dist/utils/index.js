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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateDiscount = exports.formatPrice = exports.generateAffiliateLink = exports.sendWhatsAppNotification = void 0;
const axios_1 = __importDefault(require("axios"));
const sendWhatsAppNotification = (phoneNumber, message) => __awaiter(void 0, void 0, void 0, function* () {
    const apiUrl = 'https://api.whatsapp.com/send';
    const params = {
        phone: phoneNumber,
        text: message,
    };
    try {
        const response = yield axios_1.default.get(apiUrl, { params });
        return response.data;
    }
    catch (error) {
        console.error('Error sending WhatsApp notification:', error);
        throw new Error('Failed to send WhatsApp notification');
    }
});
exports.sendWhatsAppNotification = sendWhatsAppNotification;
const generateAffiliateLink = (productUrl, affiliateId) => {
    const url = new URL(productUrl);
    url.searchParams.append('aff_id', affiliateId);
    return url.toString();
};
exports.generateAffiliateLink = generateAffiliateLink;
const formatPrice = (price) => {
    return `$${price.toFixed(2)}`;
};
exports.formatPrice = formatPrice;
const calculateDiscount = (originalPrice, discountedPrice) => {
    return ((originalPrice - discountedPrice) / originalPrice) * 100;
};
exports.calculateDiscount = calculateDiscount;

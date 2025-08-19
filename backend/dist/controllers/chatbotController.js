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
exports.chatWithBot = void 0;
const chatbotService_1 = require("../services/chatbotService");
const wishlistStorage_1 = require("../services/wishlistStorage");
const chatWithBot = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { message, context, userId } = req.body;
        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }
        // Get user's wishlist for context
        const userWishlist = userId ? (0, wishlistStorage_1.getWishlist)(userId) : [];
        // Use enhanced chatbot with shopping context
        const response = yield (0, chatbotService_1.getChatbotResponseWithContext)(message, userWishlist, (context === null || context === void 0 ? void 0 : context.recentPriceDrops) || []);
        res.json({
            response,
            timestamp: new Date().toISOString(),
            contextUsed: {
                trackedProducts: userWishlist.length,
                userProvided: !!context
            }
        });
    }
    catch (error) {
        console.error('Chatbot error:', error);
        res.status(500).json({
            error: 'Sorry, I encountered an issue. Please try again.',
            fallback: true
        });
    }
});
exports.chatWithBot = chatWithBot;

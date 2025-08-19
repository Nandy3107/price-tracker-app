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
exports.getChatbotResponseWithContext = exports.getChatbotResponse = void 0;
const axios_1 = __importDefault(require("axios"));
const getChatbotResponse = (message_1, ...args_1) => __awaiter(void 0, [message_1, ...args_1], void 0, function* (message, context = {}) {
    try {
        // Use Google Gemini API (free tier)
        const response = yield getGeminiResponse(message, context);
        return response;
    }
    catch (error) {
        console.error('AI service error:', error);
        // Fallback to intelligent static responses if API fails
        return getIntelligentFallbackResponse(message, context);
    }
});
exports.getChatbotResponse = getChatbotResponse;
const getGeminiResponse = (message, context) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f;
    // Google Gemini API endpoint (free tier)
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyBJ1Y2fzX8L4p3QKvN9sT7uW2eR5mA6cD8'; // Default demo key
    const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`;
    const prompt = buildPriceTrackerPrompt(message, context);
    const requestBody = {
        contents: [{
                parts: [{
                        text: prompt
                    }]
            }],
        generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
        },
        safetySettings: [
            {
                category: "HARM_CATEGORY_HARASSMENT",
                threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
                category: "HARM_CATEGORY_HATE_SPEECH",
                threshold: "BLOCK_MEDIUM_AND_ABOVE"
            }
        ]
    };
    const response = yield axios_1.default.post(GEMINI_API_URL, requestBody, {
        headers: {
            'Content-Type': 'application/json'
        },
        timeout: 10000
    });
    if ((_f = (_e = (_d = (_c = (_b = (_a = response.data) === null || _a === void 0 ? void 0 : _a.candidates) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.content) === null || _d === void 0 ? void 0 : _d.parts) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.text) {
        return response.data.candidates[0].content.parts[0].text.trim();
    }
    else {
        throw new Error('Invalid response from Gemini API');
    }
});
const buildPriceTrackerPrompt = (userMessage, context) => {
    const systemContext = `
You are an AI shopping assistant for a price tracker app (like BuyHatke). Your role is to help users with:
- Price tracking and alerts
- Finding the best deals
- Product recommendations
- Shopping advice
- Platform comparisons (Amazon, Flipkart, Myntra, etc.)

User's context:
- Tracked products: ${context.trackedProducts || 0}
- Recent price drops: ${context.recentDrops || 0}
- Platform preferences: ${context.platforms || 'All platforms'}

Guidelines:
- Be helpful and friendly
- Focus on shopping and price tracking
- Provide actionable advice
- Keep responses concise (under 100 words)
- Mention specific Indian shopping platforms when relevant

User message: "${userMessage}"

Respond as a helpful shopping assistant:`;
    return systemContext;
};
const getIntelligentFallbackResponse = (message, context) => {
    const messageLower = message.toLowerCase();
    // Price-related queries
    if (messageLower.includes('price') || messageLower.includes('cost') || messageLower.includes('cheap')) {
        return "I can help you track prices! I monitor your wishlist items and alert you when prices drop. Would you like me to check for any current deals on your tracked products?";
    }
    // Deal-related queries
    if (messageLower.includes('deal') || messageLower.includes('offer') || messageLower.includes('discount')) {
        return "Great deals are always changing! I track prices across Amazon, Flipkart, Myntra, and other platforms. Set up price alerts for your favorite items to never miss a good deal!";
    }
    // Platform comparisons
    if (messageLower.includes('amazon') || messageLower.includes('flipkart') || messageLower.includes('myntra')) {
        return "I can compare prices across different platforms for you! Amazon often has competitive prices, Flipkart has great sales, and Myntra excels in fashion. Would you like me to compare prices for a specific product?";
    }
    // Shopping advice
    if (messageLower.includes('buy') || messageLower.includes('purchase') || messageLower.includes('should i')) {
        return "Based on price history and trends, I can help you decide the best time to buy! Generally, prices drop during major sales like Diwali, Black Friday, or end-of-season clearances. What product are you considering?";
    }
    // Wishlist help
    if (messageLower.includes('wishlist') || messageLower.includes('track') || messageLower.includes('add')) {
        return "Your wishlist is your shopping command center! Add products you're interested in, set target prices, and I'll monitor them 24/7. You'll get alerts when prices drop to your desired range.";
    }
    // General greeting
    if (messageLower.includes('hello') || messageLower.includes('hi') || messageLower.includes('help')) {
        return "Hello! I'm your AI shopping assistant. I help you track prices, find deals, and make smart purchasing decisions. You can ask me about price trends, platform comparisons, or when to buy specific products!";
    }
    // Alerts and notifications
    if (messageLower.includes('alert') || messageLower.includes('notification') || messageLower.includes('notify')) {
        return "I can set up WhatsApp and email alerts for your tracked products! You'll get notified when prices drop below your target price or when there are special deals. Want me to enable alerts for your wishlist items?";
    }
    // Default intelligent response
    return "I'm here to help you save money and find the best deals! Ask me about price tracking, product comparisons, or shopping advice. I monitor prices across all major Indian e-commerce platforms 24/7.";
};
// Enhanced chatbot with shopping context
const getChatbotResponseWithContext = (message_1, ...args_1) => __awaiter(void 0, [message_1, ...args_1], void 0, function* (message, userWishlist = [], recentPriceDrops = []) {
    const context = {
        trackedProducts: userWishlist.length,
        recentDrops: recentPriceDrops.length,
        platforms: [...new Set(userWishlist.map(item => { var _a; return (_a = item.product) === null || _a === void 0 ? void 0 : _a.platform; }))].join(', '),
        wishlistItems: userWishlist.map(item => {
            var _a, _b, _c;
            return ({
                name: (_a = item.product) === null || _a === void 0 ? void 0 : _a.name,
                price: (_b = item.product) === null || _b === void 0 ? void 0 : _b.current_price,
                target: item.target_price,
                platform: (_c = item.product) === null || _c === void 0 ? void 0 : _c.platform
            });
        })
    };
    return (0, exports.getChatbotResponse)(message, context);
});
exports.getChatbotResponseWithContext = getChatbotResponseWithContext;

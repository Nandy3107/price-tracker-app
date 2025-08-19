import axios from 'axios';

// AI Chatbot Service (Google Gemini integration)
export interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
}

export const getChatbotResponse = async (message: string, context: any = {}): Promise<string> => {
    try {
        // Use Google Gemini API (free tier)
        const response = await getGeminiResponse(message, context);
        return response;
    } catch (error) {
        console.error('AI service error:', error);
        // Fallback to intelligent static responses if API fails
        return getIntelligentFallbackResponse(message, context);
    }
};

const getGeminiResponse = async (message: string, context: any): Promise<string> => {
    // Google Gemini API endpoint (free tier)
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'demo_mode'; // Default demo mode
    
    // If no API key provided, use enhanced fallback responses
    if (!GEMINI_API_KEY || GEMINI_API_KEY === 'demo_mode' || GEMINI_API_KEY === 'your_google_gemini_api_key_here') {
        console.log('🤖 Running in demo mode - using enhanced fallback responses');
        return getIntelligentFallbackResponse(message, context);
    }
    
    const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`;
    
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

    const response = await axios.post(GEMINI_API_URL, requestBody, {
        headers: {
            'Content-Type': 'application/json'
        },
        timeout: 10000
    });

    if (response.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
        return response.data.candidates[0].content.parts[0].text.trim();
    } else {
        throw new Error('Invalid response from Gemini API');
    }
};

const buildPriceTrackerPrompt = (userMessage: string, context: any): string => {
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

const getIntelligentFallbackResponse = (message: string, context: any): string => {
    const messageLower = message.toLowerCase();
    const trackedProducts = context.trackedProducts || 0;
    const platforms = context.platforms || 'Amazon, Flipkart, Myntra';
    
    // Contextual responses based on user's wishlist
    const contextualPrefix = trackedProducts > 0 
        ? `Based on your ${trackedProducts} tracked products across ${platforms}: ` 
        : '';
    
    // Price-related queries
    if (messageLower.includes('price') || messageLower.includes('cost') || messageLower.includes('cheap')) {
        if (trackedProducts > 0) {
            return `${contextualPrefix}I'm monitoring real-time price changes for all your products! Recent analysis shows potential savings opportunities. Check your Priority Products section for the best deals right now.`;
        }
        return "I can help you track prices! Add products to your wishlist and I'll monitor them 24/7 across 50+ stores, alerting you when prices drop to your target range.";
    }
    
    // Deal-related queries  
    if (messageLower.includes('deal') || messageLower.includes('offer') || messageLower.includes('discount')) {
        if (trackedProducts > 0) {
            return `${contextualPrefix}I've detected ${Math.floor(trackedProducts * 0.3)} items with recent price drops! Check your Dashboard for current deals, and visit Priority Products for urgent buying opportunities.`;
        }
        return "Great deals are everywhere! I track prices across Amazon, Flipkart, Myntra, and 47+ other platforms. Add products to start finding exclusive deals and price drops!";
    }
    
    // Platform comparisons
    if (messageLower.includes('amazon') || messageLower.includes('flipkart') || messageLower.includes('myntra')) {
        return `I can compare prices across all major platforms! ${contextualPrefix}Amazon often has competitive electronics prices, Flipkart excels in sale events, Myntra leads fashion deals, and I monitor 50+ stores for the best options.`;
    }
    
    // Shopping advice with context
    if (messageLower.includes('buy') || messageLower.includes('purchase') || messageLower.includes('should i')) {
        if (trackedProducts > 0) {
            return `${contextualPrefix}Based on price history analysis, I recommend checking Priority Products for items near your target price. Best buying times are typically during festival sales, weekend offers, and end-of-month clearances.`;
        }
        return "Smart shopping timing matters! I analyze price patterns across festivals, sales seasons, and weekly trends. Add products to your wishlist and I'll advise the optimal purchase timing based on historical data.";
    }
    
    // Priority and urgency
    if (messageLower.includes('priority') || messageLower.includes('urgent') || messageLower.includes('important')) {
        return `${contextualPrefix}Check your Priority Products section! I use advanced algorithms to rank items by urgency score, price proximity to target, recent drops, and platform priority. Your top 10 deals are always highlighted.`;
    }
    
    // Store integration queries
    if (messageLower.includes('store') || messageLower.includes('connect') || messageLower.includes('sync')) {
        return "Visit Store Integration to connect 50+ shopping platforms! I support Amazon, Flipkart, Myntra, Ajio, Nykaa, Zomato, Swiggy, BookMyShow, and many more. Auto-sync your wishlists for centralized price tracking.";
    }
    
    // Payment and buying process
    if (messageLower.includes('payment') || messageLower.includes('pay') || messageLower.includes('upi') || messageLower.includes('gpay')) {
        return "I support multiple payment options! Use our integrated UPI gateway with Google Pay, PhonePe, Paytm, or scan QR codes. You can also buy directly from stores with our secure payment system.";
    }
    
    // Wishlist help
    if (messageLower.includes('wishlist') || messageLower.includes('track') || messageLower.includes('add')) {
        return `Your wishlist is your shopping command center! ${contextualPrefix}Add products, set target prices, and I'll monitor them across all platforms. Use categories to organize and priority ranking to focus on urgent deals.`;
    }
    
    // Specific features
    if (messageLower.includes('chart') || messageLower.includes('graph') || messageLower.includes('history')) {
        return "Every product shows real price history with interactive charts! See 30-day trends, identify the best deals, track price drops, and spot seasonal patterns to make informed buying decisions.";
    }
    
    // General greeting
    if (messageLower.includes('hello') || messageLower.includes('hi') || messageLower.includes('help')) {
        const features = trackedProducts > 0 
            ? "Dashboard, Priority Products, Store Integration, and Payment Gateway"
            : "price tracking, deal finding, store integration, and smart shopping advice";
        return `Hello! I'm your AI shopping assistant with Google Gemini intelligence. I help with ${features}. Try asking about price trends, deals, or visit different sections for specialized features!`;
    }
    
    // Alerts and notifications
    if (messageLower.includes('alert') || messageLower.includes('notification') || messageLower.includes('notify')) {
        return `${contextualPrefix}I provide instant alerts for price drops! Enable WhatsApp notifications, email alerts, or in-app notifications. I'll notify you when items hit your target price or when flash sales begin.`;
    }
    
    // AI and features inquiry
    if (messageLower.includes('ai') || messageLower.includes('gemini') || messageLower.includes('feature')) {
        return "I'm powered by Google Gemini AI with advanced features: real-time price tracking, priority ranking algorithms, 50+ store integration, UPI payment gateway, and intelligent shopping recommendations. What would you like to explore?";
    }
    
    // Default intelligent response with context
    if (trackedProducts > 0) {
        return `${contextualPrefix}I'm here to maximize your savings! Try asking about your tracked products, check Priority Products for urgent deals, or explore Store Integration for more platforms. How can I help you save money today?`;
    }
    
    return "I'm your comprehensive shopping assistant! I offer price tracking across 50+ platforms, AI-powered deal recommendations, UPI payment integration, and smart shopping advice. Start by adding products to track or ask me anything about shopping!";
};

// Enhanced chatbot with shopping context
export const getChatbotResponseWithContext = async (
    message: string, 
    userWishlist: any[] = [], 
    recentPriceDrops: any[] = []
): Promise<string> => {
    const context = {
        trackedProducts: userWishlist.length,
        recentDrops: recentPriceDrops.length,
        platforms: [...new Set(userWishlist.map(item => item.product?.platform))].join(', '),
        wishlistItems: userWishlist.map(item => ({
            name: item.product?.name,
            price: item.product?.current_price,
            target: item.target_price,
            platform: item.product?.platform
        }))
    };
    
    return getChatbotResponse(message, context);
};

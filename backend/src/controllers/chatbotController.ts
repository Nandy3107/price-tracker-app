import { Request, Response } from 'express';
import { getChatbotResponse, getChatbotResponseWithContext } from '../services/chatbotService';
import { getWishlist } from '../services/wishlistStorage';

export const chatWithBot = async (req: Request, res: Response) => {
    try {
        const { message, context, userId } = req.body;
        
        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }
        
        // Get user's wishlist for context
        const userWishlist = userId ? getWishlist(userId) : [];
        
        // Use enhanced chatbot with shopping context
        const response = await getChatbotResponseWithContext(
            message, 
            userWishlist, 
            context?.recentPriceDrops || []
        );
        
        res.json({ 
            response,
            timestamp: new Date().toISOString(),
            contextUsed: {
                trackedProducts: userWishlist.length,
                userProvided: !!context
            }
        });
    } catch (error) {
        console.error('Chatbot error:', error);
        res.status(500).json({ 
            error: 'Sorry, I encountered an issue. Please try again.',
            fallback: true
        });
    }
};

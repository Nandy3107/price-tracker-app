import { Request, Response } from 'express';
import { enableWhatsAppNotifications, sendPriceDropNotification } from '../services/notificationService';
import { Product } from '../models/Product';
import aiService from '../services/aiService';
import whatsappService from '../services/whatsappService';

export const enableNotifications = async (req: Request, res: Response) => {
    const { productId } = req.body;
    const userId = (req as any).user?.id; // Assuming auth middleware sets user
    
    if (!productId || !userId) {
        return res.status(400).json({ error: 'Missing productId or user not authenticated' });
    }
    
    const success = await enableWhatsAppNotifications(userId, productId);
    res.json({ success, message: 'WhatsApp notifications enabled' });
};

export const sendNotification = async (req: Request, res: Response) => {
    const { phoneNumber, productName, newPrice } = req.body;
    
    if (!phoneNumber || !productName || !newPrice) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const success = await sendPriceDropNotification(phoneNumber, productName, newPrice);
    res.json({ success });
};

// AI-powered notification system with WhatsApp integration
export const notifyUser = async (req: Request, res: Response) => {
  try {
    const { userId, productId, notificationType = 'price_drop', targetPrice, whatsappNumber } = req.body;
    
    // Get product details
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if price has hit target (for automatic notifications)
    const priceHitTarget = targetPrice && product.current_price <= targetPrice;

    // Generate AI-powered notification message
    const notificationPrompt = `
      Generate a smart ${notificationType} notification message for:
      Product: ${product.name}
      Current Price: ₹${product.current_price}
      ${targetPrice ? `Target Price: ₹${targetPrice}` : ''}
      Platform: ${product.platform}
      ${priceHitTarget ? 'URGENT: Target price reached!' : ''}
      
      Create an engaging, personalized notification that encourages immediate action.
      Keep it under 100 characters for WhatsApp.
    `;

    const aiResponse = await aiService.getAIResponse(notificationPrompt, 'gemini-2.0-flash-exp');
    const notificationMessage = typeof aiResponse === 'string' ? aiResponse : aiResponse.response;

    // Send WhatsApp notification if phone number provided
    let whatsappSent = false;
    if (whatsappNumber && priceHitTarget) {
      try {
        whatsappSent = await whatsappService.sendPriceAlert({
          to: whatsappNumber,
          message: notificationMessage.substring(0, 100),
          productInfo: {
            name: product.name,
            currentPrice: product.current_price,
            targetPrice: targetPrice || product.current_price,
            platform: product.platform,
            url: product.url,
            image: product.image_url
          }
        });
      } catch (whatsappError) {
        console.error('WhatsApp notification failed:', whatsappError);
      }
    }

    // Log notification delivery
    console.log(`📱 Notification sent to user ${userId}: ${notificationMessage}`);
    if (whatsappSent) {
      console.log(`✅ WhatsApp alert sent to ${whatsappNumber}`);
    }

    res.json({
      success: true,
      message: 'AI-powered notification sent successfully',
      data: {
        userId,
        productId,
        notificationType,
        aiMessage: notificationMessage.substring(0, 100),
        priceHitTarget,
        whatsappSent,
        currentPrice: product.current_price,
        targetPrice,
        savings: targetPrice ? Math.max(0, targetPrice - product.current_price) : 0,
        timestamp: new Date()
      }
    });
  } catch (error) {
    console.error('Notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send notification',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const sendWhatsAppMessage = async (req: Request, res: Response) => {
    const { to, message, productInfo } = req.body;
    if (!to || !message) {
        return res.status(400).json({ error: 'Missing required fields: to, message' });
    }
    try {
        const success = await whatsappService.sendPriceAlert({ to, message, productInfo });
        res.json({ success });
    } catch (error: any) {
        res.status(500).json({ success: false, error: (error && error.message) ? error.message : 'Failed to send WhatsApp message' });
    }
};

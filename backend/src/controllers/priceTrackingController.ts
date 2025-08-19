import { Request, Response } from 'express';
import { Product } from '../models/Product';
import { Wishlist } from '../models/index';
import realTimePriceMonitor from '../services/realTimePriceMonitor';

// Real-time price tracking with AI analysis
export const trackPrice = async (req: Request, res: Response) => {
  try {
    const { productUrl, userId } = req.body;
    
    if (!productUrl) {
      return res.status(400).json({ 
        success: false, 
        message: 'Product URL is required' 
      });
    }

    console.log(`🔍 Tracking price for: ${productUrl}`);
    
    // Monitor price using enhanced real-time service
    const priceData = await realTimePriceMonitor.monitorProductPrice(productUrl);
    
    if (!priceData) {
      return res.status(404).json({
        success: false,
        message: 'Could not extract price data from the provided URL'
      });
    }

    // Create or update product in database
    let product = await Product.findOne({ url: productUrl });
    
    if (!product) {
      // Create new product entry
      product = new Product({
        name: `Product ${priceData.productId}`,
        url: productUrl,
        current_price: priceData.currentPrice,
        platform: priceData.source,
        category: 'General',
        availability: priceData.availability,
        priceHistory: [{
          price: priceData.currentPrice,
          date: new Date(),
          source: priceData.source
        }]
      });
      await product.save();
    }

    res.json({
      success: true,
      message: 'Price tracking initiated successfully',
      data: {
        product: {
          id: product._id,
          name: product.name,
          url: product.url,
          currentPrice: priceData.currentPrice,
          platform: priceData.source,
          availability: priceData.availability
        },
        priceData,
        aiPrediction: priceData.pricePrediction
      }
    });
  } catch (error) {
    console.error('Price tracking error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Price tracking failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get user's tracking summary with AI insights
export const getUserTrackingSummary = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    
    // Get user's wishlist
    const wishlist = await Wishlist.findOne({ userId });
    const wishlistCount = wishlist ? wishlist.items.length : 0;
    
    // Get user's tracked products
    const trackedProducts = await Product.find({ isActive: true }).limit(10);
    
    // Generate AI-powered insights
    const aiService = await import('../services/aiService');
    const insightsPrompt = `
      Generate shopping insights for a user with:
      - ${wishlistCount} items in wishlist
      - ${trackedProducts.length} products being tracked
      
      Recent tracked products:
      ${trackedProducts.map(p => `- ${p.name}: ₹${p.current_price} on ${p.platform}`).join('\n')}
      
      Provide 3 personalized insights about their shopping patterns and money-saving opportunities.
      Keep each insight under 50 characters.
    `;

    const aiResponse = await aiService.default.getAIResponse(insightsPrompt, 'gemini-2.0-flash-exp');
    const insights = typeof aiResponse === 'string' ? aiResponse : aiResponse.response;

    res.json({
      success: true,
      message: 'User tracking summary retrieved successfully',
      data: {
        userId,
        summary: {
          wishlistItems: wishlistCount,
          trackedProducts: trackedProducts.length,
          totalSavings: Math.floor(Math.random() * 5000) + 500, // Simulated savings
          alertsReceived: Math.floor(Math.random() * 20) + 5,
        },
        recentProducts: trackedProducts.slice(0, 5).map(p => ({
          id: p._id,
          name: p.name,
          currentPrice: p.current_price,
          platform: p.platform,
          lastChecked: p.lastChecked
        })),
        aiInsights: insights.split('\n').filter(i => i.trim()).slice(0, 3),
        generatedAt: new Date()
      }
    });
  } catch (error) {
    console.error('User summary error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user summary',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Check price now for a specific product
export const checkPriceNow = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    
    const priceData = await realTimePriceMonitor.checkPriceNow(productId);
    
    if (!priceData) {
      return res.status(404).json({
        success: false,
        message: 'Could not get current price for this product'
      });
    }

    res.json({
      success: true,
      message: 'Current price retrieved successfully',
      data: priceData
    });
  } catch (error) {
    console.error('Check price error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check current price',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

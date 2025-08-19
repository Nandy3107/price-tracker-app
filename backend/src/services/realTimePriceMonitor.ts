import axios from 'axios';
import * as cheerio from 'cheerio';
import { Product } from '../models/Product';
import { Wishlist } from '../models/index';
import aiService from './aiService';
import whatsappService from './whatsappService';
import { scrapeProductFromUrl } from './scrapingService';

interface LivePriceData {
  productId: string;
  currentPrice: number;
  originalPrice?: number;
  discount?: number;
  availability: string;
  lastUpdated: Date;
  source: string;
  pricePrediction?: {
    trend: 'increasing' | 'decreasing' | 'stable';
    confidence: number;
    nextWeekPrediction?: number;
    recommendation: string;
  };
}

class RealTimePriceMonitor {
  private monitoringInterval: NodeJS.Timeout | null = null;
  private isMonitoring = false;

  // AI-powered price analysis using Gemini 2.0
  private async analyzePriceWithAI(product: any, currentPrice: number): Promise<LivePriceData['pricePrediction']> {
    try {
      const priceHistory = product.priceHistory?.slice(-10) || []; // Last 10 price points
      
      const analysisPrompt = `
        Analyze this product's price trend and predict future pricing:
        
        Product: ${product.name}
        Current Price: ₹${currentPrice}
        Platform: ${product.platform}
        Category: ${product.category}
        
        Recent Price History:
        ${priceHistory.map((h: any, i: number) => `${i + 1}. ₹${h.price} on ${h.date}`).join('\n')}
        
        Please provide:
        1. Price trend (increasing/decreasing/stable)
        2. Confidence level (0-100%)
        3. Predicted price for next week
        4. Buy/wait recommendation with reasoning
        
        Respond in JSON format: {"trend": "...", "confidence": 85, "nextWeekPrediction": 1250, "recommendation": "..."}
      `;

      const aiResponse = await aiService.getAIResponse(analysisPrompt, 'gemini-2.0-flash-exp');
      
      // Extract text from AI response
      const responseText = typeof aiResponse === 'string' ? aiResponse : aiResponse.response || '';
      
      // Try to parse AI response as JSON
      try {
        const analysis = JSON.parse(responseText);
        return {
          trend: analysis.trend || 'stable',
          confidence: analysis.confidence || 50,
          nextWeekPrediction: analysis.nextWeekPrediction,
          recommendation: analysis.recommendation || 'Monitor price trends'
        };
      } catch (parseError) {
        // Fallback analysis based on price history
        return this.fallbackPriceAnalysis(priceHistory, currentPrice);
      }
    } catch (error) {
      console.error('AI price analysis failed:', error);
      return this.fallbackPriceAnalysis(product.priceHistory || [], currentPrice);
    }
  }

  // Fallback price analysis without AI
  private fallbackPriceAnalysis(priceHistory: any[], currentPrice: number): LivePriceData['pricePrediction'] {
    if (priceHistory.length < 2) {
      return {
        trend: 'stable',
        confidence: 30,
        recommendation: 'Need more data for accurate prediction'
      };
    }

    const recentPrices = priceHistory.slice(-5).map(h => h.price);
    const avgPrice = recentPrices.reduce((a, b) => a + b, 0) / recentPrices.length;
    const priceDiff = currentPrice - avgPrice;
    const percentChange = (priceDiff / avgPrice) * 100;

    let trend: 'increasing' | 'decreasing' | 'stable' = 'stable';
    let recommendation = 'Current pricing is stable';

    if (percentChange > 5) {
      trend = 'increasing';
      recommendation = 'Price is rising. Consider buying now if needed.';
    } else if (percentChange < -5) {
      trend = 'decreasing';
      recommendation = 'Price is dropping. Good time to buy!';
    }

    return {
      trend,
      confidence: Math.min(80, Math.max(40, 100 - Math.abs(percentChange) * 2)),
      nextWeekPrediction: Math.round(currentPrice + (priceDiff * 0.3)),
      recommendation
    };
  }

  // Extract product ID from URL
  private extractProductId(url: string): string {
    if (url.includes('amazon')) {
      const match = url.match(/\/dp\/([A-Z0-9]{10})/);
      return match ? match[1] : '';
    }
    if (url.includes('flipkart')) {
      const match = url.match(/\/p\/([a-zA-Z0-9]+)/);
      return match ? match[1] : '';
    }
    return '';
  }

  // Main price monitoring function using dedicated scraping service
  async monitorProductPrice(productUrl: string): Promise<LivePriceData | null> {
    console.log(`🔍 Monitoring price for: ${productUrl}`);

    try {
      // Use the dedicated scraping service
      const productInfo = await scrapeProductFromUrl(productUrl);
      
      if (productInfo && productInfo.price > 0) {
        return {
          productId: this.extractProductId(productUrl),
          currentPrice: productInfo.price,
          availability: 'In Stock', // Default availability
          lastUpdated: new Date(),
          source: productInfo.platform
        };
      }

      return null;
    } catch (error) {
      console.error('Price monitoring failed:', error instanceof Error ? error.message : 'Unknown error');
      return null;
    }
  }

  // Start continuous monitoring for all products
  async startRealTimeMonitoring(): Promise<void> {
    if (this.isMonitoring) {
      console.log('⚠️ Monitoring already active');
      return;
    }

    console.log('🚀 Starting real-time price monitoring...');
    this.isMonitoring = true;

    this.monitoringInterval = setInterval(async () => {
      try {
        // Get all products from database
        const products = await Product.find({ isActive: true });
        
        console.log(`📊 Monitoring ${products.length} products...`);

        for (const product of products) {
          try {
            const livePrice = await this.monitorProductPrice(product.url);
            
            if (livePrice && livePrice.currentPrice !== product.current_price) {
              console.log(`💰 Price change detected for ${product.name}:`);
              console.log(`   Old: ₹${product.current_price} → New: ₹${livePrice.currentPrice}`);
              
              // Get AI-powered price analysis
              const aiAnalysis = await this.analyzePriceWithAI(product, livePrice.currentPrice);
              if (aiAnalysis) {
                livePrice.pricePrediction = aiAnalysis;
                console.log(`🤖 AI Analysis: ${aiAnalysis.trend} trend (${aiAnalysis.confidence}% confidence)`);
                console.log(`📊 Recommendation: ${aiAnalysis.recommendation}`);
              }
              
              // Check for target price hits and send WhatsApp notifications
              await this.checkTargetPriceAndNotify(product, livePrice.currentPrice);
              
              // Update product with new price and AI insights
              await Product.findByIdAndUpdate(product._id, {
                current_price: livePrice.currentPrice,
                lastChecked: new Date(),
                priceHistory: [
                  ...product.priceHistory,
                  {
                    price: livePrice.currentPrice,
                    date: new Date(),
                    source: livePrice.source
                  }
                ].slice(-50) // Keep last 50 price points
              });

              // Emit price change event with AI insights
              this.emitPriceChange(product._id, {
                oldPrice: product.current_price,
                newPrice: livePrice.currentPrice,
                productName: product.name,
                aiAnalysis: livePrice.pricePrediction
              });
            }
          } catch (error) {
            console.error(`Error monitoring ${product.name}:`, error instanceof Error ? error.message : 'Unknown error');
          }
        }
      } catch (error) {
        console.error('Monitoring cycle error:', error instanceof Error ? error.message : 'Unknown error');
      }
    }, 30000); // Check every 30 seconds

    console.log('✅ Real-time monitoring started (30-second intervals)');
  }

  // Stop monitoring
  stopMonitoring(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
    this.isMonitoring = false;
    console.log('🛑 Real-time monitoring stopped');
  }

  // Emit price change event
  private emitPriceChange(productId: string, priceData: any): void {
    // This would integrate with WebSocket service for real-time notifications
    console.log(`📢 Price change event for product ${productId}:`, priceData);
  }

  // Manual price check for specific product with AI analysis
  async checkPriceNow(productId: string): Promise<LivePriceData | null> {
    try {
      const product = await Product.findById(productId);
      if (!product) {
        throw new Error('Product not found');
      }

      const livePrice = await this.monitorProductPrice(product.url);
      
      if (livePrice) {
        // Get AI-powered analysis
        const aiAnalysis = await this.analyzePriceWithAI(product, livePrice.currentPrice);
        if (aiAnalysis) {
          livePrice.pricePrediction = aiAnalysis;
        }
        
        // Update product immediately
        await Product.findByIdAndUpdate(productId, {
          current_price: livePrice.currentPrice,
          lastChecked: new Date()
        });

        console.log(`🔍 Manual price check completed for ${product.name}`);
        console.log(`💰 Current Price: ₹${livePrice.currentPrice}`);
        if (aiAnalysis) {
          console.log(`🤖 AI Prediction: ${aiAnalysis.trend} trend, ${aiAnalysis.recommendation}`);
        }
      }

      return livePrice;
    } catch (error) {
      console.error('Manual price check failed:', error instanceof Error ? error.message : 'Unknown error');
      return null;
    }
  }

  /**
   * Check if current price hits user's target price and send WhatsApp notification
   */
  private async checkTargetPriceAndNotify(product: any, currentPrice: number): Promise<void> {
    try {
      // Find all users who have this product in their wishlist with target prices
      const wishlists = await Wishlist.find({
        'items.product.id': product._id.toString(),
        'items.target_price': { $exists: true, $gte: currentPrice }
      }).populate('userId');

      for (const wishlist of wishlists) {
        const userProduct = wishlist.items.find((item: any) => 
          item.product.id === product._id.toString() && 
          item.target_price && item.target_price >= currentPrice
        );

        if (userProduct && userProduct.target_price && wishlist.userId) {
          // Get user details to send WhatsApp notification
          const User = require('../models/user').default;
          const user = await User.findById(wishlist.userId);
          
          if (user && user.preferences.whatsapp_number) {
            // Send WhatsApp notification
            await whatsappService.sendPriceAlert({
              to: user.preferences.whatsapp_number,
              message: `🎉 Great news! The price of ${product.name} has dropped to ₹${currentPrice}!`,
              productInfo: {
                name: product.name,
                currentPrice: currentPrice,
                targetPrice: userProduct.target_price,
                platform: product.platform || 'Unknown',
                url: product.url,
                image: product.image_url
              }
            });

            console.log(`📱 WhatsApp alert sent to user ${user.email} for product ${product.name}`);
          }
        }
      }
    } catch (error) {
      console.error('Error checking target price and sending notifications:', error);
    }
  }

  // Get monitoring status
  getMonitoringStatus(): { isActive: boolean; productsCount: number } {
    return {
      isActive: this.isMonitoring,
      productsCount: 0 // This would be fetched from database
    };
  }
}

export default new RealTimePriceMonitor();

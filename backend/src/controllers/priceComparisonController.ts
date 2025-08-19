import { Request, Response } from 'express';
import { comparePrices } from '../services/priceComparisonService';
import realTimePriceMonitor from '../services/realTimePriceMonitor';
import aiService from '../services/aiService';

export const getPriceComparison = async (req: Request, res: Response) => {
    const { productId } = req.params;
    if (!productId) return res.status(400).json({ error: 'Missing productId' });
    const prices = await comparePrices(productId);
    res.json({ prices });
};

// AI-powered price comparison across platforms
export const comparePricesAcrossPlatforms = async (req: Request, res: Response) => {
  try {
    const { productName, urls } = req.body;
    
    if (!productName || !urls || !Array.isArray(urls)) {
      return res.status(400).json({
        success: false,
        message: 'Product name and array of URLs are required'
      });
    }

    console.log(`🔍 Comparing prices for: ${productName}`);
    
    const comparisonResults = [];
    
    // Get prices from all provided URLs
    for (const url of urls) {
      try {
        const priceData = await realTimePriceMonitor.monitorProductPrice(url);
        if (priceData) {
          comparisonResults.push({
            platform: priceData.source,
            url: url,
            price: priceData.currentPrice,
            availability: priceData.availability,
            lastUpdated: priceData.lastUpdated,
            aiPrediction: priceData.pricePrediction
          });
        }
      } catch (error) {
        console.error(`Error fetching price from ${url}:`, error);
      }
    }

    if (comparisonResults.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Could not fetch prices from any of the provided URLs'
      });
    }

    // Sort by price (lowest first)
    comparisonResults.sort((a, b) => a.price - b.price);

    // Generate AI-powered recommendation
    const recommendationPrompt = `
      Analyze these price comparison results for "${productName}":
      ${comparisonResults.map((r, i) => `${i + 1}. ${r.platform}: ₹${r.price} (${r.availability})`).join('\n')}
      
      Provide a smart buying recommendation considering:
      - Best price
      - Platform reliability
      - Availability
      - AI predictions if available
      
      Keep response under 150 characters.
    `;

    const aiResponse = await aiService.getAIResponse(recommendationPrompt, 'gemini-2.0-flash-exp');
    const recommendation = typeof aiResponse === 'string' ? aiResponse : aiResponse.response;

    res.json({
      success: true,
      message: 'Price comparison completed successfully',
      data: {
        productName,
        comparison: comparisonResults,
        bestDeal: comparisonResults[0],
        aiRecommendation: recommendation.substring(0, 150),
        analysisTimestamp: new Date()
      }
    });
  } catch (error) {
    console.error('Price comparison error:', error);
    res.status(500).json({
      success: false,
      message: 'Price comparison failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

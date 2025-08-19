import { Request, Response } from 'express';
import { convertToAffiliateLink } from '../services/affiliateService';

export const getAffiliateLink = (req: Request, res: Response) => {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: 'Missing url' });
    const affiliateUrl = convertToAffiliateLink(url);
    res.json({ affiliateUrl });
};

// Smart affiliate link generation
export const generateAffiliateLink = async (req: Request, res: Response) => {
  try {
    const { originalUrl, platform, userId } = req.body;
    
    if (!originalUrl) {
      return res.status(400).json({
        success: false,
        message: 'Original URL is required'
      });
    }

    // Extract product ID from URL
    let productId = '';
    if (originalUrl.includes('amazon')) {
      const match = originalUrl.match(/\/dp\/([A-Z0-9]{10})/);
      productId = match ? match[1] : '';
    } else if (originalUrl.includes('flipkart')) {
      const match = originalUrl.match(/\/p\/([a-zA-Z0-9]+)/);
      productId = match ? match[1] : '';
    }

    // Generate affiliate link (simplified version - in real app would use actual affiliate APIs)
    const affiliateCode = `PT${userId?.slice(-4) || 'DEMO'}${Date.now().toString().slice(-6)}`;
    let affiliateLink = originalUrl;
    
    if (originalUrl.includes('amazon')) {
      const baseUrl = originalUrl.split('?')[0];
      affiliateLink = `${baseUrl}?tag=pricetracker-21&linkCode=as2&ref=${affiliateCode}`;
    } else if (originalUrl.includes('flipkart')) {
      affiliateLink = `${originalUrl}${originalUrl.includes('?') ? '&' : '?'}affid=pricetrack&ref=${affiliateCode}`;
    }

    // Log affiliate link generation
    console.log(`🔗 Generated affiliate link for user ${userId}: ${affiliateCode}`);

    res.json({
      success: true,
      message: 'Affiliate link generated successfully',
      data: {
        originalUrl,
        affiliateLink,
        affiliateCode,
        platform: platform || 'auto-detected',
        productId,
        commission: '3-8%', // Typical commission rates
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        generatedAt: new Date()
      }
    });
  } catch (error) {
    console.error('Affiliate link generation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate affiliate link',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

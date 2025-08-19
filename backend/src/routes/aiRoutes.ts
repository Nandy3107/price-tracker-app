import express from 'express';
import aiService from '../services/aiService';
import realTimePriceMonitor from '../services/realTimePriceMonitor';

const router = express.Router();

// Enhanced AI chat endpoint with real-time price awareness
router.post('/chat', async (req, res) => {
  try {
    const { message, productContext, preferredProvider } = req.body;

    let aiResponse;
    
    // If product context is provided, include real-time price analysis
    if (productContext) {
      const { productName, currentPrice, url, platform } = productContext;
      
      // Check real-time price first
      console.log('🔍 Checking real-time price for:', productName);
      const livePrice = await realTimePriceMonitor.monitorProductPrice(url);
      
      let priceAnalysis = '';
      if (livePrice && livePrice.currentPrice !== currentPrice) {
        priceAnalysis = `\n\n⚡ REAL-TIME UPDATE: Price changed from ₹${currentPrice} to ₹${livePrice.currentPrice} on ${platform}!`;
      }
      
      // Enhanced prompt with real-time data
      const enhancedPrompt = `${message}

Context:
- Product: ${productName}
- Current Price: ₹${currentPrice}
- Platform: ${platform}
- Real-time Check: ${livePrice ? `₹${livePrice.currentPrice} (${livePrice.availability})` : 'Unable to fetch live price'}

Please provide specific advice about this product and pricing.${priceAnalysis}`;

      aiResponse = await aiService.getAIResponse(enhancedPrompt, productContext, preferredProvider);
    } else {
      aiResponse = await aiService.getAIResponse(message, productContext, preferredProvider);
    }

    res.json({
      response: aiResponse.response,
      source: aiResponse.source,
      timestamp: new Date(),
      realTimeData: productContext ? true : false
    });

  } catch (error) {
    console.error('AI Chat error:', error);
    res.status(500).json({
      error: 'AI service temporarily unavailable',
      fallback: 'I\'m here to help with your shopping decisions! Please try again or ask about specific products.'
    });
  }
});

// Real-time price analysis endpoint
router.post('/analyze-price', async (req, res) => {
  try {
    const { productName, currentPrice, platform, url } = req.body;

    if (!productName || !currentPrice || !platform) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Get real-time price
    let livePrice = null;
    if (url) {
      livePrice = await realTimePriceMonitor.monitorProductPrice(url);
    }

    // Get AI analysis
    const analysis = await aiService.analyzePriceData(
      productName, 
      livePrice ? livePrice.currentPrice : currentPrice, 
      platform
    );

    res.json({
      analysis,
      livePrice: livePrice ? {
        currentPrice: livePrice.currentPrice,
        availability: livePrice.availability,
        lastChecked: livePrice.lastUpdated,
        source: livePrice.source
      } : null,
      priceChange: livePrice && livePrice.currentPrice !== currentPrice ? {
        from: currentPrice,
        to: livePrice.currentPrice,
        difference: livePrice.currentPrice - currentPrice,
        percentChange: ((livePrice.currentPrice - currentPrice) / currentPrice * 100).toFixed(2)
      } : null,
      timestamp: new Date()
    });

  } catch (error) {
    console.error('Price analysis error:', error);
    res.status(500).json({ error: 'Price analysis failed' });
  }
});

// Start real-time monitoring
router.post('/start-monitoring', async (req, res) => {
  try {
    await realTimePriceMonitor.startRealTimeMonitoring();
    res.json({ 
      message: 'Real-time price monitoring started',
      status: 'active'
    });
  } catch (error) {
    console.error('Failed to start monitoring:', error);
    res.status(500).json({ error: 'Failed to start monitoring' });
  }
});

// Stop monitoring
router.post('/stop-monitoring', (req, res) => {
  try {
    realTimePriceMonitor.stopMonitoring();
    res.json({ 
      message: 'Real-time price monitoring stopped',
      status: 'inactive'
    });
  } catch (error) {
    console.error('Failed to stop monitoring:', error);
    res.status(500).json({ error: 'Failed to stop monitoring' });
  }
});

// Get monitoring status
router.get('/monitoring-status', (req, res) => {
  try {
    const status = realTimePriceMonitor.getMonitoringStatus();
    res.json(status);
  } catch (error) {
    console.error('Failed to get monitoring status:', error);
    res.status(500).json({ error: 'Failed to get status' });
  }
});

// Manual price check for specific product
router.post('/check-price/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const livePrice = await realTimePriceMonitor.checkPriceNow(productId);
    
    if (livePrice) {
      res.json({
        message: 'Price checked successfully',
        livePrice,
        timestamp: new Date()
      });
    } else {
      res.status(404).json({ error: 'Unable to fetch current price' });
    }
  } catch (error) {
    console.error('Manual price check error:', error);
    res.status(500).json({ error: 'Price check failed' });
  }
});

// Check AI provider availability and status
router.get('/providers/status', async (req, res) => {
  try {
    const providers = {
      gemini: { available: false, lastUsed: null as Date | null, responseTime: 0 },
      claude: { available: false, lastUsed: null as Date | null, responseTime: 0 },
      perplexity: { available: false, lastUsed: null as Date | null, responseTime: 0 },
      chatgpt: { available: false, lastUsed: null as Date | null, responseTime: 0 },
      local: { available: true, lastUsed: null as Date | null, responseTime: 0 }
    };

    // Quick test of each provider
    const testPrompt = "Say 'Hello' in one word only.";
    
    // Test Gemini
    try {
      const startTime = Date.now();
      const geminiResponse = await aiService.getAIResponse(testPrompt, null, 'gemini');
      if (geminiResponse.source === 'gemini') {
        providers.gemini = {
          available: true,
          lastUsed: new Date(),
          responseTime: Date.now() - startTime
        };
      }
    } catch (error) {
      console.log('Gemini test failed');
    }

    // Test Claude
    try {
      const startTime = Date.now();
      const claudeResponse = await aiService.getAIResponse(testPrompt, null, 'claude');
      if (claudeResponse.source === 'claude') {
        providers.claude = {
          available: true,
          lastUsed: new Date(),
          responseTime: Date.now() - startTime
        };
      }
    } catch (error) {
      console.log('Claude test failed');
    }

    // Test Perplexity
    try {
      const startTime = Date.now();
      const perplexityResponse = await aiService.getAIResponse(testPrompt, null, 'perplexity');
      if (perplexityResponse.source === 'perplexity') {
        providers.perplexity = {
          available: true,
          lastUsed: new Date(),
          responseTime: Date.now() - startTime
        };
      }
    } catch (error) {
      console.log('Perplexity test failed');
    }

    // Test ChatGPT
    try {
      const startTime = Date.now();
      const chatgptResponse = await aiService.getAIResponse(testPrompt, null, 'chatgpt');
      if (chatgptResponse.source === 'chatgpt') {
        providers.chatgpt = {
          available: true,
          lastUsed: new Date(),
          responseTime: Date.now() - startTime
        };
      }
    } catch (error) {
      console.log('ChatGPT test failed');
    }

    res.json(providers);
  } catch (error) {
    console.error('Error checking provider status:', error);
    res.status(500).json({ error: 'Failed to check provider status' });
  }
});

export default router;

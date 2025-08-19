import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

interface AIResponse {
  response: string;
  source: 'gemini' | 'claude' | 'perplexity' | 'chatgpt' | 'local';
}

class AIService {
  private geminiApiKey: string;
  private claudeApiKey: string;
  private perplexityApiKey: string;
  private openaiApiKey: string;

  constructor() {
    this.geminiApiKey = process.env.GEMINI_API_KEY || '';
    this.claudeApiKey = process.env.CLAUDE_API_KEY || '';
    this.perplexityApiKey = process.env.PERPLEXITY_API_KEY || '';
    this.openaiApiKey = process.env.OPENAI_API_KEY || '';
  }

  // Enhanced prompt for shopping context
  private enhancePromptForShopping(userMessage: string, productContext?: any): string {
    let enhancedPrompt = `You are an expert AI shopping assistant. User question: "${userMessage}"\n\n`;
    
    if (productContext) {
      enhancedPrompt += `User's Shopping Context:
- Products tracked: ${productContext.productCount || 0}
- Average price: ₹${Math.round(productContext.avgPrice || 0).toLocaleString()}
- Platforms: ${productContext.platforms?.join(', ') || 'Various'}
`;
      
      if (productContext.products && productContext.products.length > 0) {
        enhancedPrompt += '\nCurrent Products:\n';
        productContext.products.forEach((product: any, index: number) => {
          enhancedPrompt += `${index + 1}. ${product.name} - ₹${product.price?.toLocaleString() || 'N/A'} (${product.platform})\n`;
        });
      }
    }

    enhancedPrompt += `\nPlease provide helpful shopping advice, price analysis, or recommendations. 
Be specific, actionable, and include emojis. If discussing prices, mention Indian context and current market trends.
Keep response under 300 words and format nicely with bullet points where appropriate.`;

    return enhancedPrompt;
  }
  // Try Gemini AI first
  private async tryGemini(prompt: string): Promise<string | null> {
    try {
      if (!this.geminiApiKey) {
        console.log('Gemini API key not found, skipping...');
        return null;
      }

      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${this.geminiApiKey}`,
        {
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        },
        {
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: 10000
        }
      );

      return response.data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.log('Gemini failed:', error instanceof Error ? error.message : 'Unknown error');
      return null;
    }
  }

  // Try Perplexity AI as fallback
  private async tryPerplexity(prompt: string): Promise<string | null> {
    try {
      if (!this.perplexityApiKey) {
        console.log('Perplexity API key not found, skipping...');
        return null;
      }

      const response = await axios.post(
        'https://api.perplexity.ai/chat/completions',
        {
          model: 'llama-3.1-sonar-small-128k-online',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful AI assistant for price tracking and shopping advice.'
            },
            {
              role: 'user',
              content: prompt
            }
          ]
        },
        {
          headers: {
            'Authorization': `Bearer ${this.perplexityApiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: 10000
        }
      );

      return response.data.choices[0].message.content;
    } catch (error) {
      console.log('Perplexity failed:', error instanceof Error ? error.message : 'Unknown error');
      return null;
    }
  }

  // Try Claude AI (Anthropic)
  private async tryClaude(prompt: string): Promise<string | null> {
    try {
      if (!this.claudeApiKey) {
        console.log('Claude API key not found, skipping...');
        return null;
      }

      const response = await axios.post(
        'https://api.anthropic.com/v1/messages',
        {
          model: 'claude-3-sonnet-20240229',
          max_tokens: 1000,
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ]
        },
        {
          headers: {
            'Authorization': `Bearer ${this.claudeApiKey}`,
            'Content-Type': 'application/json',
            'x-api-key': this.claudeApiKey,
            'anthropic-version': '2023-06-01'
          },
          timeout: 10000
        }
      );

      return response.data.content[0].text;
    } catch (error) {
      console.log('Claude failed:', error instanceof Error ? error.message : 'Unknown error');
      return null;
    }
  }

  // Try ChatGPT (OpenAI) - Updated to use ChatGPT instead of OpenAI
  private async tryChatGPT(prompt: string): Promise<string | null> {
    try {
      if (!this.openaiApiKey) {
        console.log('OpenAI API key not found, skipping...');
        return null;
      }

      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful AI assistant for price tracking and shopping advice.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 500
        },
        {
          headers: {
            'Authorization': `Bearer ${this.openaiApiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: 10000
        }
      );

      return response.data.choices[0].message.content;
    } catch (error) {
      console.log('ChatGPT failed:', error instanceof Error ? error.message : 'Unknown error');
      return null;
    }
  }

  // Local AI fallback using simple rule-based responses
  private getLocalAIResponse(prompt: string, productContext?: any): string {
    const lowerPrompt = prompt.toLowerCase();
    
    // Enhanced responses with product context
    if (productContext && productContext.productCount > 0) {
      if (lowerPrompt.includes('price') || lowerPrompt.includes('analysis')) {
        const avgPrice = productContext.avgPrice || 0;
        return `💰 Smart Price Analysis:\n\n📊 Your Portfolio:\n• Tracking: ${productContext.productCount} products\n• Average price: ₹${Math.round(avgPrice).toLocaleString()}\n• Platforms: ${productContext.platforms?.join(', ') || 'Various'}\n\n🎯 AI Recommendation:\n${avgPrice > 5000 ? '📈 Premium products detected - wait for festival sales' : '💡 Good price range - watch for flash sales'}\n\n🛍️ Best time to buy: During Diwali, end-of-month clearance!`;
      }
    }
    
    if (lowerPrompt.includes('price') && lowerPrompt.includes('high')) {
      return '📊 Price Analysis:\n\n• This price seems higher than usual\n• Recommendation: Wait for price drop\n• Check other retailers for comparison\n• Set price alert for 15-20% discount\n\n💡 Tip: Prices typically drop during sales!';
    }
    
    if (lowerPrompt.includes('buy') || lowerPrompt.includes('purchase')) {
      return '🛍️ Smart Buying Guide:\n\n✅ Before Buying:\n• Check price history\n• Compare across platforms\n• Read customer reviews\n• Set price alerts if too expensive\n\n🎯 Best Times:\n• Festival sales (Diwali, Dussehra)\n• End of month clearance\n• Flash sales & limited offers';
    }
    
    if (lowerPrompt.includes('oneplus') || lowerPrompt.includes('earbuds')) {
      return '🎧 OnePlus Earbuds Analysis:\n\n💰 Price Range:\n• OnePlus Buds: ₹2,500 - ₹4,000\n• OnePlus Buds Pro: ₹4,000 - ₹8,000\n• OnePlus Buds 3: ₹4,000 - ₹6,000\n\n✅ Current market price ₹5,500 seems reasonable\n\n🎯 Best Platforms: Amazon, Flipkart, OnePlus Store';
    }
    
    if (lowerPrompt.includes('iphone') && lowerPrompt.includes('price')) {
      return '📱 iPhone Price Intelligence:\n\n💰 Current Market:\n• iPhone 15: ₹65,000 - ₹80,000\n• iPhone 14: ₹55,000 - ₹70,000\n• iPhone 13: ₹45,000 - ₹60,000\n\n🎯 Best Strategy:\n• Wait for festival sales (10-15% off)\n• Check exchange offers\n• Compare Amazon vs Flipkart\n\n📈 Trend: Prices drop when new models launch!';
    }
    
    if (lowerPrompt.includes('wrong') || lowerPrompt.includes('incorrect')) {
      return '🔧 Price Data Issues:\n\n🎯 Possible Causes:\n• Different sources/sellers\n• Promotional pricing\n• Data synchronization lag\n• Regional price variations\n\n✅ Solutions:\n• Check official retailer websites\n• Refresh data in real-time\n• Verify with multiple sources\n• Use price alerts for accuracy';
    }

    if (lowerPrompt.includes('help') || lowerPrompt.includes('feature')) {
      return '🤖 AI Shopping Assistant:\n\n🎯 I can help with:\n• Real-time price analysis\n• Buy/Wait recommendations\n• Market intelligence\n• Deal alerts & notifications\n• Multi-store comparison\n\n💬 Ask me:\n• "Check iPhone prices"\n• "Should I buy now?"\n• "Show me best deals"\n• "Price analysis for [product]"';
    }
    
    return '🤖 Hi! I\'m your Multi-AI Shopping Assistant!\n\n💭 I can help you with:\n• Product price analysis & trends\n• Smart buy/wait recommendations\n• Market intelligence & forecasts\n• Deal alerts across platforms\n\n🎤 Try voice commands or ask me anything about shopping!';
  }

  // Main method to get AI response with fallback chain or specific provider
  async getAIResponse(prompt: string, productContext?: any, preferredProvider?: string): Promise<AIResponse> {
    const enhancedPrompt = this.enhancePromptForShopping(prompt, productContext);
    
    // If specific provider is requested, try that first
    if (preferredProvider) {
      let response = null;
      switch (preferredProvider.toLowerCase()) {
        case 'gemini':
          response = await this.tryGemini(enhancedPrompt);
          if (response) return { response, source: 'gemini' };
          break;
        case 'claude':
          response = await this.tryClaude(enhancedPrompt);
          if (response) return { response, source: 'claude' };
          break;
        case 'perplexity':
          response = await this.tryPerplexity(enhancedPrompt);
          if (response) return { response, source: 'perplexity' };
          break;
        case 'chatgpt':
          response = await this.tryChatGPT(enhancedPrompt);
          if (response) return { response, source: 'chatgpt' };
          break;
      }
    }
    
    // Default fallback chain: Gemini -> Claude -> Perplexity -> ChatGPT -> Local
    let response = await this.tryGemini(enhancedPrompt);
    if (response) {
      return { response, source: 'gemini' };
    }

    // Try Claude second
    response = await this.tryClaude(enhancedPrompt);
    if (response) {
      return { response, source: 'claude' };
    }

    // Try Perplexity third
    response = await this.tryPerplexity(enhancedPrompt);
    if (response) {
      return { response, source: 'perplexity' };
    }

    // Try ChatGPT fourth
    response = await this.tryChatGPT(enhancedPrompt);
    if (response) {
      return { response, source: 'chatgpt' };
    }

    // Fall back to local AI
    response = this.getLocalAIResponse(prompt, productContext);
    return { response, source: 'local' };
  }

  // Specific method for price analysis
  async analyzePriceData(productName: string, currentPrice: number, platform: string): Promise<string> {
    const prompt = `Analyze this product pricing:
Product: ${productName}
Current Price: ₹${currentPrice}
Platform: ${platform}

Please provide:
1. Is this price reasonable for this product?
2. Price range this product typically sells for
3. Recommendation (buy now, wait, or avoid)
4. Any specific insights about this product category

Keep response concise and actionable.`;

    const result = await this.getAIResponse(prompt);
    return `AI Analysis (${result.source.toUpperCase()}): ${result.response}`;
  }
}

export default new AIService();

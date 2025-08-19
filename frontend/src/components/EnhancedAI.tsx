import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  aiSource?: 'gemini' | 'perplexity' | 'openai' | 'local';
}

interface EnhancedAIProps {
  userId?: string;
  wishlistData: any[];
  onClose?: () => void;
}

const EnhancedAI: React.FC<EnhancedAIProps> = ({ userId, wishlistData, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: '🤖 Multi-AI Assistant Ready!\n\nI can help you with:\n• 💰 Price analysis & predictions\n• 🛍️ Smart shopping advice\n• 📊 Market intelligence\n• 🎯 Buy/Wait recommendations\n\n🎤 Try voice commands or type your question!',
      isUser: false,
      timestamp: new Date(),
      aiSource: 'local'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  // Voice command handler
  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  // Multi-AI response system
  const getAIResponse = async (message: string): Promise<{ response: string; source: string }> => {
    try {
      // Try external AI services first
      const response = await axios.post('http://localhost:3001/api/ai/chat', {
        message,
        productContext: wishlistData.length > 0 ? {
          productCount: wishlistData.length,
          avgPrice: wishlistData.reduce((sum, item) => sum + (item.product?.current_price || 0), 0) / wishlistData.length,
          platforms: Array.from(new Set(wishlistData.map(item => item.product?.platform))),
          products: wishlistData.slice(0, 3).map(item => ({
            name: item.product?.name,
            price: item.product?.current_price,
            platform: item.product?.platform
          }))
        } : null
      });

      return {
        response: response.data.response,
        source: response.data.source
      };
    } catch (error) {
      console.log('External AI failed, using local AI');
      return {
        response: getLocalAIResponse(message, wishlistData),
        source: 'local'
      };
    }
  };

  // Enhanced local AI with better responses
  const getLocalAIResponse = (message: string, wishlistData: any[]): string => {
    const lowerMessage = message.toLowerCase();
    
    // iPhone specific queries
    if (lowerMessage.includes('iphone') && lowerMessage.includes('price')) {
      const iphoneItems = wishlistData.filter(item => 
        item.product?.name?.toLowerCase().includes('iphone') ||
        item.product?.name?.toLowerCase().includes('phone')
      );
      
      if (iphoneItems.length > 0) {
        const avgPrice = iphoneItems.reduce((sum, item) => sum + (item.product?.current_price || 0), 0) / iphoneItems.length;
        return `📱 iPhone Price Analysis:\n\n• Found ${iphoneItems.length} iPhone(s) in your wishlist\n• Average price: ₹${Math.round(avgPrice).toLocaleString()}\n• Current market trend: Stable\n• Best time to buy: During festival sales\n\n💡 iPhone 15 typically ranges ₹65,000-₹80,000\nRecommendation: Wait for Diwali sale for 10-15% discount!`;
      } else {
        return `📱 iPhone 15 Price Today:\n\n• Expected Range: ₹65,000 - ₹80,000\n• Best Price Platform: Amazon/Flipkart\n• Current Trend: Stable pricing\n• Discount Availability: 5-10% during sales\n\n🎯 Recommendation: Add iPhone 15 to wishlist to track real-time prices!\n\n💡 Pro Tip: Prices drop during Diwali, New Year, and iPhone 16 launch.`;
      }
    }

    // Price analysis for current products
    if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('analysis')) {
      const totalProducts = wishlistData.length;
      if (totalProducts === 0) {
        return `💰 Price Analysis:\n\n• No products in wishlist yet\n• Add products to get personalized analysis\n• Track prices across 50+ stores\n• Get AI-powered buy/wait recommendations\n\n🎯 Start by adding your favorite products!`;
      }

      const avgPrice = wishlistData.reduce((sum, item) => sum + (item.product?.current_price || 0), 0) / totalProducts;
      const urgentDeals = wishlistData.filter(item => 
        item.target_price && item.product?.current_price <= item.target_price * 1.1
      );

      return `💰 Smart Price Analysis:\n\n📊 Portfolio Overview:\n• Tracking: ${totalProducts} products\n• Average price: ₹${Math.round(avgPrice).toLocaleString()}\n• Urgent deals: ${urgentDeals.length}\n• Potential savings: ₹${Math.round(avgPrice * 0.15).toLocaleString()}\n\n🎯 AI Recommendation:\n${urgentDeals.length > 0 ? 
        `🔥 ${urgentDeals.length} products near target price - BUY NOW!` : 
        `📈 Set target prices for smart alerts`}\n\n💡 Check Priority tab for immediate opportunities!`;
    }

    // Shopping advice
    if (lowerMessage.includes('buy') || lowerMessage.includes('shop') || lowerMessage.includes('deal')) {
      return `🛍️ Smart Shopping Strategy:\n\n🎯 When to Buy:\n• During festival sales (Diwali, Dussehra)\n• End of month clearance\n• When price drops 15-20% below average\n• Flash sales and limited-time offers\n\n📱 Best Platforms:\n• Amazon: Wide selection, fast delivery\n• Flipkart: Competitive pricing\n• Myntra: Fashion items\n\n🤖 AI Tip: Enable price alerts for automatic notifications!`;
    }

    // Help and features
    if (lowerMessage.includes('help') || lowerMessage.includes('feature') || lowerMessage.includes('what can')) {
      return `🤖 Multi-AI Assistant Features:\n\n🎯 Core Capabilities:\n• Real-time price tracking\n• Smart buy/wait recommendations\n• Market intelligence analysis\n• Voice command support\n• Multi-store price comparison\n\n🗣️ Voice Commands:\n• "Check iPhone prices"\n• "Should I buy now?"\n• "Show me best deals"\n• "Price analysis"\n\n💡 Just speak or type your question!`;
    }

    // Fallback response
    return `🤖 I'm here to help with your shopping decisions!\n\n💭 You can ask me about:\n• Product price analysis\n• Market trends and forecasts\n• Best time to buy recommendations\n• Price comparison across stores\n• Deal alerts and notifications\n\n🎤 Try voice commands or type your question!`;
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const aiResponse = await getAIResponse(inputText);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse.response,
        isUser: false,
        timestamp: new Date(),
        aiSource: aiResponse.source as any
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('AI response error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: '🤖 Sorry, I encountered an issue. Please try again or check your connection.',
        isUser: false,
        timestamp: new Date(),
        aiSource: 'local'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getAISourceIcon = (source?: string) => {
    switch (source) {
      case 'gemini': return '🥇';
      case 'perplexity': return '🥈';
      case 'openai': return '🥉';
      case 'local': return '🏠';
      default: return '🤖';
    }
  };

  const getAISourceName = (source?: string) => {
    switch (source) {
      case 'gemini': return 'Gemini AI';
      case 'perplexity': return 'Perplexity AI';
      case 'openai': return 'OpenAI GPT';
      case 'local': return 'Local AI';
      default: return 'Multi-AI';
    }
  };

  if (isMinimized) {
    return (
      <div
        style={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          backgroundColor: '#4F46E5',
          color: 'white',
          borderRadius: '50%',
          width: 60,
          height: 60,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          zIndex: 1000,
          animation: 'pulse 2s infinite'
        }}
        onClick={() => setIsMinimized(false)}
      >
        🤖
      </div>
    );
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        width: 380,
        height: 500,
        backgroundColor: 'white',
        borderRadius: 12,
        boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 1000,
        border: '1px solid #e2e8f0'
      }}
    >
      {/* Header */}
      <div
        style={{
          background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
          color: 'white',
          padding: 12,
          borderRadius: '12px 12px 0 0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <div>
          <div style={{ fontWeight: '600', fontSize: 14 }}>🤖 Multi-AI Assistant</div>
          <div style={{ fontSize: 11, opacity: 0.9 }}>
            Gemini→Perplexity→OpenAI→Local
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => setIsMinimized(true)}
            style={{
              backgroundColor: 'rgba(255,255,255,0.2)',
              border: 'none',
              color: 'white',
              borderRadius: 4,
              padding: '4px 8px',
              cursor: 'pointer',
              fontSize: 12
            }}
          >
            −
          </button>
          {onClose && (
            <button
              onClick={onClose}
              style={{
                backgroundColor: 'rgba(255,255,255,0.2)',
                border: 'none',
                color: 'white',
                borderRadius: 4,
                padding: '4px 8px',
                cursor: 'pointer',
                fontSize: 12
              }}
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div
        style={{
          flex: 1,
          padding: 12,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 12
        }}
      >
        {messages.map((message) => (
          <div
            key={message.id}
            style={{
              alignSelf: message.isUser ? 'flex-end' : 'flex-start',
              maxWidth: '85%'
            }}
          >
            <div
              style={{
                backgroundColor: message.isUser ? '#4F46E5' : '#f1f5f9',
                color: message.isUser ? 'white' : '#334155',
                padding: '8px 12px',
                borderRadius: message.isUser ? '12px 12px 4px 12px' : '12px 12px 12px 4px',
                fontSize: 13,
                lineHeight: 1.4,
                whiteSpace: 'pre-wrap'
              }}
            >
              {message.text}
            </div>
            {!message.isUser && message.aiSource && (
              <div style={{
                fontSize: 10,
                color: '#64748b',
                marginTop: 4,
                display: 'flex',
                alignItems: 'center',
                gap: 4
              }}>
                {getAISourceIcon(message.aiSource)} {getAISourceName(message.aiSource)}
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div style={{ alignSelf: 'flex-start' }}>
            <div
              style={{
                backgroundColor: '#f1f5f9',
                padding: '8px 12px',
                borderRadius: '12px 12px 12px 4px',
                fontSize: 13,
                color: '#64748b'
              }}
            >
              🤖 Thinking...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div
        style={{
          padding: 12,
          borderTop: '1px solid #e2e8f0',
          display: 'flex',
          gap: 8,
          alignItems: 'flex-end'
        }}
      >
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask about prices, deals, or say 'help'..."
          style={{
            flex: 1,
            border: '1px solid #d1d5db',
            borderRadius: 8,
            padding: '8px 12px',
            fontSize: 13,
            resize: 'none',
            minHeight: 36,
            maxHeight: 80,
            outline: 'none'
          }}
          rows={1}
        />
        <button
          onClick={isListening ? stopListening : startListening}
          style={{
            backgroundColor: isListening ? '#ef4444' : '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: 8,
            padding: '8px 10px',
            cursor: 'pointer',
            fontSize: 14,
            minWidth: 40,
            animation: isListening ? 'pulse 1s infinite' : 'none'
          }}
          title={isListening ? 'Stop listening' : 'Start voice command'}
        >
          {isListening ? '🔴' : '🎤'}
        </button>
        <button
          onClick={handleSendMessage}
          disabled={!inputText.trim() || isLoading}
          style={{
            backgroundColor: '#4F46E5',
            color: 'white',
            border: 'none',
            borderRadius: 8,
            padding: '8px 12px',
            cursor: inputText.trim() && !isLoading ? 'pointer' : 'not-allowed',
            fontSize: 14,
            opacity: inputText.trim() && !isLoading ? 1 : 0.5
          }}
        >
          Send
        </button>
      </div>

      <style>
        {`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        `}
      </style>
    </div>
  );
};

export default EnhancedAI;

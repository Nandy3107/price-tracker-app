import React, { useState, useRef, useEffect } from 'react';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface LocalAIProps {
  userId?: string;
  wishlistData: any[];
  onClose?: () => void;
}

// Local AI responses - no external API needed
const getLocalAIResponse = (message: string, wishlistData: any[]): string => {
  const lowerMessage = message.toLowerCase();
  
  // Price-related questions
  if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('cheap')) {
    const totalProducts = wishlistData.length;
    const avgPrice = wishlistData.reduce((sum, item) => sum + (item.product?.current_price || 0), 0) / totalProducts;
    
    if (lowerMessage.includes('when') && lowerMessage.includes('buy')) {
      return `🎯 Based on your ${totalProducts} tracked products, I recommend buying when:\n\n• Products drop 15-20% below average (₹${Math.round(avgPrice)})\n• During festival sales (Diwali, Dussehra)\n• End of month clearance sales\n• When target price is reached\n\n💡 Currently tracking ${totalProducts} items for best deals!`;
    }
    
    if (lowerMessage.includes('best') || lowerMessage.includes('deal')) {
      const urgentDeals = wishlistData
        .filter(item => item.target_price && item.product?.current_price <= item.target_price * 1.1)
        .slice(0, 3);
      
      if (urgentDeals.length > 0) {
        return `🔥 TOP URGENT DEALS RIGHT NOW:\n\n${urgentDeals.map((item, i) => 
          `${i+1}. ${item.product?.name?.substring(0, 30)}...\n   💰 ₹${item.product?.current_price?.toLocaleString()} (Target: ₹${item.target_price?.toLocaleString()})`
        ).join('\n\n')}\n\n✨ These are close to your target prices!`;
      } else {
        return `📊 Currently monitoring ${totalProducts} products. Average price: ₹${Math.round(avgPrice).toLocaleString()}\n\n💡 Set target prices to get better deal recommendations!`;
      }
    }
    
    return `💰 Price Analysis:\n• Tracking ${totalProducts} products\n• Average price: ₹${Math.round(avgPrice).toLocaleString()}\n• Set target prices for smart alerts\n• Check Priority tab for urgent deals`;
  }
  
  // Shopping advice
  if (lowerMessage.includes('shop') || lowerMessage.includes('store') || lowerMessage.includes('platform')) {
    const platformSet = new Set(wishlistData.map(item => item.product?.platform).filter(Boolean));
    const platforms = Array.from(platformSet);
    return `🛍️ SHOPPING STRATEGY:\n\n📱 Your tracked platforms: ${platforms.join(', ')}\n\n🎯 Best practices:\n• Compare prices across platforms\n• Use our Store Integration tab\n• Check during sale seasons\n• Set price alerts for automatic tracking\n\n🔗 Connect more stores in Store Integration tab!`;
  }
  
  // Product recommendations
  if (lowerMessage.includes('recommend') || lowerMessage.includes('suggest')) {
    const categorySet = new Set(wishlistData.map(item => item.category).filter(Boolean));
    const categories = Array.from(categorySet);
    return `🎯 SMART RECOMMENDATIONS:\n\n📊 Based on your interests: ${categories.join(', ')}\n\n✨ Suggestions:\n• Set target prices for all products\n• Enable WhatsApp notifications\n• Check Priority Products daily\n• Use payment gateway for quick purchases\n\n💡 I see you're interested in ${categories[0] || 'various'} products - great choice!`;
  }
  
  // Trending/popular questions
  if (lowerMessage.includes('trend') || lowerMessage.includes('popular') || lowerMessage.includes('hot')) {
    return `🔥 TRENDING NOW:\n\n📈 Hot categories:\n• Electronics (smartphones, laptops)\n• Fashion (seasonal wear)\n• Groceries (daily essentials)\n• Travel (post-festival bookings)\n\n💡 Based on your tracked items, you're following smart market trends!`;
  }
  
  // Help and features
  if (lowerMessage.includes('help') || lowerMessage.includes('feature') || lowerMessage.includes('how')) {
    return `🚀 PRICE TRACKER FEATURES:\n\n📊 Dashboard: Monitor all products\n🔥 Priority: Top urgent deals\n🔗 Stores: Connect 50+ platforms\n💳 Payments: UPI/GPay/PhonePe\n📈 Charts: Real price history\n🎯 Targets: Set price alerts\n\n💬 Ask me:\n• "When should I buy?"\n• "Show me best deals"\n• "Price trends for [product]"`;
  }
  
  // Default intelligent responses
  const responses = [
    `🤖 I'm your local shopping assistant! I can help with:\n\n💰 Price analysis and trends\n🎯 Best time to buy recommendations\n🛍️ Store comparisons\n📊 Deal hunting strategies\n\nWhat would you like to know about your ${wishlistData.length} tracked products?`,
    
    `📊 Smart Shopping Tip: With ${wishlistData.length} products tracked, you're doing great!\n\n🎯 Try asking:\n• "When should I buy?"\n• "Show me best deals"\n• "Price trends"\n• "Store recommendations"\n\n💡 I'm powered by local AI - no internet needed!`,
    
    `🛍️ Welcome to your personal shopping advisor!\n\n✨ I can analyze your ${wishlistData.length} tracked products and provide:\n• Price drop alerts\n• Best buying times\n• Store comparisons\n• Deal recommendations\n\nWhat shopping question can I help with?`
  ];
  
  return responses[Math.floor(Math.random() * responses.length)];
};

const LocalAI: React.FC<LocalAIProps> = ({ userId, wishlistData = [] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse = getLocalAIResponse(inputMessage, wishlistData);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000); // 1-2 second realistic delay
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickActions = [
    'When should I buy?',
    'Show me best deals',
    'Price trends',
    'Store recommendations'
  ];

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          width: 60,
          height: 60,
          borderRadius: '50%',
          backgroundColor: '#3b82f6',
          color: 'white',
          border: 'none',
          fontSize: 24,
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)',
          zIndex: 1000,
          transition: 'all 0.3s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)';
          e.currentTarget.style.backgroundColor = '#2563eb';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.backgroundColor = '#3b82f6';
        }}
        title="Chat with Local AI Assistant"
      >
        🤖
      </button>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: 20,
      right: 20,
      width: 320,
      height: 500,
      backgroundColor: 'white',
      borderRadius: 12,
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{
        padding: 16,
        backgroundColor: '#3b82f6',
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 16 }}>🤖 Local AI Assistant</h3>
          <p style={{ margin: 0, fontSize: 12, opacity: 0.9 }}>
            Smart shopping advisor (offline-ready)
          </p>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          style={{
            background: 'none',
            border: 'none',
            color: 'white',
            fontSize: 20,
            cursor: 'pointer',
            padding: 4
          }}
        >
          ×
        </button>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: 16,
        backgroundColor: '#f8fafc'
      }}>
        {messages.length === 0 && (
          <div style={{
            textAlign: 'center',
            color: '#64748b',
            fontSize: 14,
            marginBottom: 16
          }}>
            👋 Hi! I'm your local shopping assistant. I can help you with price tracking, deals, and shopping advice!
            <br /><br />
            Try one of these:
          </div>
        )}

        {messages.length === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => {
                  setInputMessage(action);
                  setTimeout(() => sendMessage(), 100);
                }}
                style={{
                  padding: '8px 12px',
                  backgroundColor: '#e2e8f0',
                  border: 'none',
                  borderRadius: 8,
                  fontSize: 12,
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                {action}
              </button>
            ))}
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            style={{
              marginBottom: 12,
              display: 'flex',
              justifyContent: message.isUser ? 'flex-end' : 'flex-start'
            }}
          >
            <div
              style={{
                maxWidth: '80%',
                padding: 12,
                borderRadius: 12,
                backgroundColor: message.isUser ? '#3b82f6' : 'white',
                color: message.isUser ? 'white' : '#1f2937',
                fontSize: 14,
                lineHeight: 1.4,
                whiteSpace: 'pre-line',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
              }}
            >
              {message.text}
            </div>
          </div>
        ))}

        {isTyping && (
          <div style={{
            display: 'flex',
            justifyContent: 'flex-start',
            marginBottom: 12
          }}>
            <div style={{
              padding: 12,
              backgroundColor: 'white',
              borderRadius: 12,
              fontSize: 14,
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
            }}>
              🤖 Thinking...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div style={{
        padding: 16,
        borderTop: '1px solid #e2e8f0',
        backgroundColor: 'white'
      }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about prices, deals, shopping advice..."
            style={{
              flex: 1,
              padding: 8,
              border: '1px solid #d1d5db',
              borderRadius: 8,
              fontSize: 14,
              outline: 'none'
            }}
          />
          <button
            onClick={sendMessage}
            disabled={!inputMessage.trim() || isTyping}
            style={{
              padding: '8px 12px',
              backgroundColor: inputMessage.trim() ? '#3b82f6' : '#d1d5db',
              color: 'white',
              border: 'none',
              borderRadius: 8,
              cursor: inputMessage.trim() ? 'pointer' : 'not-allowed',
              fontSize: 14
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocalAI;

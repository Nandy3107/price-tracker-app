import React, { useState, useEffect } from 'react';
import axios from '../services/api';
import { getCurrentUserId } from '../utils/auth';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { 
      role: 'assistant', 
      content: '👋 Hi! I\'m your AI shopping assistant powered by Google Gemini. I can help you:\n\n• Track prices and find deals\n• Compare products across platforms\n• Decide when to buy\n• Set up price alerts\n• Get shopping recommendations\n\nWhat would you like to know about your tracked products?',
      timestamp: new Date().toISOString()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [quickActions] = useState([
    'Check for price drops',
    'Best time to buy?',
    'Compare platforms',
    'Set price alerts',
    'Product recommendations'
  ]);

  const sendMessage = async (messageText?: string) => {
    const messageToSend = messageText || inputMessage;
    if (!messageToSend.trim()) return;

    const userMessage: ChatMessage = { 
      role: 'user', 
      content: messageToSend,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setLoading(true);

    try {
      const userId = getCurrentUserId();
      const response = await axios.post('/chatbot/chat', {
        message: messageToSend,
        userId: userId,
        context: { 
          userMessages: messages.slice(-5), // Last 5 messages for context
          timestamp: new Date().toISOString()
        }
      });

      const botMessage: ChatMessage = { 
        role: 'assistant', 
        content: response.data.response,
        timestamp: response.data.timestamp
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Chatbot error:', error);
      const errorMessage: ChatMessage = { 
        role: 'assistant', 
        content: '🔧 Sorry, I encountered a technical issue. Please try again. I\'m still here to help with your shopping questions!',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    }
    setLoading(false);
  };

  const handleSendClick = () => {
    sendMessage();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleQuickAction = (action: string) => {
    sendMessage(action);
  };

  return (
    <div style={{ padding: 24, maxWidth: 800, margin: '0 auto' }}>
      <h2>🤖 AI Shopping Assistant</h2>
      
      <div style={{
        height: 400,
        border: '1px solid #ddd',
        borderRadius: 8,
        padding: 16,
        overflowY: 'auto',
        backgroundColor: '#f9f9f9',
        marginBottom: 16
      }}>
        {messages.map((message, index) => (
          <div
            key={index}
            style={{
              marginBottom: 12,
              display: 'flex',
              justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start'
            }}
          >
            <div style={{
              maxWidth: '70%',
              padding: 12,
              borderRadius: 8,
              backgroundColor: message.role === 'user' ? '#007bff' : '#e9ecef',
              color: message.role === 'user' ? 'white' : 'black'
            }}>
              {message.content}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div style={{
              padding: 12,
              borderRadius: 8,
              backgroundColor: '#e9ecef',
              color: '#666'
            }}>
              🤖 Thinking...
            </div>
          </div>
        )}
      </div>

      {/* Quick Action Buttons */}
      <div style={{ marginBottom: 16 }}>
        <p style={{ margin: '0 0 8px 0', fontSize: 14, color: '#666' }}>
          💡 Quick actions:
        </p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={() => handleQuickAction(action)}
              disabled={loading}
              style={{
                padding: '6px 12px',
                backgroundColor: '#f8f9fa',
                border: '1px solid #ddd',
                borderRadius: 20,
                fontSize: 12,
                cursor: loading ? 'not-allowed' : 'pointer',
                color: '#495057'
              }}
            >
              {action}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask me about prices, deals, or product recommendations..."
          style={{
            flex: 1,
            padding: 12,
            border: '1px solid #ddd',
            borderRadius: 4,
            fontSize: 14
          }}
        />
        <button
          onClick={handleSendClick}
          disabled={loading || !inputMessage.trim()}
          style={{
            padding: '12px 24px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: 4,
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: 14
          }}
        >
          Send
        </button>
      </div>

      <div style={{ marginTop: 16, fontSize: 12, color: '#666' }}>
        <p><strong>Try asking:</strong></p>
        <ul>
          <li>"What's the best time to buy this product?"</li>
          <li>"Compare prices for laptops under ₹50,000"</li>
          <li>"Should I wait for a better deal?"</li>
          <li>"What are the trending deals today?"</li>
        </ul>
      </div>
    </div>
  );
};

export default Chatbot;

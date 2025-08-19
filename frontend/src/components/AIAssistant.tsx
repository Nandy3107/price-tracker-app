import React, { useState, useRef, useEffect } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AIAssistantProps {
  userId?: string;
  wishlistData?: any[];
}

const AIAssistant: React.FC<AIAssistantProps> = ({ userId = 'demo-user', wishlistData = [] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: '👋 Hi! I\'m your AI shopping assistant powered by Google Gemini. I can help you with price tracking, deal hunting, and smart shopping decisions!',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch(`http://localhost:3001/api/ai/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage,
          userId,
          context: {
            recentPriceDrops: []
          }
        }),
      });

      const data = await response.json();
      
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.response || 'Sorry, I encountered an issue. Please try again.',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Sorry, I\'m having trouble connecting right now. Please check that the backend is running and try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickPrompts = [
    "📊 Show me price trends",
    "💰 Find me best deals",
    "🛒 When should I buy?",
    "🔍 Compare platforms",
    "⚡ Set price alerts"
  ];

  const handleQuickPrompt = (prompt: string) => {
    setInputMessage(prompt.substring(2)); // Remove emoji
    setTimeout(() => sendMessage(), 100);
  };

  return (
    <>
      {/* AI Assistant Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            width: 60,
            height: 60,
            borderRadius: '50%',
            backgroundColor: '#4f46e5',
            color: 'white',
            border: 'none',
            fontSize: 24,
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(79, 70, 229, 0.4)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(79, 70, 229, 0.6)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(79, 70, 229, 0.4)';
          }}
        >
          🤖
        </button>
      )}

      {/* AI Assistant Chat Window */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          width: 380,
          height: 500,
          backgroundColor: 'white',
          borderRadius: 16,
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          border: '1px solid #e5e7eb'
        }}>
          {/* Header */}
          <div style={{
            backgroundColor: '#4f46e5',
            color: 'white',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 20 }}>🤖</span>
              <div>
                <div style={{ fontWeight: 600, fontSize: 16 }}>AI Shopping Assistant</div>
                <div style={{ fontSize: 12, opacity: 0.9 }}>Powered by Google Gemini</div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                fontSize: 18,
                cursor: 'pointer',
                padding: 4,
                borderRadius: 4,
                opacity: 0.8
              }}
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1,
            padding: '16px',
            overflowY: 'auto',
            backgroundColor: '#f9fafb'
          }}>
            {messages.map((message, index) => (
              <div
                key={index}
                style={{
                  marginBottom: 16,
                  display: 'flex',
                  justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start'
                }}
              >
                <div style={{
                  maxWidth: '85%',
                  padding: '12px 16px',
                  borderRadius: message.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  backgroundColor: message.role === 'user' ? '#4f46e5' : 'white',
                  color: message.role === 'user' ? 'white' : '#374151',
                  fontSize: 14,
                  lineHeight: 1.5,
                  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
                  border: message.role === 'assistant' ? '1px solid #e5e7eb' : 'none'
                }}>
                  {message.content}
                  <div style={{
                    fontSize: 11,
                    opacity: 0.7,
                    marginTop: 4,
                    textAlign: 'right'
                  }}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div style={{
                display: 'flex',
                justifyContent: 'flex-start',
                marginBottom: 16
              }}>
                <div style={{
                  padding: '12px 16px',
                  borderRadius: '18px 18px 18px 4px',
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  color: '#6b7280'
                }}>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <span style={{ animation: 'pulse 1.4s ease-in-out infinite' }}>●</span>
                    <span style={{ animation: 'pulse 1.4s ease-in-out 0.2s infinite' }}>●</span>
                    <span style={{ animation: 'pulse 1.4s ease-in-out 0.4s infinite' }}>●</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          {messages.length <= 1 && (
            <div style={{
              padding: '0 16px 12px',
              backgroundColor: '#f9fafb'
            }}>
              <div style={{
                fontSize: 12,
                color: '#6b7280',
                marginBottom: 8,
                fontWeight: 500
              }}>
                Quick actions:
              </div>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 6
              }}>
                {quickPrompts.map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickPrompt(prompt)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: 16,
                      border: '1px solid #d1d5db',
                      backgroundColor: 'white',
                      color: '#374151',
                      fontSize: 11,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#4f46e5';
                      e.currentTarget.style.color = 'white';
                      e.currentTarget.style.borderColor = '#4f46e5';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'white';
                      e.currentTarget.style.color = '#374151';
                      e.currentTarget.style.borderColor = '#d1d5db';
                    }}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div style={{
            padding: '16px',
            borderTop: '1px solid #e5e7eb',
            backgroundColor: 'white'
          }}>
            <div style={{
              display: 'flex',
              gap: 8,
              alignItems: 'flex-end'
            }}>
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me about prices, deals, or shopping advice..."
                style={{
                  flex: 1,
                  minHeight: 40,
                  maxHeight: 100,
                  padding: '10px 14px',
                  border: '1px solid #d1d5db',
                  borderRadius: 20,
                  fontSize: 14,
                  resize: 'none',
                  outline: 'none',
                  fontFamily: 'inherit'
                }}
                rows={1}
              />
              <button
                onClick={sendMessage}
                disabled={!inputMessage.trim() || isLoading}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  backgroundColor: inputMessage.trim() && !isLoading ? '#4f46e5' : '#d1d5db',
                  color: 'white',
                  border: 'none',
                  cursor: inputMessage.trim() && !isLoading ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 16,
                  transition: 'background-color 0.2s ease'
                }}
              >
                {isLoading ? '⏳' : '📤'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>
        {`
          @keyframes pulse {
            0%, 80%, 100% {
              opacity: 0.5;
            }
            40% {
              opacity: 1;
            }
          }
        `}
      </style>
    </>
  );
};

export default AIAssistant;

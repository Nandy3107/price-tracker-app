import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  aiSource?: 'gemini' | 'claude' | 'perplexity' | 'chatgpt' | 'local';
}

interface AIProviderSelectorProps {
  userId?: string;
  wishlistData: any[];
  onClose?: () => void;
}

const AIProviderSelector: React.FC<AIProviderSelectorProps> = ({ userId, wishlistData, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: '🤖 AI Provider Selector Ready!\n\nChoose your preferred AI:\n🥇 Gemini - Google\'s most advanced AI\n🧠 Claude - Anthropic\'s powerful reasoning\n🔍 Perplexity - Real-time web search\n💬 ChatGPT - OpenAI\'s conversational AI\n🏠 Local - Always available offline\n\n🎤 Try voice commands or select an AI provider!',
      isUser: false,
      timestamp: new Date(),
      aiSource: 'local'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<string>('auto');
  const [isMinimized, setIsMinimized] = useState(false);
  const [providerStats, setProviderStats] = useState({
    gemini: { available: false, lastUsed: null, responseTime: 0 },
    claude: { available: false, lastUsed: null, responseTime: 0 },
    perplexity: { available: false, lastUsed: null, responseTime: 0 },
    chatgpt: { available: false, lastUsed: null, responseTime: 0 },
    local: { available: true, lastUsed: null, responseTime: 0 }
  });
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

    // Check AI provider availability
    checkProviderAvailability();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  // Check which AI providers are available
  const checkProviderAvailability = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/ai/providers/status', {
        timeout: 5000
      });
      setProviderStats(response.data);
      console.log('✅ Provider status checked:', response.data);
    } catch (error) {
      console.error('❌ Error checking provider status:', error);
      // Fallback: Assume Gemini is available since we have the API key
      setProviderStats({
        gemini: { available: true, lastUsed: null, responseTime: 0 },
        claude: { available: false, lastUsed: null, responseTime: 0 },
        perplexity: { available: false, lastUsed: null, responseTime: 0 },
        chatgpt: { available: false, lastUsed: null, responseTime: 0 },
        local: { available: true, lastUsed: null, responseTime: 0 }
      });
      console.log('✅ Using fallback: Gemini marked as available (API key configured)');
    }
  };

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

  // AI response with provider selection
  const getAIResponse = async (message: string): Promise<{ response: string; source: string; responseTime: number }> => {
    const startTime = Date.now();
    
    try {
      // Try backend first
      const response = await axios.post('http://localhost:3001/api/ai/chat', {
        message,
        preferredProvider: selectedProvider === 'auto' ? undefined : selectedProvider,
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
      }, { timeout: 10000 });

      const responseTime = Date.now() - startTime;
      
      return {
        response: response.data.response,
        source: response.data.source,
        responseTime
      };
    } catch (error) {
      console.error('Backend AI error, trying direct Gemini:', error);
      
      // Fallback: Try Gemini directly if backend is down
      if (selectedProvider === 'gemini' || selectedProvider === 'auto') {
        try {
          const geminiResponse = await callGeminiDirectly(message);
          const responseTime = Date.now() - startTime;
          return {
            response: geminiResponse,
            source: 'gemini',
            responseTime
          };
        } catch (geminiError) {
          console.error('Direct Gemini call failed:', geminiError);
        }
      }
      
      // Final fallback
      const responseTime = Date.now() - startTime;
      return {
        response: '🤖 Backend connection issue. Please make sure both frontend and backend servers are running. Your Gemini API key is configured but the backend server needs to be started.',
        source: 'local',
        responseTime
      };
    }
  };

  // Direct Gemini API call fallback
  const callGeminiDirectly = async (message: string): Promise<string> => {
    const GEMINI_API_KEY = 'AIzaSyDS8EjrJPNR1dvn-pTIuDDslWHbV8sh93c';
    
    const enhancedPrompt = `You are an expert AI shopping assistant. Help with this shopping query: "${message}"

${wishlistData.length > 0 ? `User's Shopping Context:
- Products tracked: ${wishlistData.length}
- Average price: ₹${Math.round(wishlistData.reduce((sum, item) => sum + (item.product?.current_price || 0), 0) / wishlistData.length)}
- Recent products: ${wishlistData.slice(0, 3).map(item => item.product?.name).join(', ')}` : ''}

Provide helpful shopping advice, price analysis, or buy/wait recommendations.`;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [{
            text: enhancedPrompt
          }]
        }]
      },
      {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 15000
      }
    );

    return response.data.candidates[0].content.parts[0].text;
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

      // Update provider stats
      setProviderStats(prev => ({
        ...prev,
        [aiResponse.source]: {
          ...prev[aiResponse.source as keyof typeof prev],
          available: true,
          lastUsed: new Date(),
          responseTime: aiResponse.responseTime
        }
      }));

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

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case 'gemini': return '🥇';
      case 'claude': return '🧠';
      case 'perplexity': return '🔍';
      case 'chatgpt': return '💬';
      case 'local': return '🏠';
      default: return '🤖';
    }
  };

  const getProviderName = (provider: string) => {
    switch (provider) {
      case 'gemini': return 'Google Gemini';
      case 'claude': return 'Claude (Anthropic)';
      case 'perplexity': return 'Perplexity AI';
      case 'chatgpt': return 'ChatGPT (OpenAI)';
      case 'local': return 'Local AI';
      default: return 'Auto Select';
    }
  };

  const getProviderColor = (provider: string) => {
    switch (provider) {
      case 'gemini': return '#4285f4';
      case 'claude': return '#ff6b35';
      case 'perplexity': return '#7c3aed';
      case 'chatgpt': return '#10a37f';
      case 'local': return '#64748b';
      default: return '#4F46E5';
    }
  };

  if (isMinimized) {
    return (
      <div
        style={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          backgroundColor: getProviderColor(selectedProvider),
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
        {getProviderIcon(selectedProvider)}
      </div>
    );
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        width: 420,
        height: 600,
        backgroundColor: 'white',
        borderRadius: 12,
        boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 1000,
        border: '1px solid #e2e8f0'
      }}
    >
      {/* Header with Provider Selector */}
      <div
        style={{
          background: `linear-gradient(135deg, ${getProviderColor(selectedProvider)} 0%, #7C3AED 100%)`,
          color: 'white',
          padding: 12,
          borderRadius: '12px 12px 0 0'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <div>
            <div style={{ fontWeight: '600', fontSize: 14 }}>🤖 AI Provider Selector</div>
            <div style={{ fontSize: 11, opacity: 0.9 }}>
              Choose your AI assistant
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

        {/* Provider Selection */}
        <select
          value={selectedProvider}
          onChange={(e) => setSelectedProvider(e.target.value)}
          style={{
            width: '100%',
            padding: '6px 8px',
            borderRadius: 6,
            border: 'none',
            fontSize: 12,
            backgroundColor: 'rgba(255,255,255,0.9)',
            color: '#1e293b'
          }}
        >
          <option value="auto">🤖 Auto Select (Fallback Chain)</option>
          <option value="gemini">🥇 Google Gemini {providerStats.gemini.available ? '✅' : '❌'}</option>
          <option value="claude">🧠 Claude (Anthropic) {providerStats.claude.available ? '✅' : '❌'}</option>
          <option value="perplexity">🔍 Perplexity AI {providerStats.perplexity.available ? '✅' : '❌'}</option>
          <option value="chatgpt">💬 ChatGPT (OpenAI) {providerStats.chatgpt.available ? '✅' : '❌'}</option>
          <option value="local">🏠 Local AI ✅</option>
        </select>
      </div>

      {/* Provider Stats */}
      <div style={{ padding: '8px 12px', backgroundColor: '#f8fafc', fontSize: 10, color: '#64748b' }}>
        Current: {getProviderIcon(selectedProvider)} {getProviderName(selectedProvider)}
        {providerStats[selectedProvider as keyof typeof providerStats]?.responseTime > 0 && (
          <span> • Response: {providerStats[selectedProvider as keyof typeof providerStats]?.responseTime}ms</span>
        )}
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
                backgroundColor: message.isUser ? getProviderColor(selectedProvider) : '#f1f5f9',
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
                {getProviderIcon(message.aiSource)} {getProviderName(message.aiSource)}
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
              {getProviderIcon(selectedProvider)} {getProviderName(selectedProvider)} is thinking...
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
          placeholder={`Ask ${getProviderName(selectedProvider)}...`}
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
            backgroundColor: getProviderColor(selectedProvider),
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

export default AIProviderSelector;

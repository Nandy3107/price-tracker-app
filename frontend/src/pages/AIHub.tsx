import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AIProviderSelector from '../components/AIProviderSelector';

const AIHub: React.FC = () => {
  const [wishlistData, setWishlistData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDemo, setSelectedDemo] = useState<'selector' | 'enhanced' | 'classic' | null>(null);

  useEffect(() => {
    const loadWishlistData = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/wishlist');
        const data = await response.json();
        setWishlistData(data);
      } catch (error) {
        console.error('Error loading wishlist data:', error);
        setWishlistData([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadWishlistData();
  }, []);

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: 20
    }}>
      <div style={{
        maxWidth: 1400,
        margin: '0 auto',
        backgroundColor: 'white',
        borderRadius: 20,
        boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
        padding: 40
      }}>
        <h1 style={{
          textAlign: 'center',
          fontSize: 48,
          fontWeight: 'bold',
          background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: 10
        }}>
          🤖 AI Hub - Choose Your Experience
        </h1>
        
        <p style={{
          textAlign: 'center',
          fontSize: 20,
          color: '#64748b',
          marginBottom: 40
        }}>
          Experience different AI assistants for your shopping needs
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: 30,
          marginBottom: 40
        }}>
          {/* Multi-AI Provider Selector */}
          <div style={{
            backgroundColor: '#f8fafc',
            padding: 30,
            borderRadius: 16,
            border: '3px solid #4F46E5',
            textAlign: 'center',
            position: 'relative',
            cursor: 'pointer',
            transition: 'transform 0.2s',
            transform: selectedDemo === 'selector' ? 'scale(1.02)' : 'scale(1)'
          }}
          onClick={() => setSelectedDemo('selector')}
          >
            <div style={{
              position: 'absolute',
              top: -15,
              left: 20,
              backgroundColor: '#4F46E5',
              color: 'white',
              padding: '5px 15px',
              borderRadius: 20,
              fontSize: 12,
              fontWeight: 'bold'
            }}>
              🏆 RECOMMENDED
            </div>
            
            <h3 style={{ color: '#4F46E5', marginBottom: 20, fontSize: 24 }}>⚡ Multi-AI Provider Selector</h3>
            
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 18, marginBottom: 10 }}>🥇 Google Gemini</div>
              <div style={{ fontSize: 18, marginBottom: 10 }}>🧠 Anthropic Claude</div>
              <div style={{ fontSize: 18, marginBottom: 10 }}>🔍 Perplexity AI</div>
              <div style={{ fontSize: 18, marginBottom: 10 }}>💬 ChatGPT (OpenAI)</div>
              <div style={{ fontSize: 18, marginBottom: 10 }}>🏠 Local AI Backup</div>
            </div>
            
            <p style={{ color: '#64748b', lineHeight: 1.6, marginBottom: 20 }}>
              <strong>Choose any AI provider or use intelligent auto-fallback chain.</strong> 
              Real-time provider selection with live status monitoring.
            </p>
            
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: 20
            }}>
              <Link 
                to="/ai-providers" 
                style={{
                  backgroundColor: '#4F46E5',
                  color: 'white',
                  padding: '10px 20px',
                  borderRadius: 8,
                  textDecoration: 'none',
                  fontWeight: 'bold'
                }}
              >
                Try Full Version
              </Link>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedDemo(selectedDemo === 'selector' ? null : 'selector');
                }}
                style={{
                  backgroundColor: '#e2e8f0',
                  color: '#4F46E5',
                  padding: '8px 16px',
                  borderRadius: 6,
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                {selectedDemo === 'selector' ? 'Hide Demo' : 'Quick Demo'}
              </button>
            </div>
          </div>

          {/* Enhanced AI */}
          <div style={{
            backgroundColor: '#f8fafc',
            padding: 30,
            borderRadius: 16,
            border: '2px solid #10b981',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'transform 0.2s',
            transform: selectedDemo === 'enhanced' ? 'scale(1.02)' : 'scale(1)'
          }}
          onClick={() => setSelectedDemo('enhanced')}
          >
            <h3 style={{ color: '#10b981', marginBottom: 20, fontSize: 24 }}>🚀 Enhanced AI Assistant</h3>
            
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 16, marginBottom: 8 }}>🎤 Voice Commands</div>
              <div style={{ fontSize: 16, marginBottom: 8 }}>📊 Portfolio Analysis</div>
              <div style={{ fontSize: 16, marginBottom: 8 }}>🔮 Smart Predictions</div>
              <div style={{ fontSize: 16, marginBottom: 8 }}>💡 Buy/Wait Recommendations</div>
            </div>
            
            <p style={{ color: '#64748b', lineHeight: 1.6, marginBottom: 20 }}>
              Enhanced interface with voice commands and advanced shopping intelligence.
            </p>
            
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: 20
            }}>
              <Link 
                to="/chatbot-new" 
                style={{
                  backgroundColor: '#10b981',
                  color: 'white',
                  padding: '10px 20px',
                  borderRadius: 8,
                  textDecoration: 'none',
                  fontWeight: 'bold'
                }}
              >
                Try Enhanced
              </Link>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedDemo(selectedDemo === 'enhanced' ? null : 'enhanced');
                }}
                style={{
                  backgroundColor: '#e2e8f0',
                  color: '#10b981',
                  padding: '8px 16px',
                  borderRadius: 6,
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                {selectedDemo === 'enhanced' ? 'Hide Demo' : 'Quick Demo'}
              </button>
            </div>
          </div>

          {/* Classic AI */}
          <div style={{
            backgroundColor: '#f8fafc',
            padding: 30,
            borderRadius: 16,
            border: '2px solid #64748b',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'transform 0.2s',
            transform: selectedDemo === 'classic' ? 'scale(1.02)' : 'scale(1)'
          }}
          onClick={() => setSelectedDemo('classic')}
          >
            <h3 style={{ color: '#64748b', marginBottom: 20, fontSize: 24 }}>🤖 Classic AI Assistant</h3>
            
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 16, marginBottom: 8 }}>💬 Text Chat Interface</div>
              <div style={{ fontSize: 16, marginBottom: 8 }}>📈 Basic Price Analysis</div>
              <div style={{ fontSize: 16, marginBottom: 8 }}>🛍️ Shopping Advice</div>
              <div style={{ fontSize: 16, marginBottom: 8 }}>📊 Simple Recommendations</div>
            </div>
            
            <p style={{ color: '#64748b', lineHeight: 1.6, marginBottom: 20 }}>
              Traditional chat interface with basic AI shopping assistance.
            </p>
            
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: 20
            }}>
              <Link 
                to="/chatbot" 
                style={{
                  backgroundColor: '#64748b',
                  color: 'white',
                  padding: '10px 20px',
                  borderRadius: 8,
                  textDecoration: 'none',
                  fontWeight: 'bold'
                }}
              >
                Try Classic
              </Link>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedDemo(selectedDemo === 'classic' ? null : 'classic');
                }}
                style={{
                  backgroundColor: '#e2e8f0',
                  color: '#64748b',
                  padding: '8px 16px',
                  borderRadius: 6,
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                {selectedDemo === 'classic' ? 'Hide Demo' : 'Quick Demo'}
              </button>
            </div>
          </div>
        </div>

        {/* Demo Section */}
        {selectedDemo && (
          <div style={{
            backgroundColor: '#f1f5f9',
            padding: 30,
            borderRadius: 16,
            marginBottom: 30,
            border: '2px solid #e2e8f0'
          }}>
            <h3 style={{ 
              color: '#1e293b', 
              marginBottom: 20, 
              textAlign: 'center',
              fontSize: 24
            }}>
              {selectedDemo === 'selector' && '⚡ Multi-AI Provider Selector Demo'}
              {selectedDemo === 'enhanced' && '🚀 Enhanced AI Assistant Demo'} 
              {selectedDemo === 'classic' && '🤖 Classic AI Assistant Demo'}
            </h3>
            
            {selectedDemo === 'selector' && (
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <AIProviderSelector 
                  wishlistData={wishlistData}
                  userId={JSON.parse(localStorage.getItem('user') || 'null')?.id}
                />
              </div>
            )}
            
            {selectedDemo === 'enhanced' && (
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: 18, color: '#64748b', marginBottom: 20 }}>
                  Enhanced AI with voice commands and advanced features
                </p>
                <Link 
                  to="/chatbot-new"
                  style={{
                    backgroundColor: '#10b981',
                    color: 'white',
                    padding: '15px 30px',
                    borderRadius: 10,
                    textDecoration: 'none',
                    fontSize: 18,
                    fontWeight: 'bold'
                  }}
                >
                  Open Enhanced AI Assistant →
                </Link>
              </div>
            )}
            
            {selectedDemo === 'classic' && (
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: 18, color: '#64748b', marginBottom: 20 }}>
                  Traditional chat interface with basic AI features
                </p>
                <Link 
                  to="/chatbot"
                  style={{
                    backgroundColor: '#64748b',
                    color: 'white',
                    padding: '15px 30px',
                    borderRadius: 10,
                    textDecoration: 'none',
                    fontSize: 18,
                    fontWeight: 'bold'
                  }}
                >
                  Open Classic AI Assistant →
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Feature Comparison */}
        <div style={{
          backgroundColor: '#f8fafc',
          padding: 30,
          borderRadius: 16,
          marginBottom: 30
        }}>
          <h3 style={{ color: '#1e293b', marginBottom: 25, textAlign: 'center', fontSize: 28 }}>
            📊 Feature Comparison
          </h3>
          
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#e2e8f0' }}>
                  <th style={{ padding: 15, textAlign: 'left' }}>Feature</th>
                  <th style={{ padding: 15, textAlign: 'center' }}>⚡ Multi-AI Selector</th>
                  <th style={{ padding: 15, textAlign: 'center' }}>🚀 Enhanced AI</th>
                  <th style={{ padding: 15, textAlign: 'center' }}>🤖 Classic AI</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ padding: 15, borderBottom: '1px solid #e2e8f0' }}>AI Provider Choice</td>
                  <td style={{ padding: 15, textAlign: 'center', borderBottom: '1px solid #e2e8f0' }}>✅ 5 Providers</td>
                  <td style={{ padding: 15, textAlign: 'center', borderBottom: '1px solid #e2e8f0' }}>⚠️ Auto-fallback</td>
                  <td style={{ padding: 15, textAlign: 'center', borderBottom: '1px solid #e2e8f0' }}>❌ Local only</td>
                </tr>
                <tr>
                  <td style={{ padding: 15, borderBottom: '1px solid #e2e8f0' }}>Voice Commands</td>
                  <td style={{ padding: 15, textAlign: 'center', borderBottom: '1px solid #e2e8f0' }}>✅ Full Support</td>
                  <td style={{ padding: 15, textAlign: 'center', borderBottom: '1px solid #e2e8f0' }}>✅ Full Support</td>
                  <td style={{ padding: 15, textAlign: 'center', borderBottom: '1px solid #e2e8f0' }}>❌ Text only</td>
                </tr>
                <tr>
                  <td style={{ padding: 15, borderBottom: '1px solid #e2e8f0' }}>Provider Status</td>
                  <td style={{ padding: 15, textAlign: 'center', borderBottom: '1px solid #e2e8f0' }}>✅ Live monitoring</td>
                  <td style={{ padding: 15, textAlign: 'center', borderBottom: '1px solid #e2e8f0' }}>⚠️ Basic</td>
                  <td style={{ padding: 15, textAlign: 'center', borderBottom: '1px solid #e2e8f0' }}>❌ No status</td>
                </tr>
                <tr>
                  <td style={{ padding: 15, borderBottom: '1px solid #e2e8f0' }}>Response Quality</td>
                  <td style={{ padding: 15, textAlign: 'center', borderBottom: '1px solid #e2e8f0' }}>✅ Best available</td>
                  <td style={{ padding: 15, textAlign: 'center', borderBottom: '1px solid #e2e8f0' }}>✅ High quality</td>
                  <td style={{ padding: 15, textAlign: 'center', borderBottom: '1px solid #e2e8f0' }}>⚠️ Basic</td>
                </tr>
                <tr>
                  <td style={{ padding: 15 }}>Customization</td>
                  <td style={{ padding: 15, textAlign: 'center' }}>✅ Full control</td>
                  <td style={{ padding: 15, textAlign: 'center' }}>⚠️ Limited</td>
                  <td style={{ padding: 15, textAlign: 'center' }}>❌ Fixed</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Setup Guide */}
        <div style={{
          backgroundColor: '#fff7ed',
          padding: 30,
          borderRadius: 16,
          border: '2px solid #fed7aa'
        }}>
          <h3 style={{ color: '#ea580c', marginBottom: 20, textAlign: 'center' }}>🚀 Quick Setup for Real AI</h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 20
          }}>
            <div>
              <h4 style={{ color: '#9a3412', marginBottom: 10 }}>1. Get Free API Keys</h4>
              <ul style={{ color: '#9a3412', lineHeight: 1.6 }}>
                <li>🥇 <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer">Gemini (Google)</a></li>
                <li>🧠 <a href="https://console.anthropic.com/" target="_blank" rel="noopener noreferrer">Claude (Anthropic)</a></li>
                <li>🔍 <a href="https://www.perplexity.ai/settings/api" target="_blank" rel="noopener noreferrer">Perplexity AI</a></li>
                <li>💬 <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer">ChatGPT (OpenAI)</a></li>
              </ul>
            </div>
            <div>
              <h4 style={{ color: '#9a3412', marginBottom: 10 }}>2. Configure Backend</h4>
              <p style={{ color: '#9a3412', lineHeight: 1.6 }}>
                Add your API keys to <code>backend/.env</code> file and restart the server.
                The Multi-AI Selector will show ✅ for working providers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIHub;

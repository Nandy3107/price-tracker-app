import React, { useState, useEffect } from 'react';
import AIProviderSelector from '../components/AIProviderSelector';

const AIProviderPage: React.FC = () => {
  const [wishlistData, setWishlistData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
      padding: 20,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <div style={{
        maxWidth: 1200,
        width: '100%',
        backgroundColor: 'white',
        borderRadius: 20,
        boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
        padding: 40,
        marginBottom: 20
      }}>
        <h1 style={{
          textAlign: 'center',
          fontSize: 42,
          fontWeight: 'bold',
          background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: 10
        }}>
          🤖 Real AI Provider Selector
        </h1>
        
        <p style={{
          textAlign: 'center',
          fontSize: 20,
          color: '#64748b',
          marginBottom: 30
        }}>
          Choose Your AI: Gemini • Claude • Perplexity • ChatGPT • Local
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 25,
          marginBottom: 30
        }}>
          <div style={{
            backgroundColor: '#f8fafc',
            padding: 25,
            borderRadius: 12,
            border: '2px solid #4285f4',
            textAlign: 'center'
          }}>
            <h3 style={{ color: '#4285f4', marginBottom: 15, fontSize: 20 }}>🥇 Google Gemini</h3>
            <p style={{ color: '#64748b', lineHeight: 1.6, marginBottom: 15 }}>
              Google's most advanced AI model with superior reasoning and context understanding.
            </p>
            <div style={{ fontSize: 12, color: '#4285f4' }}>
              🔗 <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer">
                Get Free API Key
              </a>
            </div>
          </div>

          <div style={{
            backgroundColor: '#f8fafc',
            padding: 25,
            borderRadius: 12,
            border: '2px solid #ff6b35',
            textAlign: 'center'
          }}>
            <h3 style={{ color: '#ff6b35', marginBottom: 15, fontSize: 20 }}>🧠 Claude (Anthropic)</h3>
            <p style={{ color: '#64748b', lineHeight: 1.6, marginBottom: 15 }}>
              Anthropic's Claude with exceptional reasoning and safety features.
            </p>
            <div style={{ fontSize: 12, color: '#ff6b35' }}>
              🔗 <a href="https://console.anthropic.com/" target="_blank" rel="noopener noreferrer">
                Get Free API Key
              </a>
            </div>
          </div>

          <div style={{
            backgroundColor: '#f8fafc',
            padding: 25,
            borderRadius: 12,
            border: '2px solid #7c3aed',
            textAlign: 'center'
          }}>
            <h3 style={{ color: '#7c3aed', marginBottom: 15, fontSize: 20 }}>🔍 Perplexity AI</h3>
            <p style={{ color: '#64748b', lineHeight: 1.6, marginBottom: 15 }}>
              Real-time web search and up-to-date information retrieval.
            </p>
            <div style={{ fontSize: 12, color: '#7c3aed' }}>
              🔗 <a href="https://www.perplexity.ai/settings/api" target="_blank" rel="noopener noreferrer">
                Get Free API Key
              </a>
            </div>
          </div>

          <div style={{
            backgroundColor: '#f8fafc',
            padding: 25,
            borderRadius: 12,
            border: '2px solid #10a37f',
            textAlign: 'center'
          }}>
            <h3 style={{ color: '#10a37f', marginBottom: 15, fontSize: 20 }}>💬 ChatGPT (OpenAI)</h3>
            <p style={{ color: '#64748b', lineHeight: 1.6, marginBottom: 15 }}>
              OpenAI's ChatGPT with excellent conversational abilities.
            </p>
            <div style={{ fontSize: 12, color: '#10a37f' }}>
              🔗 <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer">
                Get API Key ($5 free)
              </a>
            </div>
          </div>
        </div>

        <div style={{
          backgroundColor: '#f1f5f9',
          padding: 25,
          borderRadius: 12,
          textAlign: 'center',
          marginBottom: 20
        }}>
          <h3 style={{ color: '#1e293b', marginBottom: 15 }}>🚀 Setup Instructions</h3>
          <div style={{ textAlign: 'left', maxWidth: 800, margin: '0 auto' }}>
            <ol style={{ color: '#64748b', lineHeight: 1.8 }}>
              <li><strong>Get API Keys:</strong> Click the links above to get free API keys from each provider</li>
              <li><strong>Add to .env:</strong> Copy your API keys to <code>backend/.env</code> file</li>
              <li><strong>Restart Server:</strong> Restart the backend to load new API keys</li>
              <li><strong>Select Provider:</strong> Use the dropdown to choose your preferred AI</li>
              <li><strong>Test & Compare:</strong> Try the same question with different AIs</li>
            </ol>
          </div>
        </div>

        {isLoading ? (
          <div style={{
            textAlign: 'center',
            padding: 40,
            color: '#64748b'
          }}>
            Loading your data for personalized AI responses...
          </div>
        ) : (
          <div style={{
            backgroundColor: '#f1f5f9',
            padding: 20,
            borderRadius: 12,
            textAlign: 'center'
          }}>
            <h3 style={{ color: '#1e293b', marginBottom: 10 }}>Your Shopping Data</h3>
            <p style={{ color: '#64748b', fontSize: 16 }}>
              Tracking <strong>{wishlistData.length}</strong> products for personalized AI analysis
            </p>
            {wishlistData.length > 0 && (
              <p style={{ color: '#64748b', fontSize: 14, marginTop: 10 }}>
                Each AI will use this data to provide personalized shopping recommendations
              </p>
            )}
          </div>
        )}

        <div style={{
          marginTop: 30,
          padding: 20,
          backgroundColor: '#fff7ed',
          borderRadius: 12,
          border: '1px solid #fed7aa'
        }}>
          <h4 style={{ color: '#ea580c', marginBottom: 15 }}>💡 Pro Tips:</h4>
          <ul style={{ color: '#9a3412', lineHeight: 1.6, paddingLeft: 20 }}>
            <li>Try the same question with different AI providers to compare responses</li>
            <li>Use voice commands for hands-free interaction</li>
            <li>Gemini excels at complex analysis, Claude at reasoning, Perplexity at current data</li>
            <li>Auto mode uses intelligent fallback: Gemini → Claude → Perplexity → ChatGPT → Local</li>
            <li>Each provider shows real response times and availability status</li>
          </ul>
        </div>
      </div>

      {/* AI Provider Selector - Always visible */}
      <AIProviderSelector 
        wishlistData={wishlistData}
        userId={JSON.parse(localStorage.getItem('user') || 'null')?.id}
      />
    </div>
  );
};

export default AIProviderPage;

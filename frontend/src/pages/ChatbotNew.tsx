import React, { useState, useEffect } from 'react';
import EnhancedAI from '../components/EnhancedAI';

const Chatbot: React.FC = () => {
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
          fontSize: 36,
          fontWeight: 'bold',
          background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: 10
        }}>
          🤖 Multi-AI Shopping Assistant
        </h1>
        
        <p style={{
          textAlign: 'center',
          fontSize: 18,
          color: '#64748b',
          marginBottom: 30
        }}>
          Powered by Gemini → Perplexity → OpenAI → Local AI Chain
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 20,
          marginBottom: 30
        }}>
          <div style={{
            backgroundColor: '#f8fafc',
            padding: 20,
            borderRadius: 12,
            border: '1px solid #e2e8f0'
          }}>
            <h3 style={{ color: '#1e293b', marginBottom: 15, fontSize: 18 }}>🎯 Smart Features</h3>
            <ul style={{ color: '#64748b', lineHeight: 1.6, paddingLeft: 20 }}>
              <li>Real-time price analysis</li>
              <li>Buy/Wait recommendations</li>
              <li>Market trend predictions</li>
              <li>Voice command support</li>
            </ul>
          </div>

          <div style={{
            backgroundColor: '#f8fafc',
            padding: 20,
            borderRadius: 12,
            border: '1px solid #e2e8f0'
          }}>
            <h3 style={{ color: '#1e293b', marginBottom: 15, fontSize: 18 }}>🎤 Voice Commands</h3>
            <ul style={{ color: '#64748b', lineHeight: 1.6, paddingLeft: 20 }}>
              <li>"Check iPhone prices"</li>
              <li>"Should I buy now?"</li>
              <li>"Show me best deals"</li>
              <li>"Price analysis"</li>
            </ul>
          </div>

          <div style={{
            backgroundColor: '#f8fafc',
            padding: 20,
            borderRadius: 12,
            border: '1px solid #e2e8f0'
          }}>
            <h3 style={{ color: '#1e293b', marginBottom: 15, fontSize: 18 }}>🤖 AI Chain</h3>
            <ul style={{ color: '#64748b', lineHeight: 1.6, paddingLeft: 20 }}>
              <li>🥇 Gemini AI (Primary)</li>
              <li>🥈 Perplexity AI (Fallback)</li>
              <li>🥉 OpenAI GPT (Backup)</li>
              <li>🏠 Local AI (Always Available)</li>
            </ul>
          </div>
        </div>

        {isLoading ? (
          <div style={{
            textAlign: 'center',
            padding: 40,
            color: '#64748b'
          }}>
            Loading your wishlist data...
          </div>
        ) : (
          <div style={{
            backgroundColor: '#f1f5f9',
            padding: 20,
            borderRadius: 12,
            textAlign: 'center'
          }}>
            <h3 style={{ color: '#1e293b', marginBottom: 10 }}>Your Portfolio</h3>
            <p style={{ color: '#64748b', fontSize: 16 }}>
              Tracking <strong>{wishlistData.length}</strong> products
            </p>
            {wishlistData.length > 0 && (
              <p style={{ color: '#64748b', fontSize: 14, marginTop: 10 }}>
                AI is analyzing your data for personalized recommendations
              </p>
            )}
          </div>
        )}
      </div>

      {/* Enhanced AI Assistant - Always visible */}
      <EnhancedAI 
        wishlistData={wishlistData}
        userId={JSON.parse(localStorage.getItem('user') || 'null')?.id}
      />
    </div>
  );
};

export default Chatbot;

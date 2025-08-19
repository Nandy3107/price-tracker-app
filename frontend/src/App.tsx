import React, { useState, useEffect } from 'react';
import { WishlistProvider } from './context/WishlistContext';
import WishlistLive from './pages/WishlistLive';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Wishlist from './pages/Wishlist';
import PriceTracker from './pages/PriceTracker';
import WishlistImport from './pages/WishlistImport';
import Chatbot from './pages/Chatbot';
import ChatbotNew from './pages/ChatbotNew';
import AIProviderPage from './pages/AIProviderPage';
import AIHub from './pages/AIHub';
import ReferralDashboard from './pages/ReferralDashboard';
import StoreCatalog from './pages/StoreCatalog';
import Login from './pages/Login';
import Profile from './pages/Profile';
import DebugPage from './pages/DebugPage';
import AIProviderSelector from './components/AIProviderSelector';

const App: React.FC = () => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const [showFloatingAI, setShowFloatingAI] = useState(false);
  const [wishlistData, setWishlistData] = useState<any[]>([]);

  useEffect(() => {
    const loadWishlistData = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/wishlist');
        const data = await response.json();
        setWishlistData(data);
      } catch (error) {
        console.error('Error loading wishlist data:', error);
        setWishlistData([]);
      }
    };

    loadWishlistData();

    // Show floating AI after 3 seconds for better UX
    const timer = setTimeout(() => setShowFloatingAI(true), 3000);
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <WishlistProvider>
      <Router>
      <nav style={{ padding: 16, background: '#1976d2', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
          <Link to="/" style={{ color: '#fff', marginRight: 16, textDecoration: 'none', fontWeight: 'bold' }}>🏠 Home</Link>
          <Link to="/import" style={{ color: '#fff', marginRight: 16, textDecoration: 'none' }}>📥 Import</Link>
          <Link to="/wishlist" style={{ color: '#fff', marginRight: 16, textDecoration: 'none' }}>❤️ Wishlist</Link>
          <Link to="/tracker" style={{ color: '#fff', marginRight: 16, textDecoration: 'none' }}>📊 Price Tracker</Link>
          <Link to="/stores" style={{ color: '#fff', marginRight: 16, textDecoration: 'none' }}>🏪 Store Catalog</Link>
          <Link to="/ai-hub" style={{ color: '#fff', marginRight: 16, textDecoration: 'none' }}>🤖 AI Hub</Link>
          <Link to="/chatbot" style={{ color: '#fff', marginRight: 16, textDecoration: 'none' }}>🤖 Classic AI</Link>
          <Link to="/chatbot-new" style={{ color: '#fff', marginRight: 16, textDecoration: 'none' }}>🚀 Enhanced AI</Link>
          <Link to="/ai-providers" style={{ color: '#fff', marginRight: 16, textDecoration: 'none' }}>⚡ Multi-AI Selector</Link>
          <Link to="/referral" style={{ color: '#fff', marginRight: 16, textDecoration: 'none' }}>💰 Referrals</Link>
        </div>
        <div>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 14 }}>👋 Hi, {user.name}!</span>
              <Link to="/profile" style={{ color: '#fff', textDecoration: 'none', padding: '4px 8px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 4 }}>
                Profile
              </Link>
            </div>
          ) : (
            <Link to="/login" style={{ color: '#fff', textDecoration: 'none', padding: '6px 12px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 4 }}>
              Login
            </Link>
          )}
        </div>
      </nav>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/" element={
          <div style={{ padding: 24, textAlign: 'center' }}>
            <h1>🛍️ Price Tracker - BuyHatke Clone</h1>
            <p style={{ fontSize: 18, color: '#666', marginBottom: 32 }}>
              Track prices, get alerts, earn cashback, and shop smart!
            </p>
            {user ? (
              <div>
                <p style={{ marginBottom: 24 }}>Welcome back, <strong>{user.name}</strong>! Ready to track some deals?</p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
                  <Link to="/import" style={{ 
                    padding: '12px 24px', 
                    backgroundColor: '#007bff', 
                    color: 'white', 
                    textDecoration: 'none', 
                    borderRadius: 4 
                  }}>
                    Import Products
                  </Link>
                  <Link to="/tracker" style={{ 
                    padding: '12px 24px', 
                    backgroundColor: '#28a745', 
                    color: 'white', 
                    textDecoration: 'none', 
                    borderRadius: 4 
                  }}>
                    View Tracked Products
                  </Link>
                  <Link to="/ai-hub" style={{ 
                    padding: '12px 24px', 
                    backgroundColor: '#ffc107', 
                    color: 'black', 
                    textDecoration: 'none', 
                    borderRadius: 4 
                  }}>
                    🤖 Explore All AI Options
                  </Link>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
                <Link to="/login" style={{ 
                  padding: '12px 24px', 
                  backgroundColor: '#007bff', 
                  color: 'white', 
                  textDecoration: 'none', 
                  borderRadius: 4 
                }}>
                  Login to Get Started
                </Link>
                <Link to="/ai-hub" style={{ 
                  padding: '12px 24px', 
                  backgroundColor: '#28a745', 
                  color: 'white', 
                  textDecoration: 'none', 
                  borderRadius: 4 
                }}>
                  🤖 Explore All AI Options
                </Link>
              </div>
            )}
          </div>
        } />
        <Route path="/import" element={<WishlistImport />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/wishlist-live" element={<WishlistLive />} />
        <Route path="/tracker" element={<PriceTracker />} />
        <Route path="/stores" element={<StoreCatalog />} />
        <Route path="/ai-hub" element={<AIHub />} />
        <Route path="/chatbot" element={<Chatbot />} />
        <Route path="/chatbot-new" element={<ChatbotNew />} />
        <Route path="/ai-providers" element={<AIProviderPage />} />
        <Route path="/referral" element={<ReferralDashboard />} />
      </Routes>
      
      {/* Floating AI Assistant - Available on all pages except AI pages */}
      {showFloatingAI && !window.location.pathname.includes('/chatbot') && !window.location.pathname.includes('/ai-providers') && !window.location.pathname.includes('/ai-hub') && (
        <AIProviderSelector 
          wishlistData={wishlistData}
          userId={user?.id}
          onClose={() => setShowFloatingAI(false)}
        />
      )}
      </Router>
    </WishlistProvider>
  );
};

export default App;
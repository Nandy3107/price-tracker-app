import React, { useState, useEffect } from 'react';
import axios from '../services/api';
import { getCurrentUserId, getCurrentUser } from '../utils/auth';

const Profile: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({
    totalProducts: 0,
    byPlatform: {} as Record<string, number>,
    totalSavings: 0
  });
  const [preferences, setPreferences] = useState({
    whatsapp_number: '',
    preferred_platforms: [] as string[],
    price_alert_threshold: 10
  });

  useEffect(() => {
    loadUserData();
    loadStats();
  }, []);

  const loadUserData = () => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setPreferences({
        whatsapp_number: currentUser.preferences?.whatsapp_number || '',
        preferred_platforms: currentUser.preferences?.preferred_platforms || ['Amazon', 'Flipkart', 'Myntra'],
        price_alert_threshold: currentUser.preferences?.price_alert_threshold || 10
      });
    }
  };

  const loadStats = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
      
      const userId = getCurrentUserId();
      const response = await axios.get(`/wishlist?userId=${userId}`);
      const products = response.data || [];
      
      const platformCounts: Record<string, number> = {};
      let totalSavings = 0;
      
      products.forEach((item: any) => {
        const platform = item.product?.platform || 'Unknown';
        platformCounts[platform] = (platformCounts[platform] || 0) + 1;
        
        // Calculate potential savings
        if (item.price_history && item.price_history.length > 0) {
          const maxPrice = Math.max(...item.price_history.map((h: any) => h.price));
          const savings = maxPrice - item.product.current_price;
          if (savings > 0) totalSavings += savings;
        }
      });

      setStats({
        totalProducts: products.length,
        byPlatform: platformCounts,
        totalSavings
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const savePreferences = async () => {
    try {
      await axios.put('/auth/preferences', preferences);
      alert('Preferences saved successfully!');
    } catch (error) {
      alert('Failed to save preferences');
    }
  };

  if (!user) {
    return (
      <div style={{ padding: 24, textAlign: 'center' }}>
        <h2>Please login to view your profile</h2>
        <button
          onClick={() => window.location.href = '/login'}
          style={{
            padding: '12px 24px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer'
          }}
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: 24, maxWidth: 800, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2>👤 My Profile</h2>
        <button
          onClick={handleLogout}
          style={{
            padding: '8px 16px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer'
          }}
        >
          Logout
        </button>
      </div>

      {/* User Info */}
      <div style={{ border: '1px solid #ddd', borderRadius: 8, padding: 20, marginBottom: 24 }}>
        <h3>User Information</h3>
        <div style={{ marginBottom: 8 }}><strong>Name:</strong> {user.name}</div>
        <div style={{ marginBottom: 8 }}><strong>Email:</strong> {user.email}</div>
        <div><strong>Member Since:</strong> {new Date().toLocaleDateString()}</div>
      </div>

      {/* Statistics */}
      <div style={{ border: '1px solid #ddd', borderRadius: 8, padding: 20, marginBottom: 24 }}>
        <h3>📊 Your Tracking Stats</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
          <div style={{ textAlign: 'center', padding: 16, backgroundColor: '#f8f9fa', borderRadius: 4 }}>
            <div style={{ fontSize: 24, fontWeight: 'bold', color: '#007bff' }}>{stats.totalProducts}</div>
            <div>Products Tracked</div>
          </div>
          <div style={{ textAlign: 'center', padding: 16, backgroundColor: '#f8f9fa', borderRadius: 4 }}>
            <div style={{ fontSize: 24, fontWeight: 'bold', color: '#28a745' }}>₹{stats.totalSavings}</div>
            <div>Total Savings</div>
          </div>
        </div>
        
        <div style={{ marginTop: 16 }}>
          <h4>Products by Platform:</h4>
          {Object.entries(stats.byPlatform).map(([platform, count]) => (
            <div key={platform} style={{ display: 'flex', justifyContent: 'space-between', margin: '4px 0' }}>
              <span>{platform}:</span>
              <span><strong>{count}</strong></span>
            </div>
          ))}
        </div>
      </div>

      {/* Preferences */}
      <div style={{ border: '1px solid #ddd', borderRadius: 8, padding: 20 }}>
        <h3>⚙️ Preferences</h3>
        
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>
            WhatsApp Number (for price alerts):
          </label>
          <input
            type="tel"
            value={preferences.whatsapp_number}
            onChange={(e) => setPreferences({...preferences, whatsapp_number: e.target.value})}
            placeholder="+91XXXXXXXXXX"
            style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 4 }}
          />
        </div>
        
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>
            Price Alert Threshold (% drop):
          </label>
          <input
            type="number"
            value={preferences.price_alert_threshold}
            onChange={(e) => setPreferences({...preferences, price_alert_threshold: parseInt(e.target.value)})}
            min="1"
            max="50"
            style={{ width: '100px', padding: 8, border: '1px solid #ddd', borderRadius: 4 }}
          />
          <span style={{ marginLeft: 8, fontSize: 14, color: '#666' }}>
            Get notified when price drops by this percentage
          </span>
        </div>
        
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>
            Preferred Platforms:
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {['Amazon', 'Flipkart', 'Myntra', 'Ajio', 'Nykaa', 'Meesho'].map(platform => (
              <label key={platform} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={preferences.preferred_platforms.includes(platform)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setPreferences({
                        ...preferences,
                        preferred_platforms: [...preferences.preferred_platforms, platform]
                      });
                    } else {
                      setPreferences({
                        ...preferences,
                        preferred_platforms: preferences.preferred_platforms.filter(p => p !== platform)
                      });
                    }
                  }}
                  style={{ marginRight: 4 }}
                />
                {platform}
              </label>
            ))}
          </div>
        </div>
        
        <button
          onClick={savePreferences}
          style={{
            padding: '12px 24px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer'
          }}
        >
          Save Preferences
        </button>
      </div>
    </div>
  );
};

export default Profile;

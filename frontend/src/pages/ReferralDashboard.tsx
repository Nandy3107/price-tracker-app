import React, { useState, useEffect } from 'react';
import axios from '../services/api';

const ReferralDashboard: React.FC = () => {
  const [referralCode, setReferralCode] = useState('');
  const [loading, setLoading] = useState(false);
  // const [cashbackEarned, setCashbackEarned] = useState(0); // Will be used when fetching real data

  useEffect(() => {
    fetchReferralCode();
  }, []);

  const fetchReferralCode = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await axios.get('/referral/code');
        setReferralCode(response.data.referralCode);
      }
    } catch (error) {
      console.error('Failed to fetch referral code:', error);
    }
    setLoading(false);
  };

  const copyReferralCode = () => {
    navigator.clipboard.writeText(referralCode);
    alert('Referral code copied to clipboard!');
  };

  const shareWhatsApp = () => {
    const message = `Hey! Join this amazing price tracking app and save money on your purchases. Use my referral code: ${referralCode}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div style={{ padding: 24, maxWidth: 600, margin: '0 auto' }}>
      <h2>💰 Referral Dashboard</h2>
      
      <div style={{
        border: '1px solid #ddd',
        borderRadius: 8,
        padding: 20,
        marginBottom: 24,
        backgroundColor: '#f8f9fa'
      }}>
        <h3>Your Referral Code</h3>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            marginBottom: 16
          }}>
            <code style={{
              fontSize: 18,
              fontWeight: 'bold',
              backgroundColor: '#e9ecef',
              padding: '8px 12px',
              borderRadius: 4,
              flex: 1
            }}>
              {referralCode}
            </code>
            <button
              onClick={copyReferralCode}
              style={{
                padding: '8px 16px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: 4,
                cursor: 'pointer'
              }}
            >
              Copy
            </button>
          </div>
        )}
        
        <div style={{ display: 'flex', gap: 12 }}>
          <button
            onClick={shareWhatsApp}
            style={{
              padding: '12px 24px',
              backgroundColor: '#25d366',
              color: 'white',
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer',
              fontSize: 14
            }}
          >
            📱 Share on WhatsApp
          </button>
        </div>
      </div>

      <div style={{
        border: '1px solid #ddd',
        borderRadius: 8,
        padding: 20,
        marginBottom: 24
      }}>
        <h3>Earnings Summary</h3>
        <div style={{ fontSize: 24, fontWeight: 'bold', color: '#28a745' }}>
          ₹{0} {/* Will show actual earnings when integrated with backend */}
        </div>
        <div style={{ fontSize: 14, color: '#666' }}>
          Total Cashback Earned
        </div>
      </div>

      <div style={{
        border: '1px solid #ddd',
        borderRadius: 8,
        padding: 20
      }}>
        <h3>How It Works</h3>
        <ol style={{ fontSize: 14, lineHeight: 1.6 }}>
          <li>Share your referral code with friends</li>
          <li>When they sign up using your code, they become your referrals</li>
          <li>Earn 5% cashback on all their purchases (after return period)</li>
          <li>No limit on earnings - refer more, earn more!</li>
        </ol>
        
        <div style={{
          backgroundColor: '#fff3cd',
          border: '1px solid #ffeaa7',
          borderRadius: 4,
          padding: 12,
          marginTop: 16
        }}>
          <strong>💡 Pro Tip:</strong> Share deals and price drops with your referrals to encourage purchases and maximize your earnings!
        </div>
      </div>
    </div>
  );
};

export default ReferralDashboard;

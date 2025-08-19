import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface RealTimePriceMonitorProps {
  productId?: string;
  productName?: string;
  currentPrice?: number;
  productUrl?: string;
  platform?: string;
}

const RealTimePriceMonitor: React.FC<RealTimePriceMonitorProps> = ({
  productId,
  productName,
  currentPrice,
  productUrl,
  platform
}) => {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [priceData, setPriceData] = useState<any>(null);
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  // Check real-time price
  const checkRealTimePrice = async () => {
    if (!productName || !currentPrice || !platform) return;

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:3001/api/ai/analyze-price', {
        productName,
        currentPrice,
        platform,
        url: productUrl
      });

      setPriceData(response.data);
      setAiAnalysis(response.data.analysis);
      setLastChecked(new Date());
    } catch (error) {
      console.error('Failed to check real-time price:', error);
    } finally {
      setLoading(false);
    }
  };

  // Start monitoring
  const startMonitoring = async () => {
    try {
      await axios.post('http://localhost:3001/api/ai/start-monitoring');
      setIsMonitoring(true);
    } catch (error) {
      console.error('Failed to start monitoring:', error);
    }
  };

  // Stop monitoring
  const stopMonitoring = async () => {
    try {
      await axios.post('http://localhost:3001/api/ai/stop-monitoring');
      setIsMonitoring(false);
    } catch (error) {
      console.error('Failed to stop monitoring:', error);
    }
  };

  // Check monitoring status on mount
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/ai/monitoring-status');
        setIsMonitoring(response.data.isActive);
      } catch (error) {
        console.error('Failed to get monitoring status:', error);
      }
    };
    checkStatus();
  }, []);

  // Auto-check price every 60 seconds if product data is available
  useEffect(() => {
    if (productName && currentPrice) {
      checkRealTimePrice();
      
      const interval = setInterval(() => {
        checkRealTimePrice();
      }, 60000); // Check every minute

      return () => clearInterval(interval);
    }
  }, [productName, currentPrice, platform, productUrl]);

  const getPriceChangeColor = (change: number) => {
    if (change > 0) return '#e53e3e'; // Red for price increase
    if (change < 0) return '#38a169'; // Green for price decrease
    return '#718096'; // Gray for no change
  };

  const getPriceChangeIcon = (change: number) => {
    if (change > 0) return '📈';
    if (change < 0) return '📉';
    return '➖';
  };

  return (
    <div style={{
      padding: 12,
      backgroundColor: '#f7fafc',
      borderRadius: 8,
      border: '1px solid #e2e8f0',
      marginTop: 8
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <h4 style={{ margin: 0, fontSize: 14, fontWeight: '600', color: '#2d3748' }}>
          🔍 Real-Time Price Monitor
        </h4>
        <div style={{ display: 'flex', gap: 4 }}>
          {!isMonitoring ? (
            <button
              onClick={startMonitoring}
              style={{
                padding: '4px 8px',
                backgroundColor: '#38a169',
                color: 'white',
                border: 'none',
                borderRadius: 4,
                fontSize: 11,
                cursor: 'pointer'
              }}
            >
              ▶️ Start
            </button>
          ) : (
            <button
              onClick={stopMonitoring}
              style={{
                padding: '4px 8px',
                backgroundColor: '#e53e3e',
                color: 'white',
                border: 'none',
                borderRadius: 4,
                fontSize: 11,
                cursor: 'pointer'
              }}
            >
              ⏹️ Stop
            </button>
          )}
          <button
            onClick={checkRealTimePrice}
            disabled={loading}
            style={{
              padding: '4px 8px',
              backgroundColor: '#4299e1',
              color: 'white',
              border: 'none',
              borderRadius: 4,
              fontSize: 11,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1
            }}
          >
            {loading ? '⏳' : '🔄'} Check Now
          </button>
        </div>
      </div>

      {/* Status */}
      <div style={{ fontSize: 11, color: '#718096', marginBottom: 8 }}>
        Status: {isMonitoring ? '🟢 Monitoring Active' : '🔴 Monitoring Inactive'}
        {lastChecked && (
          <span style={{ marginLeft: 8 }}>
            Last checked: {lastChecked.toLocaleTimeString()}
          </span>
        )}
      </div>

      {/* Price Data */}
      {priceData && (
        <div>
          {priceData.livePrice && (
            <div style={{
              padding: 8,
              backgroundColor: 'white',
              borderRadius: 6,
              border: '1px solid #e2e8f0',
              marginBottom: 8
            }}>
              <div style={{ fontSize: 12, fontWeight: '600', color: '#2d3748', marginBottom: 4 }}>
                📊 Live Price Data
              </div>
              <div style={{ fontSize: 11, color: '#4a5568' }}>
                Current: ₹{priceData.livePrice.currentPrice.toLocaleString()}
                <span style={{ marginLeft: 8, color: '#718096' }}>
                  ({priceData.livePrice.availability})
                </span>
              </div>
              {priceData.priceChange && (
                <div style={{
                  fontSize: 11,
                  color: getPriceChangeColor(priceData.priceChange.difference),
                  marginTop: 4
                }}>
                  {getPriceChangeIcon(priceData.priceChange.difference)} 
                  Change: ₹{Math.abs(priceData.priceChange.difference).toLocaleString()} 
                  ({priceData.priceChange.percentChange}%)
                </div>
              )}
            </div>
          )}

          {/* AI Analysis */}
          {aiAnalysis && (
            <div style={{
              padding: 8,
              backgroundColor: '#edf2f7',
              borderRadius: 6,
              border: '1px solid #cbd5e0'
            }}>
              <div style={{ fontSize: 11, fontWeight: '600', color: '#2d3748', marginBottom: 4 }}>
                🤖 AI Analysis
              </div>
              <div style={{ fontSize: 10, color: '#4a5568', lineHeight: 1.4 }}>
                {aiAnalysis}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RealTimePriceMonitor;

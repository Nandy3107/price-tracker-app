import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import axios from '../services/api';
import { getCurrentUserId } from '../utils/auth';

interface PriceHistoryData {
  price: number;
  recorded_at: string;
  date: string; // formatted date for display
}

interface EnhancedPriceChartProps {
  productId: string;
  productName: string;
  currentPrice: number;
  targetPrice?: number;
}

const EnhancedPriceChart: React.FC<EnhancedPriceChartProps> = ({ 
  productId, 
  productName, 
  currentPrice, 
  targetPrice 
}) => {
  const [history, setHistory] = useState<PriceHistoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  useEffect(() => {
    fetchPriceHistory();
  }, [productId, timeRange]);

  const fetchPriceHistory = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
      
      const userId = getCurrentUserId();
      const response = await axios.get(`/price-history/${productId}?userId=${userId}`);
      const data = response.data.map((item: any) => ({
        ...item,
        date: new Date(item.recorded_at).toLocaleDateString('en-IN', {
          month: 'short',
          day: 'numeric'
        }),
        fullDate: new Date(item.recorded_at).toLocaleDateString('en-IN')
      }));
      
      // Filter based on time range
      const filteredData = filterDataByTimeRange(data, timeRange);
      setHistory(filteredData);
    } catch (error) {
      console.error('Failed to fetch price history:', error);
      setHistory([]);
    }
    setLoading(false);
  };

  const filterDataByTimeRange = (data: any[], range: string) => {
    const now = new Date();
    let daysBack = 30;
    
    switch (range) {
      case '7d': daysBack = 7; break;
      case '30d': daysBack = 30; break;
      case '90d': daysBack = 90; break;
      case '1y': daysBack = 365; break;
    }
    
    const cutoffDate = new Date(now.getTime() - (daysBack * 24 * 60 * 60 * 1000));
    return data.filter(item => new Date(item.recorded_at) >= cutoffDate);
  };

  // Smart price formatting function
  const formatPrice = (price: number): string => {
    if (price >= 100000) {
      return `₹${(price / 100000).toFixed(1)}L`; // Lakhs
    } else if (price >= 1000) {
      return `₹${(price / 1000).toFixed(1)}k`; // Thousands
    } else {
      return `₹${price.toLocaleString()}`;
    }
  };

  const getMinMaxPrices = () => {
    if (history.length === 0) return { min: currentPrice, max: currentPrice };
    const prices = history.map(h => h.price);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices)
    };
  };

  const calculateSavings = () => {
    const { min, max } = getMinMaxPrices();
    return {
      maxSavings: max - currentPrice,
      percentageSaving: max > 0 ? ((max - currentPrice) / max * 100) : 0
    };
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          backgroundColor: 'white',
          padding: '12px',
          border: '1px solid #ccc',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          <p style={{ margin: 0, fontWeight: 'bold' }}>{`Date: ${payload[0].payload.fullDate}`}</p>
          <p style={{ margin: '4px 0 0 0', color: '#007bff' }}>
            {`Price: ₹${payload[0].value.toLocaleString()}`}
          </p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div style={{ 
        padding: 20, 
        textAlign: 'center',
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        border: '1px solid #e9ecef'
      }}>
        Loading price history...
      </div>
    );
  }

  const { min, max } = getMinMaxPrices();
  const { maxSavings, percentageSaving } = calculateSavings();

  return (
    <div style={{
      backgroundColor: 'white',
      border: '1px solid #e9ecef',
      borderRadius: 12,
      padding: 20,
      margin: '20px 0',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }}>
      {/* Header */}
      <div style={{ marginBottom: 12 }}>
        <h4 style={{ margin: '0 0 4px 0', color: '#333', fontSize: 14 }}>Price Tracking</h4>
        <p style={{ margin: 0, color: '#666', fontSize: 11, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{productName}</p>
      </div>

      {/* Compact Price Summary */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))',
        gap: 8,
        marginBottom: 12
      }}>
        <div style={{ textAlign: 'center', padding: 8, backgroundColor: '#f8f9fa', borderRadius: 6 }}>
          <div style={{ fontSize: 10, color: '#666', marginBottom: 2 }}>Current</div>
          <div style={{ fontSize: 14, fontWeight: 'bold', color: '#007bff' }}>
            {formatPrice(currentPrice)}
          </div>
        </div>
        
        <div style={{ textAlign: 'center', padding: 8, backgroundColor: '#f8f9fa', borderRadius: 6 }}>
          <div style={{ fontSize: 10, color: '#666', marginBottom: 2 }}>Lowest</div>
          <div style={{ fontSize: 14, fontWeight: 'bold', color: '#28a745' }}>
            {formatPrice(min)}
          </div>
        </div>
        
        <div style={{ textAlign: 'center', padding: 8, backgroundColor: '#f8f9fa', borderRadius: 6 }}>
          <div style={{ fontSize: 10, color: '#666', marginBottom: 2 }}>Highest</div>
          <div style={{ fontSize: 14, fontWeight: 'bold', color: '#dc3545' }}>
            {formatPrice(max)}
          </div>
        </div>
        
        {maxSavings > 0 && (
          <div style={{ textAlign: 'center', padding: 8, backgroundColor: '#e7f3ff', borderRadius: 6 }}>
            <div style={{ fontSize: 10, color: '#666', marginBottom: 2 }}>Savings</div>
            <div style={{ fontSize: 12, fontWeight: 'bold', color: '#007bff' }}>
              {percentageSaving.toFixed(0)}%
            </div>
          </div>
        )}
      </div>

      {/* Compact Time Range Selector */}
      <div style={{ marginBottom: 12, display: 'flex', gap: 4 }}>
        {['7d', '30d', '90d', '1y'].map((range) => (
          <button
            key={range}
            onClick={() => setTimeRange(range as any)}
            style={{
              padding: '4px 8px',
              border: '1px solid #ddd',
              borderRadius: 3,
              backgroundColor: timeRange === range ? '#007bff' : 'white',
              color: timeRange === range ? 'white' : '#333',
              cursor: 'pointer',
              fontSize: 10
            }}
          >
            {range === '7d' ? '7D' : range === '30d' ? '1M' : range === '90d' ? '3M' : '1Y'}
          </button>
        ))}
      </div>

      {/* Price Chart */}
      {history.length > 0 ? (
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={history}>
            <defs>
              <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#007bff" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#007bff" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="date" 
              stroke="#666"
              fontSize={10}
              tick={{ fill: '#666' }}
            />
            <YAxis 
              stroke="#666"
              fontSize={10}
              tick={{ fill: '#666' }}
              tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="price"
              stroke="#007bff"
              strokeWidth={2}
              fill="url(#priceGradient)"
            />
            {targetPrice && (
              <Line
                type="monotone"
                dataKey={() => targetPrice}
                stroke="#28a745"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      ) : (
        <div style={{
          height: 120,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f8f9fa',
          borderRadius: 8,
          color: '#666',
          fontSize: 12
        }}>
          No price history available yet
        </div>
      )}

      {/* Compact Price Alert Section */}
      {targetPrice && (
        <div style={{
          marginTop: 12,
          padding: 8,
          backgroundColor: '#e7f3ff',
          borderRadius: 6,
          borderLeft: '3px solid #007bff'
        }}>
          <div style={{ fontSize: 11, fontWeight: 'bold', marginBottom: 2 }}>
            🎯 Price Alert: ₹{targetPrice.toLocaleString()}
            {currentPrice <= targetPrice && (
              <span style={{ color: '#28a745', fontWeight: 'bold' }}> - REACHED!</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedPriceChart;

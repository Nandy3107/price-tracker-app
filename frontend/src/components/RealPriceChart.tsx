import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';

interface PricePoint {
  price: number;
  recorded_at: string;
}

interface RealPriceChartProps {
  productId: string;
  productName?: string;
  currentPrice?: number;
  targetPrice?: number;
  height?: number;
}

const RealPriceChart: React.FC<RealPriceChartProps> = ({
  productId,
  productName,
  currentPrice,
  targetPrice,
  height = 200
}) => {
  const [priceHistory, setPriceHistory] = useState<PricePoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPriceHistory();
  }, [productId]);

  const fetchPriceHistory = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3001/api/price-history/${productId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch price history');
      }
      
      const data = await response.json();
      
      // Transform data for chart
      const chartData = data.price_history?.map((point: PricePoint) => ({
        ...point,
        date: new Date(point.recorded_at).toLocaleDateString('en-IN', {
          month: 'short',
          day: 'numeric'
        }),
        formattedPrice: `₹${point.price.toLocaleString()}`
      })) || [];
      
      // Add current price as latest point if available
      if (currentPrice && chartData.length > 0) {
        const latestDate = new Date();
        chartData.push({
          price: currentPrice,
          recorded_at: latestDate.toISOString(),
          date: latestDate.toLocaleDateString('en-IN', {
            month: 'short',
            day: 'numeric'
          }),
          formattedPrice: `₹${currentPrice.toLocaleString()}`
        });
      }
      
      setPriceHistory(chartData);
    } catch (err) {
      console.error('Error fetching price history:', err);
      setError('Unable to load price history');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (value: number) => {
    if (value >= 100000) {
      return `₹${(value / 100000).toFixed(1)}L`;
    } else if (value >= 1000) {
      return `₹${(value / 1000).toFixed(1)}k`;
    }
    return `₹${value}`;
  };

  const getMinMaxPrices = () => {
    if (priceHistory.length === 0) return { min: 0, max: 0 };
    
    const prices = priceHistory.map(p => p.price);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices)
    };
  };

  const { min, max } = getMinMaxPrices();
  const priceRange = max - min;
  const yAxisPadding = priceRange * 0.1;

  if (loading) {
    return (
      <div style={{
        height,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8f9fa',
        borderRadius: 8
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          color: '#6c757d'
        }}>
          <div style={{
            width: 16,
            height: 16,
            border: '2px solid #dee2e6',
            borderTop: '2px solid #007bff',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
          Loading price history...
        </div>
      </div>
    );
  }

  if (error || priceHistory.length === 0) {
    return (
      <div style={{
        height,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        padding: 16
      }}>
        <div style={{ color: '#6c757d', fontSize: 14, textAlign: 'center' }}>
          {error || 'No price history available'}
        </div>
        {currentPrice && (
          <div style={{
            marginTop: 8,
            fontSize: 18,
            fontWeight: 'bold',
            color: '#007bff'
          }}>
            Current: ₹{currentPrice.toLocaleString()}
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={priceHistory}
          margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e9ecef" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 11, fill: '#6c757d' }}
            axisLine={{ stroke: '#dee2e6' }}
          />
          <YAxis 
            domain={[min - yAxisPadding, max + yAxisPadding]}
            tick={{ fontSize: 11, fill: '#6c757d' }}
            axisLine={{ stroke: '#dee2e6' }}
            tickFormatter={formatPrice}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #dee2e6',
              borderRadius: 8,
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
            }}
            formatter={(value: number, name: string) => [
              `₹${value.toLocaleString()}`,
              'Price'
            ]}
            labelFormatter={(label) => `Date: ${label}`}
          />
          
          {/* Target price line */}
          {targetPrice && (
            <ReferenceLine 
              y={targetPrice} 
              stroke="#28a745" 
              strokeDasharray="5 5"
              label={{ value: `Target: ${formatPrice(targetPrice)}`, position: 'top' }}
            />
          )}
          
          {/* Price trend line */}
          <Line
            type="monotone"
            dataKey="price"
            stroke="#007bff"
            strokeWidth={2}
            dot={{ fill: '#007bff', strokeWidth: 2, r: 3 }}
            activeDot={{ r: 5, stroke: '#007bff', strokeWidth: 2, fill: 'white' }}
          />
        </LineChart>
      </ResponsiveContainer>
      
      {/* Price summary */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
        padding: '0 10px',
        fontSize: 11,
        color: '#6c757d'
      }}>
        <span>📉 Low: {formatPrice(min)}</span>
        <span>📈 High: {formatPrice(max)}</span>
        <span>💰 Current: {formatPrice(currentPrice || max)}</span>
      </div>
      
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default RealPriceChart;

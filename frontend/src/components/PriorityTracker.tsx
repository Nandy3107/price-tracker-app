import React, { useState, useEffect } from 'react';

interface PriorityProduct {
  id: string;
  name: string;
  currentPrice: number;
  targetPrice: number;
  platform: string;
  category: string;
  urgencyScore: number;
  priceDropPercentage: number;
  daysTracked: number;
  imageUrl: string;
}

const PriorityTracker: React.FC = () => {
  const [priorityProducts, setPriorityProducts] = useState<PriorityProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPriorityProducts();
  }, []);

  const fetchPriorityProducts = async () => {
    try {
      setLoading(true);
      // Simulate API call - replace with actual API
      const response = await fetch('http://localhost:3001/api/priority-products?userId=demo-user');
      const data = await response.json();
      
      // Calculate urgency scores and sort
      const productsWithUrgency = data.map((product: any) => ({
        ...product,
        urgencyScore: calculateUrgencyScore(product),
        priceDropPercentage: calculatePriceDropPercentage(product),
        daysTracked: calculateDaysTracked(product.added_at)
      }));

      // Sort by urgency score and take top 10
      const topProducts = productsWithUrgency
        .sort((a: PriorityProduct, b: PriorityProduct) => b.urgencyScore - a.urgencyScore)
        .slice(0, 10);

      setPriorityProducts(topProducts);
    } catch (error) {
      console.error('Error fetching priority products:', error);
      // Fallback to demo data
      setPriorityProducts(generateDemoData());
    } finally {
      setLoading(false);
    }
  };

  const calculateUrgencyScore = (product: any): number => {
    let score = 0;
    
    // Price proximity to target (40% weight)
    if (product.target_price) {
      const proximityPercentage = ((product.target_price - product.current_price) / product.target_price) * 100;
      score += Math.max(0, proximityPercentage) * 0.4;
    }
    
    // Recent price drops (30% weight)
    const priceHistory = product.price_history || [];
    if (priceHistory.length >= 2) {
      const recentDrop = ((priceHistory[priceHistory.length - 2].price - product.current_price) / priceHistory[priceHistory.length - 2].price) * 100;
      score += Math.max(0, recentDrop) * 0.3;
    }
    
    // Days tracked (20% weight) - longer tracking gets higher priority
    const daysTracked = calculateDaysTracked(product.added_at);
    score += Math.min(daysTracked / 30, 1) * 20;
    
    // Platform priority (10% weight)
    const platformWeights: { [key: string]: number } = {
      'Amazon': 10,
      'Flipkart': 9,
      'Myntra': 8,
      'Ajio': 7
    };
    score += (platformWeights[product.platform] || 5);
    
    return Math.round(score);
  };

  const calculatePriceDropPercentage = (product: any): number => {
    const priceHistory = product.price_history || [];
    if (priceHistory.length === 0) return 0;
    
    const initialPrice = priceHistory[0].price;
    return Math.round(((initialPrice - product.current_price) / initialPrice) * 100);
  };

  const calculateDaysTracked = (addedAt: string): number => {
    const addedDate = new Date(addedAt);
    const now = new Date();
    return Math.floor((now.getTime() - addedDate.getTime()) / (1000 * 60 * 60 * 24));
  };

  const generateDemoData = (): PriorityProduct[] => {
    return [
      {
        id: '1',
        name: 'iPhone 15 Pro Max 256GB',
        currentPrice: 134900,
        targetPrice: 120000,
        platform: 'Amazon',
        category: 'Electronics',
        urgencyScore: 95,
        priceDropPercentage: 12,
        daysTracked: 28,
        imageUrl: 'https://via.placeholder.com/80x80/007bff/FFFFFF?text=📱'
      },
      {
        id: '2',
        name: 'Samsung 65" QLED TV',
        currentPrice: 89999,
        targetPrice: 75000,
        platform: 'Flipkart',
        category: 'Electronics',
        urgencyScore: 88,
        priceDropPercentage: 8,
        daysTracked: 21,
        imageUrl: 'https://via.placeholder.com/80x80/0066cc/FFFFFF?text=📺'
      },
      {
        id: '3',
        name: 'Nike Air Jordan Retro',
        currentPrice: 12495,
        targetPrice: 10000,
        platform: 'Myntra',
        category: 'Fashion',
        urgencyScore: 82,
        priceDropPercentage: 15,
        daysTracked: 14,
        imageUrl: 'https://via.placeholder.com/80x80/e91e63/FFFFFF?text=👟'
      }
    ];
  };

  const getUrgencyColor = (score: number): string => {
    if (score >= 90) return '#ef4444'; // Red - High urgency
    if (score >= 70) return '#f59e0b'; // Orange - Medium urgency
    if (score >= 50) return '#10b981'; // Green - Low urgency
    return '#6b7280'; // Gray - Very low
  };

  const getUrgencyLabel = (score: number): string => {
    if (score >= 90) return 'URGENT';
    if (score >= 70) return 'HIGH';
    if (score >= 50) return 'MEDIUM';
    return 'LOW';
  };

  if (loading) {
    return (
      <div style={{
        padding: 20,
        textAlign: 'center',
        backgroundColor: '#f8f9fa',
        borderRadius: 12
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          color: '#6b7280'
        }}>
          <div style={{
            width: 20,
            height: 20,
            border: '2px solid #dee2e6',
            borderTop: '2px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
          Loading priority products...
        </div>
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: 12,
      padding: 20,
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      margin: '20px 0'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
        paddingBottom: 16,
        borderBottom: '1px solid #e5e7eb'
      }}>
        <div>
          <h2 style={{
            margin: '0 0 4px',
            fontSize: 20,
            fontWeight: 600,
            color: '#111827'
          }}>
            🔥 Top 10 Priority Products
          </h2>
          <p style={{
            margin: 0,
            fontSize: 14,
            color: '#6b7280'
          }}>
            Products ranked by urgency score, price proximity to target, and recent drops
          </p>
        </div>
        
        <button
          onClick={fetchPriorityProducts}
          style={{
            padding: '8px 16px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: 8,
            fontSize: 14,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6
          }}
        >
          🔄 Refresh
        </button>
      </div>

      {/* Priority Products List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {priorityProducts.map((product, index) => (
          <div
            key={product.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: 16,
              backgroundColor: index < 3 ? '#fef3c7' : '#f9fafb',
              border: `2px solid ${index < 3 ? '#f59e0b' : '#e5e7eb'}`,
              borderRadius: 12,
              transition: 'all 0.2s ease'
            }}
          >
            {/* Rank */}
            <div style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              backgroundColor: getUrgencyColor(product.urgencyScore),
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 14,
              fontWeight: 'bold',
              marginRight: 16
            }}>
              {index + 1}
            </div>

            {/* Product Image */}
            <div style={{
              width: 60,
              height: 60,
              borderRadius: 8,
              backgroundColor: '#f3f4f6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 16,
              fontSize: 24
            }}>
              {product.category === 'Electronics' ? '📱' :
               product.category === 'Fashion' ? '👕' :
               product.category === 'Sports' ? '⚽' : '🛍️'}
            </div>

            {/* Product Info */}
            <div style={{ flex: 1 }}>
              <h4 style={{
                margin: '0 0 4px',
                fontSize: 16,
                fontWeight: 600,
                color: '#111827'
              }}>
                {product.name.length > 50 ? product.name.substring(0, 50) + '...' : product.name}
              </h4>
              
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                fontSize: 12,
                color: '#6b7280'
              }}>
                <span style={{
                  backgroundColor: '#e5e7eb',
                  padding: '2px 8px',
                  borderRadius: 12
                }}>
                  {product.platform}
                </span>
                <span>📦 {product.category}</span>
                <span>📅 {product.daysTracked}d tracked</span>
              </div>
            </div>

            {/* Price Info */}
            <div style={{
              textAlign: 'right',
              marginRight: 16
            }}>
              <div style={{
                fontSize: 18,
                fontWeight: 'bold',
                color: '#111827'
              }}>
                ₹{product.currentPrice.toLocaleString()}
              </div>
              <div style={{
                fontSize: 12,
                color: '#10b981'
              }}>
                Target: ₹{product.targetPrice.toLocaleString()}
              </div>
              {product.priceDropPercentage > 0 && (
                <div style={{
                  fontSize: 11,
                  color: '#ef4444',
                  fontWeight: 500
                }}>
                  ↓ {product.priceDropPercentage}% drop
                </div>
              )}
            </div>

            {/* Urgency Score */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              minWidth: 80
            }}>
              <div style={{
                fontSize: 20,
                fontWeight: 'bold',
                color: getUrgencyColor(product.urgencyScore)
              }}>
                {product.urgencyScore}
              </div>
              <div style={{
                fontSize: 10,
                color: getUrgencyColor(product.urgencyScore),
                fontWeight: 600,
                backgroundColor: 'white',
                padding: '2px 6px',
                borderRadius: 8,
                border: `1px solid ${getUrgencyColor(product.urgencyScore)}`
              }}>
                {getUrgencyLabel(product.urgencyScore)}
              </div>
            </div>

            {/* Action Button */}
            <button
              style={{
                marginLeft: 12,
                padding: '8px 12px',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: 8,
                fontSize: 12,
                cursor: 'pointer',
                fontWeight: 500
              }}
            >
              View Details
            </button>
          </div>
        ))}
      </div>

      {/* Urgency Legend */}
      <div style={{
        marginTop: 20,
        padding: 16,
        backgroundColor: '#f9fafb',
        borderRadius: 8,
        border: '1px solid #e5e7eb'
      }}>
        <h4 style={{
          margin: '0 0 8px',
          fontSize: 14,
          fontWeight: 600,
          color: '#111827'
        }}>
          Urgency Score Calculation:
        </h4>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 8,
          fontSize: 12,
          color: '#6b7280'
        }}>
          <div>📊 40% - Price proximity to target</div>
          <div>📉 30% - Recent price drops</div>
          <div>⏰ 20% - Days tracked</div>
          <div>🏪 10% - Platform priority</div>
        </div>
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

export default PriorityTracker;

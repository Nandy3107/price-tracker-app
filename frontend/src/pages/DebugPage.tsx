import React, { useState, useEffect } from 'react';
import axios from '../services/api';
import { getCurrentUserId } from '../utils/auth';

const DebugPage: React.FC = () => {
  const [results, setResults] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [wishlistData, setWishlistData] = useState<any[]>([]);
  const [testUrl, setTestUrl] = useState('https://amazon.in/dp/B08N5WRWNW');

  useEffect(() => {
    // Fetch initial data
    const userId = getCurrentUserId();
    testEndpoint('Get Wishlist', `/wishlist?userId=${userId}`);
    testEndpoint('Debug Storage', '/debug/storage');
  }, []);

  useEffect(() => {
    // Update wishlist data when results change
    if (results['Get Wishlist']?.success) {
      setWishlistData(results['Get Wishlist'].data || []);
    }
  }, [results]);

  const testEndpoint = async (name: string, url: string, method = 'GET', data?: any) => {
    setLoading((prev: Record<string, boolean>) => ({ ...prev, [name]: true }));
    try {
      const response = method === 'POST' 
        ? await axios.post(url, data)
        : await axios.get(url);
      setResults((prev: Record<string, any>) => ({ 
        ...prev, 
        [name]: { 
          success: true, 
          data: response.data,
          status: response.status 
        } 
      }));
    } catch (error: any) {
      setResults((prev: Record<string, any>) => ({ 
        ...prev, 
        [name]: { 
          success: false, 
          error: error.message,
          status: error.response?.status,
          data: error.response?.data 
        } 
      }));
    }
    setLoading((prev: Record<string, boolean>) => ({ ...prev, [name]: false }));
  };

  const tests = [
    { name: 'Get Wishlist', url: `/wishlist?userId=${getCurrentUserId()}`, method: 'GET' },
    { name: 'Debug Storage', url: '/debug/storage', method: 'GET' },
  ];

  const testCustomImport = () => {
    testEndpoint('Import Custom Product', '/import/url', 'POST', { 
      url: testUrl, 
      target_price: 15000 
    });
  };

  const testPriceHistory = (productId: string, productName: string) => {
    const userId = getCurrentUserId();
    testEndpoint(`Price History (${productName})`, `/price-history/${productId}?userId=${userId}`);
  };

  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }}>
      <h2>🔍 API Debug Dashboard</h2>
      
      {/* Custom Import Test */}
      <div style={{ marginBottom: 30, padding: 15, border: '1px solid #ddd', borderRadius: 8 }}>
        <h3>🧪 Test Product Import</h3>
        <div style={{ marginBottom: 10 }}>
          <input
            type="text"
            value={testUrl}
            onChange={(e) => setTestUrl(e.target.value)}
            placeholder="Enter product URL"
            style={{ width: 400, padding: 8, marginRight: 10 }}
          />
          <button
            onClick={testCustomImport}
            disabled={loading['Import Custom Product']}
            style={{ padding: '8px 16px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: 4 }}
          >
            {loading['Import Custom Product'] ? 'Testing...' : 'Test Import'}
          </button>
        </div>
        <small>Try: https://amazon.in/dp/B08N5WRWNW</small>
      </div>

      {/* Wishlist Display */}
      <div style={{ marginBottom: 30, padding: 15, border: '1px solid #ddd', borderRadius: 8 }}>
        <h3>📋 Current Wishlist ({wishlistData.length} items)</h3>
        {wishlistData.map((item) => (
          <div key={item.id} style={{ 
            marginBottom: 15, 
            padding: 10, 
            backgroundColor: '#f8f9fa', 
            borderRadius: 4,
            border: '1px solid #e9ecef'
          }}>
            <h4 style={{ margin: '0 0 8px 0', color: '#333' }}>{item.product.name}</h4>
            <p style={{ margin: '4px 0', fontSize: 14 }}>
              <strong>Price:</strong> ₹{item.product.current_price} | 
              <strong> Platform:</strong> {item.product.platform} | 
              <strong> History:</strong> {item.price_history.length} entries
            </p>
            <button
              onClick={() => testPriceHistory(item.product.id, item.product.name)}
              disabled={loading[`Price History (${item.product.name})`]}
              style={{ 
                padding: '4px 8px', 
                backgroundColor: '#28a745', 
                color: 'white', 
                border: 'none', 
                borderRadius: 4,
                fontSize: 12
              }}
            >
              {loading[`Price History (${item.product.name})`] ? 'Loading...' : 'Test Price History'}
            </button>
          </div>
        ))}
        {wishlistData.length === 0 && (
          <p style={{ color: '#666', fontStyle: 'italic' }}>No items in wishlist. Import a product to see data!</p>
        )}
      </div>

      {/* API Tests */}
      <div style={{ marginBottom: 30 }}>
        <h3>🔗 API Endpoint Tests</h3>
        <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
          {tests.map((test) => (
            <button
              key={test.name}
              onClick={() => testEndpoint(test.name, test.url, test.method as any)}
              disabled={loading[test.name]}
              style={{
                padding: '8px 12px',
                backgroundColor: loading[test.name] ? '#6c757d' : '#17a2b8',
                color: 'white',
                border: 'none',
                borderRadius: 4,
                cursor: loading[test.name] ? 'not-allowed' : 'pointer'
              }}
            >
              {loading[test.name] ? 'Loading...' : test.name}
            </button>
          ))}
        </div>
      </div>

      {/* Results Display */}
      <div>
        <h3>📊 Test Results</h3>
        {Object.keys(results).length === 0 ? (
          <p>Click a test button above to see results.</p>
        ) : (
          Object.entries(results).map(([name, result]: [string, any]) => (
            <div 
              key={name} 
              style={{ 
                marginBottom: 16,
                padding: 16,
                border: `1px solid ${result.success ? '#28a745' : '#dc3545'}`,
                borderRadius: 8,
                backgroundColor: result.success ? '#f8fff8' : '#fff8f8'
              }}
            >
              <h4 style={{ margin: '0 0 8px 0', color: result.success ? '#28a745' : '#dc3545' }}>
                {name} - {result.success ? 'SUCCESS' : 'FAILED'} (Status: {result.status})
              </h4>
              <pre style={{ 
                backgroundColor: '#f8f9fa',
                padding: 12,
                borderRadius: 4,
                overflow: 'auto',
                fontSize: 12,
                margin: 0
              }}>
                {JSON.stringify(result.success ? result.data : result, null, 2)}
              </pre>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DebugPage;

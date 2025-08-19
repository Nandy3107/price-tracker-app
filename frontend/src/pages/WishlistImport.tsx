import React, { useState } from 'react';
import axios from '../services/api';

const WishlistImport: React.FC = () => {
  const [importUrl, setImportUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleImport = async () => {
    if (!importUrl.trim()) {
      setMessage('Please enter a valid URL');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
      
      // Use the new import endpoint
      const response = await axios.post('/import/url', {
        url: importUrl,
        target_price: null // Let backend calculate default target price
      });

      if (response.data.success) {
        setMessage(`✅ ${response.data.message} - "${response.data.product.product.name}" from ${response.data.product.product.platform}`);
        setImportUrl('');
      } else {
        setMessage('❌ Failed to import product');
      }
    } catch (error: any) {
      console.error('Import error:', error);
      const errorMessage = error.response?.data?.error || error.response?.data?.details || 'Failed to import product';
      setMessage(`❌ ${errorMessage}`);
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: 24, maxWidth: 600, margin: '0 auto' }}>
      <h2>Import Wishlist Items</h2>
      <p>Paste the URL of a product from any eCommerce site to add it to your wishlist:</p>
      
      <div style={{ marginBottom: 16 }}>
        <input
          type="url"
          value={importUrl}
          onChange={(e) => setImportUrl(e.target.value)}
          placeholder="https://www.amazon.in/product-url or https://www.flipkart.com/product-url"
          style={{
            width: '100%',
            padding: 12,
            border: '1px solid #ddd',
            borderRadius: 4,
            fontSize: 14
          }}
        />
      </div>
      
      <button
        onClick={handleImport}
        disabled={loading}
        style={{
          padding: '12px 24px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: 4,
          cursor: loading ? 'not-allowed' : 'pointer',
          fontSize: 14
        }}
      >
        {loading ? 'Importing...' : 'Import Product'}
      </button>
      
      {message && (
        <div style={{
          marginTop: 16,
          padding: 12,
          backgroundColor: message.includes('success') ? '#d4edda' : '#f8d7da',
          color: message.includes('success') ? '#155724' : '#721c24',
          borderRadius: 4
        }}>
          {message}
        </div>
      )}
      
      <div style={{ marginTop: 24 }}>
        <h3>Supported Sites:</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 12 }}>
          <span style={{ padding: '4px 12px', backgroundColor: '#FF9900', color: 'white', borderRadius: 16, fontSize: 12 }}>
            Amazon India
          </span>
          <span style={{ padding: '4px 12px', backgroundColor: '#2874F0', color: 'white', borderRadius: 16, fontSize: 12 }}>
            Flipkart
          </span>
          <span style={{ padding: '4px 12px', backgroundColor: '#FF3E6C', color: 'white', borderRadius: 16, fontSize: 12 }}>
            Myntra
          </span>
          <span style={{ padding: '4px 12px', backgroundColor: '#B44C43', color: 'white', borderRadius: 16, fontSize: 12 }}>
            Ajio
          </span>
          <span style={{ padding: '4px 12px', backgroundColor: '#FC2779', color: 'white', borderRadius: 16, fontSize: 12 }}>
            Nykaa
          </span>
          <span style={{ padding: '4px 12px', backgroundColor: '#9C1AB1', color: 'white', borderRadius: 16, fontSize: 12 }}>
            Meesho
          </span>
        </div>
        
        <div style={{ marginTop: 16, padding: 12, backgroundColor: '#e3f2fd', borderRadius: 4, fontSize: 14 }}>
          <strong>💡 How it works:</strong>
          <ol style={{ margin: '8px 0', paddingLeft: 20 }}>
            <li>Copy product URL from any supported ecommerce site</li>
            <li>Paste it in the input field above</li>
            <li>Click "Import Product" to add it to your tracker</li>
            <li>Set price alerts and get notified when prices drop!</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default WishlistImport;

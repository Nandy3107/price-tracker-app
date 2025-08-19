import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Store {
  id: string;
  name: string;
  logo: string;
  rating: number;
  category: string;
  description: string;
  features: string[];
  baseUrl: string;
  searchUrl: string;
  isSupported: boolean;
}

interface StoreData {
  stores: Store[];
  totalStores: number;
  categories: string[];
}

const StoreCatalog: React.FC = () => {
  const [storeData, setStoreData] = useState<StoreData | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All Stores');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  const fetchStores = async () => {
    try {
      const response = await axios.get('/stores');
      setStoreData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch stores:', error);
      setLoading(false);
    }
  };

  const fetchStoresByCategory = async (category: string) => {
    if (category === 'All Stores') {
      fetchStores();
      return;
    }
    
    try {
      const response = await axios.get(`/stores/category/${encodeURIComponent(category)}`);
      setStoreData({
        stores: response.data.stores,
        totalStores: response.data.totalStores,
        categories: storeData?.categories || []
      });
    } catch (error) {
      console.error('Failed to fetch stores by category:', error);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  useEffect(() => {
    fetchStoresByCategory(selectedCategory);
  }, [selectedCategory]);

  const filteredStores = storeData?.stores.filter(store =>
    store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    store.description.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const categoryIcons: { [key: string]: string } = {
    'All Stores': '🏪',
    'E-commerce': '🛒',
    'LifeStyle': '👗',
    'Groceries': '🥬',
    'Food & Drink': '🍕',
    'Travel': '✈️',
    'Entertainment': '🎬',
    'Health & Pharmacy': '💊',
    'Electronics': '📱',
    'Baby & Kids': '🧸',
    'Gifts & Flowers': '💐',
    'Services': '🛠️'
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '400px',
        fontSize: 18 
      }}>
        <div>📊 Loading store catalog...</div>
      </div>
    );
  }

  return (
    <div style={{ padding: 20, maxWidth: 1200, margin: '0 auto' }}>
      {/* Important E-commerce Stores */}
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 22, color: '#1976d2', marginBottom: 12, textAlign: 'center' }}>Major E-commerce Platforms</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 18, justifyContent: 'center' }}>
          {[
            { name: 'Amazon', url: 'https://www.amazon.in', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg', badge: 'Best Seller', icon: '🛒' },
            { name: 'Flipkart', url: 'https://www.flipkart.com', logo: 'https://upload.wikimedia.org/wikipedia/commons/0/0c/Flipkart_logo.png', badge: 'Popular', icon: '📦' },
            { name: 'Myntra', url: 'https://www.myntra.com', logo: 'https://upload.wikimedia.org/wikipedia/commons/6/6a/Myntra_logo.png', badge: 'Fashion', icon: '👗' },
            { name: 'Reliance Digital', url: 'https://www.reliancedigital.in', logo: 'https://www.reliancedigital.in/medias/RD-Logo.png', badge: 'Electronics', icon: '📱' },
            { name: 'Tata CLiQ', url: 'https://www.tatacliq.com', logo: 'https://www.tatacliq.com/src/general/components/img/TataCLiQLogo.svg', badge: 'New', icon: '🆕' },
            { name: 'Ajio', url: 'https://www.ajio.com', logo: 'https://assets.ajio.com/static/img/Ajio-Logo.svg', badge: 'Fashion', icon: '🧥' },
            { name: 'Nykaa', url: 'https://www.nykaa.com', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2c/Nykaa_logo.png', badge: 'Beauty', icon: '💄' },
            { name: 'BigBasket', url: 'https://www.bigbasket.com', logo: 'https://www.bigbasket.com/static/img/bb-logo.png', badge: 'Groceries', icon: '🥦' },
            { name: 'Croma', url: 'https://www.croma.com', logo: 'https://www.croma.com/assets/images/croma_logo.png', badge: 'Electronics', icon: '💻' },
            { name: 'Snapdeal', url: 'https://www.snapdeal.com', logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7e/Snapdeal_logo.png', badge: 'Deals', icon: '🎁' },
            { name: 'JioMart', url: 'https://www.jiomart.com', logo: 'https://www.jiomart.com/assets/ds2web/images/jiomart_logo.svg', badge: 'Groceries', icon: '🛍️' },
            { name: 'Pepperfry', url: 'https://www.pepperfry.com', logo: 'https://www.pepperfry.com/images/pf-logo.png', badge: 'Furniture', icon: '🪑' },
            { name: 'FirstCry', url: 'https://www.firstcry.com', logo: 'https://cdn.fcglcdn.com/brainbees/images/firstcry-logo.png', badge: 'Kids', icon: '🧸' },
            { name: 'PharmEasy', url: 'https://www.pharmeasy.in', logo: 'https://assets.pharmeasy.in/apothecary/images/logo_big.png', badge: 'Pharmacy', icon: '💊' },
            { name: 'Urban Ladder', url: 'https://www.urbanladder.com', logo: 'https://www.urbanladder.com/images/urbanladder-logo.svg', badge: 'Furniture', icon: '🛋️' },
            { name: 'Lenskart', url: 'https://www.lenskart.com', logo: 'https://static.lenskart.com/media/desktop/img/site-images/main_logo.svg', badge: 'Eyewear', icon: '👓' },
            { name: 'Zivame', url: 'https://www.zivame.com', logo: 'https://www.zivame.com/static/img/zivame-logo.svg', badge: 'Lingerie', icon: '👙' },
            { name: 'BookMyShow', url: 'https://in.bookmyshow.com', logo: 'https://in.bmscdn.com/webin/common/icons/bms-logo.svg', badge: 'Entertainment', icon: '🎬' },
            { name: 'Swiggy', url: 'https://www.swiggy.com', logo: 'https://cdn.worldvectorlogo.com/logos/swiggy-1.svg', badge: 'Food', icon: '🍔' },
          ].map(store => (
            <a key={store.name} href={store.url} target="_blank" rel="noopener noreferrer" style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', width: 110, textDecoration: 'none', color: '#333', background: '#f8f9fa', borderRadius: 10, padding: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.07)', transition: 'box-shadow 0.2s', border: '1px solid #e9ecef', position: 'relative'
            }}>
              <img src={store.logo} alt={store.name} style={{ width: 48, height: 48, objectFit: 'contain', marginBottom: 8, borderRadius: 6, background: '#fff' }} />
              <span style={{ fontWeight: 600, fontSize: 15, textAlign: 'center', marginBottom: 2 }}>{store.icon} {store.name}</span>
              <span style={{ fontSize: 11, color: '#fff', background: '#1976d2', borderRadius: 8, padding: '2px 8px', position: 'absolute', top: 8, right: 8, fontWeight: 500 }}>{store.badge}</span>
            </a>
          ))}
        </div>
      </div>
      {/* Header */}
      <div style={{ marginBottom: 30, textAlign: 'center' }}>
        <h1 style={{ 
          margin: 0, 
          fontSize: 28, 
          color: '#333',
          marginBottom: 8
        }}>
          🏪 Store Catalog
        </h1>
        <p style={{ 
          color: '#666', 
          fontSize: 16,
          margin: 0
        }}>
          Track prices across {storeData?.totalStores || 0}+ major Indian e-commerce platforms
        </p>
      </div>

      {/* Search Bar */}
      <div style={{ marginBottom: 20 }}>
        <input
          type="text"
          placeholder="🔍 Search stores by name or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '12px 16px',
            fontSize: 16,
            border: '2px solid #e9ecef',
            borderRadius: 8,
            outline: 'none',
            transition: 'border-color 0.3s ease'
          }}
          onFocus={(e) => e.currentTarget.style.borderColor = '#007bff'}
          onBlur={(e) => e.currentTarget.style.borderColor = '#e9ecef'}
        />
      </div>

      {/* Category Tabs */}
      <div style={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: 8, 
        marginBottom: 25,
        paddingBottom: 15,
        borderBottom: '1px solid #f0f0f0'
      }}>
        {['All Stores', ...(storeData?.categories || [])].map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            style={{
              padding: '8px 16px',
              fontSize: 13,
              border: selectedCategory === category ? '2px solid #007bff' : '1px solid #dee2e6',
              borderRadius: 20,
              backgroundColor: selectedCategory === category ? '#e3f2fd' : 'white',
              color: selectedCategory === category ? '#007bff' : '#333',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap'
            }}
            onMouseOver={(e) => {
              if (selectedCategory !== category) {
                e.currentTarget.style.backgroundColor = '#f8f9fa';
              }
            }}
            onMouseOut={(e) => {
              if (selectedCategory !== category) {
                e.currentTarget.style.backgroundColor = 'white';
              }
            }}
          >
            {categoryIcons[category]} {category}
          </button>
        ))}
      </div>

      {/* Results Count */}
      <div style={{ 
        marginBottom: 20, 
        color: '#666', 
        fontSize: 14,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <span>
          Showing {filteredStores.length} stores 
          {selectedCategory !== 'All Stores' && ` in ${selectedCategory}`}
          {searchTerm && ` matching \"${searchTerm}\"`}
        </span>
        <span style={{ fontSize: 12 }}>
          💡 Click any store to visit their website
        </span>
      </div>

      {/* Store Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
        gap: 16 
      }}>
        {filteredStores.map(store => (
          <div
            key={store.id}
            onClick={() => window.open(store.baseUrl, '_blank')}
            style={{
              backgroundColor: 'white',
              border: '1px solid #e9ecef',
              borderRadius: 8,
              padding: 16,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
              e.currentTarget.style.borderColor = '#007bff';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
              e.currentTarget.style.borderColor = '#e9ecef';
            }}
          >
            {/* Store Header */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              marginBottom: 12,
              gap: 12
            }}>
              <div style={{
                width: 48,
                height: 48,
                borderRadius: 8,
                backgroundColor: '#f8f9fa',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 20,
                fontWeight: 'bold',
                color: '#007bff',
                border: '1px solid #e9ecef'
              }}>
                {store.name.charAt(0).toUpperCase()}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h3 style={{ 
                  margin: 0, 
                  fontSize: 16, 
                  fontWeight: 600,
                  color: '#333',
                  marginBottom: 2
                }}>
                  {store.name}
                </h3>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 8 
                }}>
                  <span style={{ 
                    fontSize: 12, 
                    color: '#666',
                    padding: '2px 6px',
                    backgroundColor: '#f8f9fa',
                    borderRadius: 12
                  }}>
                    {store.category}
                  </span>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 2 
                  }}>
                    <span style={{ color: '#ffc107', fontSize: 12 }}>⭐</span>
                    <span style={{ fontSize: 12, color: '#666' }}>
                      {store.rating}/5
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Store Description */}
            <p style={{ 
              margin: '0 0 12px 0', 
              fontSize: 14, 
              color: '#666',
              lineHeight: 1.4
            }}>
              {store.description}
            </p>

            {/* Store Features */}
            <div style={{ marginBottom: 12 }}>
              <div style={{ 
                fontSize: 12, 
                fontWeight: 600, 
                color: '#333', 
                marginBottom: 6 
              }}>
                Key Features:
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {store.features.slice(0, 3).map((feature, index) => (
                  <span
                    key={index}
                    style={{
                      fontSize: 11,
                      padding: '2px 6px',
                      backgroundColor: '#e3f2fd',
                      color: '#1976d2',
                      borderRadius: 10,
                      border: '1px solid #bbdefb'
                    }}
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>

            {/* Store Status */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              paddingTop: 8,
              borderTop: '1px solid #f0f0f0'
            }}>
              <span style={{ 
                fontSize: 12, 
                color: store.isSupported ? '#28a745' : '#dc3545',
                fontWeight: 500
              }}>
                {store.isSupported ? '✅ Price Tracking Supported' : '⏳ Coming Soon'}
              </span>
              <span style={{ 
                fontSize: 11, 
                color: '#007bff',
                fontWeight: 500
              }}>
                Visit Store →
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* No Results */}
      {filteredStores.length === 0 && (
        <div style={{ 
          textAlign: 'center', 
          padding: 60,
          color: '#666'
        }}>
          <h3>No stores found</h3>
          <p>Try adjusting your search or category filter</p>
        </div>
      )}

      {/* Footer Stats */}
      <div style={{ 
        marginTop: 40,
        padding: 20,
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        textAlign: 'center'
      }}>
        <h4 style={{ margin: '0 0 8px 0', color: '#333' }}>
          📊 Platform Coverage
        </h4>
        <p style={{ margin: 0, color: '#666', fontSize: 14 }}>
          Track prices across {storeData?.totalStores || 0} stores in {storeData?.categories.length || 0} categories
          <br />
          <span style={{ fontSize: 12 }}>
            More stores added regularly • BuyHatke-style comprehensive coverage
          </span>
        </p>
      </div>
    </div>
  );
};

export default StoreCatalog;

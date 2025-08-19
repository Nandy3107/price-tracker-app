import React, { useState, useEffect } from 'react';
import { useWishlist } from '../context/WishlistContext';

const StoreIntegration: React.FC = () => {
  // Supported domains and logos for import
  const supportedDomains = [
    { id: 'amazon', name: 'Amazon', domain: 'amazon.in', url: 'https://www.amazon.in', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg' },
    { id: 'flipkart', name: 'Flipkart', domain: 'flipkart.com', url: 'https://www.flipkart.com', logo: 'https://upload.wikimedia.org/wikipedia/commons/1/13/Flipkart_logo.png' },
    { id: 'myntra', name: 'Myntra', domain: 'myntra.com', url: 'https://www.myntra.com', logo: 'https://upload.wikimedia.org/wikipedia/commons/0/0a/Myntra_Logo.png' },
    { id: 'ajio', name: 'Ajio', domain: 'ajio.com', url: 'https://www.ajio.com', logo: 'https://upload.wikimedia.org/wikipedia/commons/6/6e/Ajio-Logo.png' },
    { id: 'nykaa', name: 'Nykaa', domain: 'nykaa.com', url: 'https://www.nykaa.com', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/24/Nykaa_Logo.png' },
    { id: 'meesho', name: 'Meesho', domain: 'meesho.com', url: 'https://www.meesho.com', logo: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/Meesho_Logo.png' },
    { id: 'snapdeal', name: 'Snapdeal', domain: 'snapdeal.com', url: 'https://www.snapdeal.com', logo: 'https://upload.wikimedia.org/wikipedia/commons/0/0b/Snapdeal_logo.png' },
    { id: 'paytm', name: 'Paytm Mall', domain: 'paytmmall.com', url: 'https://www.paytmmall.com', logo: 'https://upload.wikimedia.org/wikipedia/commons/5/55/Paytm_logo.png' },
    { id: 'bigbasket', name: 'BigBasket', domain: 'bigbasket.com', url: 'https://www.bigbasket.com', logo: 'https://upload.wikimedia.org/wikipedia/commons/1/1a/BigBasket_Logo.png' },
    { id: 'jiomart', name: 'JioMart', domain: 'jiomart.com', url: 'https://www.jiomart.com', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2e/JioMart_logo.png' },
  ];
  const availableStores = [
    { id: 'uber', name: 'Uber', logo: '⚫', category: 'Transportation' },
    { id: 'rapido', name: 'Rapido', logo: '🟡', category: 'Transportation' },
    { id: 'netmeds', name: 'Netmeds', logo: '💊', category: 'Health' },
    { id: 'healthkart', name: 'Healthkart', logo: '💪', category: 'Health' },
    { id: 'apollo-pharmacy', name: 'Apollo Pharmacy', logo: '🏥', category: 'Health' },
    { id: '1mg', name: '1mg', logo: '💉', category: 'Health' },
    { id: 'firstcry', name: 'firstcry.com', logo: '👶', category: 'Kids' },
    { id: 'supertails', name: 'supertails', logo: '🐕', category: 'Pets' },
    { id: 'igp', name: 'IGP.com', logo: '🎁', category: 'Gifts' },
    { id: 'fnp', name: 'fnp.com', logo: '💐', category: 'Gifts' },
    { id: 'urban-company', name: 'Urban Company', logo: '🔧', category: 'Services' },
    { id: 'paytm', name: 'Paytm', logo: '💳', category: 'Finance' },
    { id: 'google-pay', name: 'Payments Google', logo: '💰', category: 'Finance' },
    { id: 'netflix', name: 'Netflix', logo: '📺', category: 'Entertainment' },
    { id: 'chatgpt-plus', name: 'ChatGPT Plus', logo: '🤖', category: 'AI' },
    { id: 'chatgpt-dev', name: 'ChatGPT Dev', logo: '👨‍💻', category: 'AI' }
  ];

  const [stores, setStores] = useState<any[]>([]);
  const [syncingStore, setSyncingStore] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const categories = ['All', ...Array.from(new Set(availableStores.map(store => store.category)))];
  const filteredStores = stores.filter(store => selectedCategory === 'All' || store.category === selectedCategory);

  useEffect(() => {
    // Initialize stores with demo data
    const initialStores = availableStores.map(store => ({
      ...store,
      connected: Math.random() > 0.8, // Randomly connect some stores for demo
      wishlistCount: Math.floor(Math.random() * 50),
      lastSync: Math.random() > 0.5 ? new Date(Date.now() - Math.random() * 86400000).toISOString() : null
    }));
    setStores(initialStores);
  }, []);

  const handleConnectStore = async (storeId: string) => {
    setSyncingStore(storeId);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setStores(prevStores =>
      prevStores.map(store =>
        store.id === storeId
          ? {
              ...store,
              connected: !store.connected,
              lastSync: store.connected ? null : new Date().toISOString(),
              wishlistCount: store.connected ? 0 : Math.floor(Math.random() * 30) + 5
            }
          : store
      )
    );
    setSyncingStore(null);
  };

  const handleSyncStore = async (storeId: string) => {
    setSyncingStore(storeId);
    // Simulate sync
    await new Promise(resolve => setTimeout(resolve, 1500));
    setStores(prevStores =>
      prevStores.map(store =>
        store.id === storeId
          ? {
              ...store,
              lastSync: new Date().toISOString(),
              wishlistCount: Math.floor(Math.random() * 40) + 10
            }
          : store
      )
    );
    setSyncingStore(null);
  };

  const connectedStores = stores.filter(store => store.connected);
  const totalWishlistItems = connectedStores.reduce((total, store) => total + store.wishlistCount, 0);
  // Product import states
  const [importUrl, setImportUrl] = useState('');
  const [importStatus, setImportStatus] = useState('');
  const [detectedStore, setDetectedStore] = useState<string | null>(null);
  const [importedProduct, setImportedProduct] = useState<any>(null);
  const { addToWishlist } = useWishlist();

  // Detect store from pasted URL
  // Only import once per valid URL
  const [lastImportedUrl, setLastImportedUrl] = useState('');
  useEffect(() => {
    if (!importUrl) {
      setDetectedStore(null);
      setImportStatus('');
      setImportedProduct(null);
      setLastImportedUrl('');
      return;
    }
    const found = supportedDomains.find(store => importUrl.includes(store.domain));
    setDetectedStore(found ? found.name : null);
    setImportStatus(found ? `✅ Supported: ${found.name}` : '❌ Unsupported store URL');
    if (found && importUrl !== lastImportedUrl) {
      setLastImportedUrl(importUrl);
      (async () => {
        setImportStatus('⏳ Importing...');
        try {
          const res = await fetch('/api/import-product/import-product-url', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: importUrl })
          });
          const data = await res.json();
          if (data.error) {
            setImportStatus('❌ ' + data.error);
            setImportedProduct(null);
          } else {
            setImportStatus('✅ ' + data.message);
            setImportedProduct(data);
            addToWishlist({
              store: data.store,
              title: data.title,
              price: data.price,
              url: data.url,
              image: data.image,
              message: data.message
            });
          }
        } catch (err) {
          setImportStatus('❌ Error importing product');
          setImportedProduct(null);
        }
      })();
    } else if (!found) {
      setImportedProduct(null);
      setLastImportedUrl('');
    }
  }, [importUrl, lastImportedUrl]);

  const handleImportProduct = async () => {
    setImportStatus('⏳ Importing...');
    try {
      const res = await fetch('/api/import-product/import-product-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: importUrl })
      });
      const data = await res.json();
      if (data.error) {
        setImportStatus('❌ ' + data.error);
        setImportedProduct(null);
      } else {
        setImportStatus('✅ ' + data.message);
        setImportedProduct(data);
        addToWishlist({
          store: data.store,
          title: data.title,
          price: data.price,
          url: data.url,
          image: data.image,
          message: data.message
        });
      }
    } catch (err) {
      setImportStatus('❌ Error importing product');
      setImportedProduct(null);
    }
  };
  
  return (
    <>
      {/* Supported Sites List */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 16, alignItems: 'center' }}>
        <span style={{ fontWeight: 500, color: '#374151', fontSize: 15 }}>Supported sites:</span>
        {supportedDomains.map(site => (
          <a
            key={site.id}
            href={site.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none', background: '#fff', borderRadius: 8, border: '1px solid #e5e7eb', padding: '4px 10px', transition: 'box-shadow 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}
          >
            <img src={site.logo} alt={site.name} style={{ width: 24, height: 24, objectFit: 'contain', borderRadius: 4, background: '#fff' }} />
            <span style={{ color: '#222', fontSize: 14 }}>{site.name}</span>
          </a>
        ))}
      </div>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: 20, backgroundColor: '#f8f9fa' }}>
      {/* Import URL Section */}
      <div style={{ backgroundColor: 'white', borderRadius: 12, padding: 24, marginBottom: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
        <h2 style={{ margin: '0 0 12px', fontSize: 20, fontWeight: 600, color: '#3b82f6' }}>Import Product from Store URL</h2>
        <input
          type="text"
          value={importUrl}
          onChange={e => setImportUrl(e.target.value)}
          placeholder="Paste product link from Amazon, Flipkart, etc."
          style={{ width: '100%', padding: '12px 16px', fontSize: 16, border: '2px solid #e5e7eb', borderRadius: 8, marginBottom: 10 }}
        />
        {importUrl && (
          <div style={{ marginBottom: 10, fontSize: 14, color: detectedStore ? '#10b981' : '#ef4444' }}>
            {importStatus}
          </div>
        )}
        {detectedStore && (
          <button
            style={{ padding: '10px 20px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: 8, fontWeight: 500, fontSize: 15, cursor: 'pointer' }}
            onClick={handleImportProduct}
          >
            Import from {detectedStore}
          </button>
        )}
        {importedProduct && (
          <div style={{ marginTop: 16, background: '#f0fdf4', borderRadius: 8, padding: 16 }}>
            <h4 style={{ margin: '0 0 8px', color: '#166534' }}>Imported Product</h4>
            <div><b>Store:</b> {importedProduct.store}</div>
            <div><b>Title:</b> {importedProduct.title}</div>
            <div><b>Price:</b> {importedProduct.price}</div>
            <div><b>URL:</b> <a href={importedProduct.url} target="_blank" rel="noopener noreferrer">{importedProduct.url}</a></div>
            {importedProduct.image && (
              <div style={{ margin: '12px 0' }}>
                <img src={importedProduct.image} alt={importedProduct.title} style={{ maxWidth: 180, borderRadius: 8 }} />
              </div>
            )}
            <div style={{ marginTop: 8, color: '#6b7280' }}>{importedProduct.message}</div>
            <div style={{ marginTop: 16 }}>
              <input
                type="text"
                placeholder="Enter WhatsApp number (with country code)"
                style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid #e5e7eb', marginRight: 8 }}
                value={importedProduct.whatsappNumber || ''}
                onChange={e => setImportedProduct({ ...importedProduct, whatsappNumber: e.target.value })}
              />
              <button
                style={{ padding: '8px 16px', backgroundColor: '#25d366', color: 'white', border: 'none', borderRadius: 6, fontWeight: 500, fontSize: 15, cursor: 'pointer' }}
                onClick={async () => {
                  if (!importedProduct.whatsappNumber) return setImportStatus('❌ Enter WhatsApp number');
                  setImportStatus('⏳ Sending WhatsApp message...');
                  try {
                    const res = await fetch('/api/send-whatsapp', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        to: importedProduct.whatsappNumber,
                        message: `Price alert for ${importedProduct.title} at ${importedProduct.price}`,
                        productInfo: {
                          name: importedProduct.title,
                          currentPrice: importedProduct.price,
                          platform: importedProduct.store,
                          url: importedProduct.url,
                          image: importedProduct.image
                        }
                      })
                    });
                    const data = await res.json();
                    setImportStatus(data.success ? '✅ WhatsApp message sent!' : '❌ Failed to send WhatsApp message');
                  } catch (err) {
                    setImportStatus('❌ Error sending WhatsApp message');
                  }
                }}
              >
                Send WhatsApp Notification
              </button>
            </div>
          </div>
        )}
        {/* Supported for import section - always visible under import controls */}
        <div style={{ marginTop: 24 }}>
          <span style={{ fontWeight: 500, color: '#374151', fontSize: 15 }}>Supported for import:</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginTop: 8, alignItems: 'center' }}>
            {supportedDomains
              .filter(site => ['amazon', 'flipkart', 'meesho', 'myntra', 'ajio', 'nykaa'].includes(site.id))
              .map(site => (
                <a
                  key={site.id}
                  href={site.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none', background: '#fff', borderRadius: 8, border: '1px solid #e5e7eb', padding: '4px 10px', transition: 'box-shadow 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}
                >
                  <img src={site.logo} alt={site.name} style={{ width: 24, height: 24, objectFit: 'contain', borderRadius: 4, background: '#fff' }} />
                  <span style={{ color: '#222', fontSize: 14 }}>{site.name}</span>
                </a>
              ))}
          </div>
        </div>
      </div>
      <div style={{
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 20,
        marginBottom: 20,
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
      }}>
        <h3 style={{ margin: '0 0 12px', fontSize: 16, fontWeight: 600 }}>Filter by Category</h3>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 8
        }}>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              style={{
                padding: '8px 16px',
                borderRadius: 20,
                border: selectedCategory === category ? '2px solid #3b82f6' : '1px solid #d1d5db',
                backgroundColor: selectedCategory === category ? '#eff6ff' : 'white',
                color: selectedCategory === category ? '#1d4ed8' : '#374151',
                fontSize: 14,
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Store Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: 16
      }}>
        {filteredStores.map(store => (
          <div
            key={store.id}
            style={{
              backgroundColor: 'white',
              borderRadius: 12,
              padding: 20,
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              border: store.connected ? '2px solid #10b981' : '1px solid #e5e7eb',
              transition: 'all 0.2s ease'
            }}
          >
            {/* Store Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: 12
            }}>
              <div style={{
                fontSize: 24,
                marginRight: 12,
                width: 40,
                height: 40,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#f3f4f6',
                borderRadius: 8
              }}>
                {store.logo}
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{
                  margin: '0 0 4px',
                  fontSize: 16,
                  fontWeight: 600,
                  color: '#111827'
                }}>
                  {store.name}
                </h4>
                <span style={{
                  fontSize: 12,
                  color: '#6b7280',
                  backgroundColor: '#f3f4f6',
                  padding: '2px 8px',
                  borderRadius: 12
                }}>
                  {store.category}
                </span>
              </div>
              
              {/* Status Indicator */}
              <div style={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                backgroundColor: store.connected ? '#10b981' : '#d1d5db'
              }} />
            </div>

            {/* Store Info */}
            {store.connected && (
              <div style={{
                backgroundColor: '#f0fdf4',
                border: '1px solid #dcfce7',
                borderRadius: 8,
                padding: 12,
                marginBottom: 12
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 8
                }}>
                  <span style={{ fontSize: 14, fontWeight: 500, color: '#166534' }}>
                    📦 {store.wishlistCount} items
                  </span>
                  {store.lastSync && (
                    <span style={{ fontSize: 12, color: '#6b7280' }}>
                      Last sync: {new Date(store.lastSync).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={() => handleConnectStore(store.id)}
                disabled={syncingStore === store.id}
                style={{
                  flex: 1,
                  padding: '10px 16px',
                  backgroundColor: store.connected ? '#ef4444' : '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: syncingStore === store.id ? 'not-allowed' : 'pointer',
                  opacity: syncingStore === store.id ? 0.6 : 1,
                  transition: 'all 0.2s ease'
                }}
              >
                {syncingStore === store.id ? '⏳ Processing...' : 
                 store.connected ? '🔌 Disconnect' : '🔗 Connect'}
              </button>
              
              {store.connected && (
                <button
                  onClick={() => handleSyncStore(store.id)}
                  disabled={syncingStore === store.id}
                  style={{
                    padding: '10px 12px',
                    backgroundColor: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: 8,
                    fontSize: 14,
                    cursor: syncingStore === store.id ? 'not-allowed' : 'pointer',
                    opacity: syncingStore === store.id ? 0.6 : 1
                  }}
                >
                  🔄
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Help Section */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 24,
        marginTop: 20,
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
      }}>
        <h3 style={{ margin: '0 0 12px', fontSize: 18, fontWeight: 600 }}>
          🤔 How Store Integration Works
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: 16
        }}>
          <div style={{ padding: 16, backgroundColor: '#f8f9fa', borderRadius: 8 }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>🔗</div>
            <h4 style={{ margin: '0 0 8px', fontSize: 14, fontWeight: 600 }}>Connect Your Accounts</h4>
            <p style={{ margin: 0, fontSize: 12, color: '#6b7280' }}>
              Securely link your shopping accounts to sync wishlists automatically
            </p>
          </div>
          
          <div style={{ padding: 16, backgroundColor: '#f8f9fa', borderRadius: 8 }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>📦</div>
            <h4 style={{ margin: '0 0 8px', fontSize: 14, fontWeight: 600 }}>Auto-Sync Products</h4>
            <p style={{ margin: 0, fontSize: 12, color: '#6b7280' }}>
              Your wishlist items are automatically imported and categorized
            </p>
          </div>
          
          <div style={{ padding: 16, backgroundColor: '#f8f9fa', borderRadius: 8 }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>📊</div>
            <h4 style={{ margin: '0 0 8px', fontSize: 14, fontWeight: 600 }}>Track Everything</h4>
            <p style={{ margin: 0, fontSize: 12, color: '#6b7280' }}>
              Monitor prices across all platforms from one central dashboard
            </p>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default StoreIntegration;

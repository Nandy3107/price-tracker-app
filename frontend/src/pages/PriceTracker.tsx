import React, { useEffect, useState } from 'react';
import axios from '../services/api';
import EnhancedPriceChart from './EnhancedPriceChart';
import EnhancedRealPriceChart from '../components/EnhancedRealPriceChart';
import SmartPriceDisplay from '../components/SmartPriceDisplay';
import RealTimePriceMonitor from '../components/RealTimePriceMonitor';
import AIProviderSelector from '../components/AIProviderSelector';
import PaymentGateway from '../components/PaymentGateway';
import StoreIntegration from '../components/StoreIntegration';
import PriorityTracker from '../components/PriorityTracker';
import { FuturisticPriceService } from '../services/FuturisticPriceService';
import { AIProductIntelligence } from '../services/AIProductIntelligence';
import { getCurrentUserId } from '../utils/auth';
import WhatsAppIntegration from './WhatsAppIntegration';

interface Product {
  id: string;
  name: string;
  url: string;
  image_url: string;
  current_price: number;
  platform: string;
  description?: string;
}

interface WishlistItem {
  id: string;
  product: Product;
  target_price?: number;
  added_at: string;
  category?: string;
  price_history: Array<{
    price: number;
    recorded_at: string;
  }>;
}

const PriceTracker: React.FC = () => {
  const [products, setProducts] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All Stores');
  const [priceComparisons, setPriceComparisons] = useState<{[key: string]: any[]}>({});
  const [affiliateLinks, setAffiliateLinks] = useState<{[key: string]: string}>({});
  const [activeView, setActiveView] = useState<'dashboard' | 'stores' | 'priority' | 'whatsapp'>('dashboard');
  const [showPayment, setShowPayment] = useState<{show: boolean, product?: any}>({show: false});
  const [priceIntelligence, setPriceIntelligence] = useState<{[key: string]: any}>({});
  const [aiCorrectedPrices, setAiCorrectedPrices] = useState<{[key: string]: number}>({});

  const categories = [
    'All Stores', 'Groceries', 'Food & Drink', 'E-commerce', 
    'LifeStyle', 'Travel', 'Entertainment', 'Electronics'
  ];

  // Filter products by category
  const filteredProducts = selectedCategory === 'All Stores' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  // Helper function to format prices safely
  const formatPrice = (price: number | string | undefined): string => {
    if (!price) return '₹0';
    const numPrice = Number(price);
    if (isNaN(numPrice)) return '₹0';
    return `₹${numPrice.toLocaleString()}`;
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
      
      const userId = getCurrentUserId();
      const res = await axios.get(`/wishlist?userId=${userId}`);
      console.log('Fetched wishlist data:', res.data);
      
      // Ensure proper data formatting and type conversion
      const formattedProducts = Array.isArray(res.data) ? res.data.map((item: WishlistItem) => ({
        ...item,
        product: {
          ...item.product,
          current_price: Number(item.product.current_price) || 0
        },
        target_price: item.target_price ? Number(item.target_price) : undefined
      })) : [];
      
      setProducts(formattedProducts);
      console.log('Formatted products with proper prices:', formattedProducts);
      
      // Start AI-powered real-time monitoring for each product
      const priceService = FuturisticPriceService.getInstance();
      
      // Fetch price comparisons and affiliate links for each product
      for (const item of formattedProducts) {
        fetchPriceComparison(item.product.id);
        fetchAffiliateLink(item.product.url, item.product.id);
        
        // Start real-time AI monitoring
        priceService.startRealTimeMonitoring(
          item.product.id,
          item.product.name,
          ['Amazon', 'Flipkart', 'Myntra']
        );
        
        // Get AI price intelligence
        setTimeout(async () => {
          try {
            const intelligence = await priceService.getPriceIntelligence(item.product.id);
            setPriceIntelligence(prev => ({
              ...prev,
              [item.product.id]: intelligence
            }));
          } catch (error) {
            console.log('Price intelligence not available yet for', item.product.name);
          }
        }, 2000); // Wait 2 seconds for monitoring to start
      }
    } catch (e) {
      console.error('Failed to fetch wishlist:', e);
      // Load demo data as fallback
      loadDemoData();
    }
    setLoading(false);
  };

  const loadDemoData = () => {
    // Fallback demo data when API is not available
    const demoProducts: WishlistItem[] = [
      {
        id: "demo-1",
        product: {
          id: "demo-prod-1",
          name: "Samsung Galaxy S24 Ultra 5G (256GB)",
          url: "https://www.amazon.in/samsung-galaxy-s24-ultra",
          image_url: "https://via.placeholder.com/300x300/007bff/white?text=Samsung+S24",
          current_price: 124999,
          platform: "Amazon",
          description: "Latest Samsung flagship smartphone with S Pen"
        },
        target_price: 110000,
        added_at: new Date().toISOString(),
        category: "Electronics",
        price_history: [
          { price: 129999, recorded_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString() },
          { price: 127499, recorded_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() },
          { price: 125999, recorded_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
          { price: 124999, recorded_at: new Date().toISOString() }
        ]
      },
      {
        id: "demo-2",
        product: {
          id: "demo-prod-2",
          name: "Apple MacBook Air M3 (8GB, 256GB)",
          url: "https://www.flipkart.com/apple-macbook-air-m3",
          image_url: "https://via.placeholder.com/300x300/666666/white?text=MacBook+Air",
          current_price: 114990,
          platform: "Flipkart",
          description: "Apple MacBook Air with M3 chip, 8GB RAM, 256GB SSD"
        },
        target_price: 109990,
        added_at: new Date().toISOString(),
        category: "Electronics",
        price_history: [
          { price: 119990, recorded_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString() },
          { price: 117490, recorded_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString() },
          { price: 116200, recorded_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() },
          { price: 114990, recorded_at: new Date().toISOString() }
        ]
      },
      {
        id: "demo-3",
        product: {
          id: "demo-prod-3",
          name: "Nike Air Force 1 '07 White Sneakers",
          url: "https://www.myntra.com/nike-air-force-1",
          image_url: "https://via.placeholder.com/300x300/000000/white?text=Nike+AF1",
          current_price: 7495,
          platform: "Myntra",
          description: "Classic Nike Air Force 1 sneakers in white"
        },
        target_price: 6500,
        added_at: new Date().toISOString(),
        category: "LifeStyle",
        price_history: [
          { price: 8495, recorded_at: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString() },
          { price: 7995, recorded_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString() },
          { price: 7495, recorded_at: new Date().toISOString() }
        ]
      }
    ];
    
    setProducts(demoProducts);
    console.log('Loaded demo data with proper prices:', demoProducts);
  };

  const fetchPriceComparison = async (productId: string) => {
    try {
      const userId = getCurrentUserId();
      const res = await axios.get(`/price-comparison/${productId}?userId=${userId}`);
      setPriceComparisons(prev => ({ ...prev, [productId]: res.data.prices }));
    } catch (e) {
      console.error('Failed to fetch price comparison:', e);
    }
  };

  const fetchAffiliateLink = async (originalUrl: string, productId: string) => {
    try {
      const res = await axios.post('/affiliate/convert', { url: originalUrl });
      setAffiliateLinks(prev => ({ ...prev, [productId]: res.data.affiliateUrl }));
    } catch (e) {
      console.error('Failed to fetch affiliate link:', e);
    }
  };

  const removeFromWishlist = async (itemId: string) => {
    try {
      const userId = getCurrentUserId();
      await axios.delete(`/wishlist/${itemId}?userId=${userId}`);
      
      // Remove from local state
      setProducts(prevProducts => prevProducts.filter(item => item.id !== itemId));
      
      alert('Product removed from tracker!');
    } catch (error) {
      console.error('Failed to remove product:', error);
      alert('Failed to remove product. Please try again.');
    }
  };

  const updateTargetPrice = async (itemId: string, newTargetPrice: number) => {
    try {
      const userId = getCurrentUserId();
      await axios.put(`/wishlist/${itemId}`, { 
        target_price: newTargetPrice,
        userId 
      });
      
      // Update local state
      setProducts(prevProducts => 
        prevProducts.map(item => 
          item.id === itemId 
            ? { ...item, target_price: newTargetPrice }
            : item
        )
      );
      
      alert(`Target price updated to ₹${newTargetPrice.toLocaleString()}!`);
    } catch (error) {
      console.error('Failed to update target price:', error);
      alert('Failed to update target price. Please try again.');
    }
  };

  const enableWhatsAppNotifications = async (productId: string) => {
    try {
      await axios.post('/notifications/whatsapp/enable', { productId });
      alert('WhatsApp notifications enabled for this product!');
    } catch (e) {
      alert('Failed to enable WhatsApp notifications');
    }
  };

  return (
    <div style={{ padding: 8, maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ marginBottom: 12 }}>
        <h1 style={{ margin: '0 0 4px 0', color: '#333', fontSize: 20 }}>Price Tracker Dashboard</h1>
        <p style={{ margin: 0, color: '#666', fontSize: 14 }}>
          Monitor price trends and get the best deals on your tracked products
        </p>
      </div>

      {/* Navigation Tabs */}
      <div style={{
        display: 'flex',
        gap: 8,
        marginBottom: 20,
        borderBottom: '2px solid #e5e7eb',
        paddingBottom: 8
      }}>
        <button
          onClick={() => setActiveView('dashboard')}
          style={{
            padding: '10px 20px',
            backgroundColor: activeView === 'dashboard' ? '#3b82f6' : 'transparent',
            color: activeView === 'dashboard' ? 'white' : '#6b7280',
            border: 'none',
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          📊 Dashboard
        </button>
        
        <button
          onClick={() => setActiveView('priority')}
          style={{
            padding: '10px 20px',
            backgroundColor: activeView === 'priority' ? '#3b82f6' : 'transparent',
            color: activeView === 'priority' ? 'white' : '#6b7280',
            border: 'none',
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          🔥 Priority Products
        </button>
        
        <button
          onClick={() => setActiveView('stores')}
          style={{
            padding: '10px 20px',
            backgroundColor: activeView === 'stores' ? '#3b82f6' : 'transparent',
            color: activeView === 'stores' ? 'white' : '#6b7280',
            border: 'none',
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          🔗 Store Integration
        </button>
            
            <button
              onClick={() => setActiveView('whatsapp')}
              style={{
                padding: '10px 20px',
                backgroundColor: activeView === 'whatsapp' ? '#25d366' : 'transparent',
                color: activeView === 'whatsapp' ? 'white' : '#075e54',
                border: 'none',
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              <span style={{ fontSize: 18 }}>🟢</span> WhatsApp Chat
            </button>
      </div>

      {/* Conditional Rendering based on active view */}
      {activeView === 'stores' && <StoreIntegration />}
      {activeView === 'priority' && <PriorityTracker />}
          {activeView === 'whatsapp' && <WhatsAppIntegration />}
      
      {activeView === 'dashboard' && (
        <>
      {/* Category Filter */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              style={{
                padding: '6px 12px',
                border: selectedCategory === category ? '2px solid #007bff' : '1px solid #ddd',
                borderRadius: 20,
                backgroundColor: selectedCategory === category ? '#e3f2fd' : 'white',
                color: selectedCategory === category ? '#007bff' : '#666',
                cursor: 'pointer',
                fontSize: 12,
                fontWeight: selectedCategory === category ? '600' : '400',
                transition: 'all 0.2s ease'
              }}
            >
              📁 {category}
            </button>
          ))}
        </div>
        <div style={{ marginTop: 8, fontSize: 12, color: '#666' }}>
          Showing {filteredProducts.length} products in {selectedCategory}
        </div>
      </div>

      {loading && (
        <div style={{ 
          textAlign: 'center', 
          padding: 20,
          backgroundColor: '#f8f9fa',
          borderRadius: 4,
          margin: '10px 0'
        }}>
          <div>Loading your tracked products...</div>
        </div>
      )}

      {!loading && filteredProducts.length === 0 && selectedCategory === 'All Stores' && (
        <div style={{ 
          textAlign: 'center', 
          padding: 20, 
          backgroundColor: '#f9f9f9', 
          borderRadius: 4,
          margin: '10px 0'
        }}>
          <h3 style={{ fontSize: 16 }}>No products being tracked yet</h3>
          <p style={{ fontSize: 14 }}>Import some products to start tracking their prices!</p>
          <a 
            href="/import" 
            style={{ 
              display: 'inline-block',
              padding: '8px 16px',
              backgroundColor: '#007bff',
              color: 'white',
              textDecoration: 'none',
              borderRadius: 4,
              marginTop: 8
            }}
          >
            Import Products
          </a>
        </div>
      )}

      {!loading && filteredProducts.length === 0 && selectedCategory !== 'All Stores' && (
        <div style={{ 
          textAlign: 'center', 
          padding: 20, 
          backgroundColor: '#f9f9f9', 
          borderRadius: 4,
          margin: '10px 0'
        }}>
          <h3 style={{ fontSize: 16 }}>No products in {selectedCategory}</h3>
          <p style={{ fontSize: 14 }}>Try selecting a different category or add products to this category!</p>
        </div>
      )}

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: window.innerWidth <= 768 ? '1fr' : 'repeat(2, 1fr)', 
        gap: window.innerWidth <= 768 ? 12 : 16, 
        maxWidth: window.innerWidth <= 768 ? '100%' : '950px',
        margin: '0 auto',
        padding: window.innerWidth <= 768 ? '0 8px' : '0'
      }}>
        {filteredProducts.map((item) => (
          <div key={item.id} style={{ 
            border: '1px solid #e0e6ed', 
            borderRadius: 12, 
            backgroundColor: 'white',
            overflow: 'hidden',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            minHeight: '320px',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Product Header */}
            <div style={{ 
              display: 'flex', 
              padding: 16,
              gap: 12,
              alignItems: 'flex-start',
              borderBottom: '1px solid #f0f0f0'
            }}>
              <img 
                src={item.product.image_url} 
                alt={item.product.name} 
                style={{ 
                  width: 80, 
                  height: 80, 
                  objectFit: 'cover', 
                  borderRadius: 8,
                  flexShrink: 0
                }} 
              />
              
              <div style={{ flex: 1, minWidth: 0 }}>
                <h3 style={{ 
                  margin: '0 0 8px 0', 
                  fontSize: 16, 
                  color: '#1a202c',
                  lineHeight: '1.3',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  fontWeight: '600'
                }}>
                  {item.product.name}
                </h3>
                
                
                {/* AI-Powered Smart Price Display */}
                <SmartPriceDisplay
                  productName={item.product.name}
                  originalPrice={item.product.current_price}
                  platform={item.product.platform}
                  onPriceCorrection={(correctedPrice, reasoning) => {
                    console.log(`AI corrected price for ${item.product.name}:`, correctedPrice, reasoning);
                    setAiCorrectedPrices(prev => ({
                      ...prev,
                      [item.product.id]: correctedPrice
                    }));
                  }}
                />
                
                {/* AI Price Intelligence Display */}
                {priceIntelligence[item.product.id] && (
                  <div style={{
                    marginTop: 8,
                    padding: 8,
                    backgroundColor: '#f0f9ff',
                    borderRadius: 6,
                    border: '1px solid #bae6fd',
                    fontSize: 11
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                      <span style={{ fontWeight: '600', color: '#0369a1' }}>🤖 AI Intelligence</span>
                      <span style={{
                        backgroundColor: priceIntelligence[item.product.id].recommendation.action === 'buy_now' ? '#dcfce7' : 
                                         priceIntelligence[item.product.id].recommendation.action === 'wait' ? '#fef3c7' : '#f3f4f6',
                        color: priceIntelligence[item.product.id].recommendation.action === 'buy_now' ? '#166534' : 
                               priceIntelligence[item.product.id].recommendation.action === 'wait' ? '#92400e' : '#374151',
                        padding: '2px 6px',
                        borderRadius: 4,
                        fontSize: 10,
                        fontWeight: '600'
                      }}>
                        {priceIntelligence[item.product.id].recommendation.action.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    <div style={{ color: '#0369a1' }}>
                      💡 {priceIntelligence[item.product.id].recommendation.reason}
                    </div>
                    {priceIntelligence[item.product.id].recommendation.savings > 0 && (
                      <div style={{ color: '#059669', marginTop: 2 }}>
                        💰 Potential savings: ₹{priceIntelligence[item.product.id].recommendation.savings.toLocaleString()}
                      </div>
                    )}
                  </div>
                )}

                {/* Real-Time Price Monitor */}
                <RealTimePriceMonitor
                  productId={item.product.id}
                  productName={item.product.name}
                  currentPrice={item.product.current_price}
                  productUrl={item.product.url}
                  platform={item.product.platform}
                />

                {/* Product Info Tags */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 0 }}>
                  <span style={{ 
                    fontSize: 12,
                    padding: '4px 8px',
                    backgroundColor: '#edf2f7',
                    borderRadius: 6,
                    color: '#4a5568',
                    fontWeight: '500'
                  }}>
                    {item.product.platform}
                  </span>
                  {item.category && (
                    <span style={{ 
                      fontSize: 11,
                      padding: '3px 8px',
                      backgroundColor: '#ebf8ff',
                      borderRadius: 12,
                      color: '#2b6cb0',
                      fontWeight: '500'
                    }}>
                      📁 {item.category}
                    </span>
                  )}
                  <span style={{ fontSize: 11, color: '#718096', marginLeft: 'auto' }}>
                    {new Date(item.added_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0' }}>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                <button 
                  onClick={() => setShowPayment({
                    show: true, 
                    product: {
                      name: item.product.name,
                      current_price: item.product.current_price,
                      url: affiliateLinks[item.product.id] || item.product.url
                    }
                  })}
                  style={{ 
                    padding: '8px 16px', 
                    backgroundColor: '#38a169',
                    color: 'white', 
                    border: 'none',
                    borderRadius: 6, 
                    fontSize: 14,
                    fontWeight: '500',
                    transition: 'background-color 0.2s ease',
                    flex: 1,
                    cursor: 'pointer'
                  }}
                >
                  🛒 Buy Now
                </button>
                
                <button 
                  onClick={() => enableWhatsAppNotifications(item.product.id)}
                  style={{ 
                    padding: '8px 16px', 
                    backgroundColor: '#25d366', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: 6, 
                    fontSize: 14, 
                    cursor: 'pointer',
                    fontWeight: '500',
                    transition: 'background-color 0.2s ease',
                    flex: 1
                  }}
                >
                  📱 Alert
                </button>
                
                <button 
                  onClick={() => removeFromWishlist(item.id)}
                  style={{ 
                    padding: '8px 12px', 
                    backgroundColor: '#e53e3e', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: 6, 
                    fontSize: 14, 
                    cursor: 'pointer',
                    fontWeight: '500',
                    transition: 'background-color 0.2s ease'
                  }}
                >
                  🗑️
                </button>
              </div>
            </div>
            
            {/* Ultra Compact Price Comparison */}
            {priceComparisons[item.product.id] && (
              <div style={{ 
                padding: 3, 
                backgroundColor: '#fafbfc',
                borderTop: '1px solid #f0f0f0'
              }}>
                <div style={{ fontSize: 8, fontWeight: 600, marginBottom: 2, color: '#333' }}>
                  💰 Best Deals ({priceComparisons[item.product.id].length} sites checked)
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(55px, 1fr))', gap: 2 }}>
                  {priceComparisons[item.product.id].slice(0, 6).map((source: any) => (
                    <button
                      key={source.name}
                      onClick={() => {
                        console.log(`🔗 Opening ${source.name}: ${source.url}`);
                        window.open(source.url, '_blank', 'noopener,noreferrer');
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = '#e3f2fd';
                        e.currentTarget.style.transform = 'scale(1.02)';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = 'white';
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                      style={{ 
                        padding: '2px 1px', 
                        backgroundColor: 'white', 
                        border: source.isOriginal ? '1px solid #28a745' : source.isBestDeal ? '1px solid #ffc107' : '1px solid #dee2e6',
                        borderRadius: 2,
                        textAlign: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.1s ease',
                        position: 'relative'
                      }}
                      title={`${source.name} - ₹${source.price.toLocaleString()}${source.rating ? ` (${source.rating}⭐)` : ''}${source.features ? ` - ${source.features.join(', ')}` : ''}`}
                    >
                      <div style={{ fontSize: 6, fontWeight: 'bold', color: '#333', marginBottom: 1 }}>
                        {source.name.length > 6 ? source.name.substring(0, 4) + '..' : source.name}
                        {source.isOriginal && <span style={{ color: '#28a745' }}>★</span>}
                        {source.isBestDeal && <span style={{ color: '#ffc107' }}>💎</span>}
                      </div>
                      <div style={{ fontSize: 7, color: '#007bff', fontWeight: 'bold' }}>
                        ₹{source.price.toLocaleString()}
                      </div>
                      {source.rating && (
                        <div style={{ fontSize: 5, color: '#666' }}>
                          {source.rating}⭐
                        </div>
                      )}
                    </button>
                  ))}
                </div>
                <div style={{ 
                  fontSize: 8, 
                  color: '#666', 
                  marginTop: 3, 
                  textAlign: 'center' 
                }}>
                  ★ Original | 💎 Best Deal | 🏪 {priceComparisons[item.product.id].length} stores compared
                </div>
              </div>
            )}

            {/* Minimal Price Chart */}
            <div style={{ padding: '16px', backgroundColor: '#fafafa' }}>
              <div style={{ 
                height: 140,
                backgroundColor: 'white',
                borderRadius: 8,
                border: '1px solid #e2e8f0',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                overflow: 'hidden'
              }}>
                <EnhancedRealPriceChart
                  productId={item.product.id}
                  productName={item.product.name}
                  currentPrice={item.product.current_price}
                  targetPrice={item.target_price}
                  height={140}
                  onTargetPriceChange={(newTarget) => {
                    // Update target price functionality
                    updateTargetPrice(item.id, newTarget);
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
        </>
      )}
      
      {/* Payment Gateway Modal */}
      {showPayment.show && showPayment.product && (
        <PaymentGateway
          productName={showPayment.product.name}
          productPrice={showPayment.product.current_price}
          productUrl={showPayment.product.url}
          onClose={() => setShowPayment({show: false})}
        />
      )}
      
      {/* Multi-AI Provider Selector */}
      <AIProviderSelector userId={getCurrentUserId()} wishlistData={products} />

      {/* WhatsApp Integration Section */}
      <WhatsAppIntegration />
    </div>
  );
};

export default PriceTracker;
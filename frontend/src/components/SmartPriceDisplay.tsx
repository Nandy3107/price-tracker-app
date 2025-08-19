import React, { useState, useEffect } from 'react';
import { AIProductIntelligence } from '../services/AIProductIntelligence';

interface SmartPriceDisplayProps {
  productName: string;
  originalPrice: number;
  platform: string;
  onPriceCorrection?: (correctedPrice: number, reasoning: string) => void;
}

const SmartPriceDisplay: React.FC<SmartPriceDisplayProps> = ({
  productName,
  originalPrice,
  platform,
  onPriceCorrection
}) => {
  const [validationResult, setValidationResult] = useState<any>(null);
  const [marketIntelligence, setMarketIntelligence] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    validatePrice();
    getMarketIntelligence();
  }, [productName, originalPrice, platform]);

  const validatePrice = async () => {
    try {
      const result = AIProductIntelligence.validateAndCorrectPrice(
        productName,
        originalPrice,
        platform
      );
      setValidationResult(result);
      
      if (!result.isValid && onPriceCorrection) {
        onPriceCorrection(result.correctedPrice, result.reasoning);
      }
    } catch (error) {
      console.error('Price validation error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getMarketIntelligence = async () => {
    try {
      const intelligence = await AIProductIntelligence.getMarketIntelligence(productName);
      setMarketIntelligence(intelligence);
    } catch (error) {
      console.error('Market intelligence error:', error);
    }
  };

  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString()}`;
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{
          width: 16,
          height: 16,
          border: '2px solid #e5e7eb',
          borderTop: '2px solid #3b82f6',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <span style={{ fontSize: 14, color: '#6b7280' }}>Validating price...</span>
      </div>
    );
  }

  if (!validationResult) return null;

  return (
    <div style={{ width: '100%' }}>
      {/* Main Price Display */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
        <span style={{ 
          fontSize: 20, 
          fontWeight: 'bold', 
          color: validationResult.isValid ? '#2b6cb0' : '#dc2626',
          textDecoration: validationResult.isValid ? 'none' : 'line-through'
        }}>
          {formatPrice(originalPrice)}
        </span>
        
        {!validationResult.isValid && (
          <>
            <span style={{ color: '#6b7280', fontSize: 14 }}>→</span>
            <span style={{ 
              fontSize: 20, 
              fontWeight: 'bold', 
              color: '#059669',
              background: 'linear-gradient(135deg, #ecfdf5, #d1fae5)',
              padding: '2px 8px',
              borderRadius: 6,
              border: '1px solid #a7f3d0'
            }}>
              {formatPrice(validationResult.correctedPrice)}
            </span>
            <span style={{
              fontSize: 10,
              backgroundColor: '#fef3c7',
              color: '#92400e',
              padding: '2px 6px',
              borderRadius: 4,
              fontWeight: '600'
            }}>
              AI CORRECTED
            </span>
          </>
        )}
        
        {/* Price Confidence Indicator */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          backgroundColor: validationResult.confidence > 0.8 ? '#dcfce7' : '#fef3c7',
          padding: '2px 6px',
          borderRadius: 4,
          fontSize: 10,
          color: validationResult.confidence > 0.8 ? '#166534' : '#92400e'
        }}>
          🤖 {Math.round(validationResult.confidence * 100)}%
        </div>
      </div>

      {/* AI Intelligence Badge */}
      {!validationResult.isValid && (
        <div style={{
          fontSize: 11,
          color: '#dc2626',
          backgroundColor: '#fef2f2',
          padding: '4px 8px',
          borderRadius: 6,
          marginBottom: 8,
          border: '1px solid #fecaca'
        }}>
          ⚠️ {validationResult.reasoning}
        </div>
      )}

      {/* Market Intelligence Summary */}
      {marketIntelligence && (
        <div style={{
          fontSize: 10,
          color: '#374151',
          backgroundColor: '#f9fafb',
          padding: '6px 8px',
          borderRadius: 6,
          marginBottom: 8,
          border: '1px solid #e5e7eb'
        }}>
          📊 Market: {formatPrice(marketIntelligence.marketPrice)} | 
          📈 {marketIntelligence.seasonality} | 
          🎯 Demand: {marketIntelligence.demandLevel.toUpperCase()}
        </div>
      )}

      {/* Advanced Details Toggle */}
      <button
        onClick={() => setShowDetails(!showDetails)}
        style={{
          fontSize: 10,
          color: '#3b82f6',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          textDecoration: 'underline',
          padding: 0
        }}
      >
        {showDetails ? '🔽 Hide AI Analysis' : '🔼 Show AI Analysis'}
      </button>

      {/* Detailed AI Analysis */}
      {showDetails && marketIntelligence && (
        <div style={{
          marginTop: 8,
          padding: 12,
          backgroundColor: '#f8fafc',
          borderRadius: 8,
          border: '1px solid #e2e8f0',
          fontSize: 11
        }}>
          <div style={{ fontWeight: '600', marginBottom: 6, color: '#1f2937' }}>
            🤖 AI Market Intelligence Report
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <div>
              <strong>📊 Price Range:</strong><br />
              {formatPrice(marketIntelligence.priceRange.min)} - {formatPrice(marketIntelligence.priceRange.max)}
            </div>
            <div>
              <strong>🎯 Market Price:</strong><br />
              {formatPrice(marketIntelligence.marketPrice)}
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <strong>📈 Season Analysis:</strong><br />
              {marketIntelligence.seasonality}
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <strong>💡 AI Recommendation:</strong><br />
              {marketIntelligence.recommendation}
            </div>
          </div>
        </div>
      )}

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

export default SmartPriceDisplay;

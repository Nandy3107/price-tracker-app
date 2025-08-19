import React from 'react';
import SendWhatsAppMessage from '../components/SendWhatsAppMessage';

const WhatsAppIntegration: React.FC = () => {
  return (
    <div style={{ maxWidth: 600, margin: '2rem auto', padding: 32, background: 'linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)', borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
      <h1 style={{ textAlign: 'center', color: '#075e54', marginBottom: 24 }}>
        WhatsApp Chat Integration
      </h1>
      <p style={{ textAlign: 'center', color: '#333', marginBottom: 32 }}>
        Send price alerts and product info directly to WhatsApp. Enter details below and click send!
      </p>
      <SendWhatsAppMessage />
    </div>
  );
};

export default WhatsAppIntegration;

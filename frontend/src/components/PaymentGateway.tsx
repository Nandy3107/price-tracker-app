import React, { useState } from 'react';

interface PaymentGatewayProps {
  productName: string;
  productPrice: number;
  productUrl: string;
  onClose: () => void;
}

const PaymentGateway: React.FC<PaymentGatewayProps> = ({
  productName,
  productPrice,
  productUrl,
  onClose
}) => {
  const [selectedPayment, setSelectedPayment] = useState<string>('');
  const [showUPI, setShowUPI] = useState(false);

  // UPI Payment Details
  const upiId = "merchant@paytm"; // Replace with actual merchant UPI ID
  const merchantName = "PriceTracker Pro";
  
  const generateUPILink = (paymentApp: string) => {
    const amount = productPrice.toString();
    const note = `Payment for ${productName}`;
    
    const upiLinks = {
      gpay: `tez://upi/pay?pa=${upiId}&pn=${merchantName}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`,
      phonepe: `phonepe://pay?pa=${upiId}&pn=${merchantName}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`,
      paytm: `paytmmp://pay?pa=${upiId}&pn=${merchantName}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`,
      upi: `upi://pay?pa=${upiId}&pn=${merchantName}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`
    };
    
    return upiLinks[paymentApp as keyof typeof upiLinks] || upiLinks.upi;
  };

  const generateQRCode = () => {
    const upiString = `upi://pay?pa=${upiId}&pn=${merchantName}&am=${productPrice}&cu=INR&tn=${encodeURIComponent(`Payment for ${productName}`)}`;
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiString)}`;
  };

  const handlePayment = (method: string) => {
    switch (method) {
      case 'direct':
        window.open(productUrl, '_blank');
        break;
      case 'gpay':
      case 'phonepe':
      case 'paytm':
        window.open(generateUPILink(method), '_blank');
        break;
      case 'upi':
        setShowUPI(true);
        break;
      default:
        break;
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000,
      padding: 20
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: 16,
        maxWidth: 400,
        width: '100%',
        maxHeight: '90vh',
        overflow: 'auto',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: '#111827' }}>
              Choose Payment Method
            </h3>
            <p style={{ margin: '4px 0 0', fontSize: 14, color: '#6b7280' }}>
              ₹{productPrice.toLocaleString()} for {productName.slice(0, 50)}...
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: 24,
              cursor: 'pointer',
              color: '#6b7280',
              padding: 4
            }}
          >
            ×
          </button>
        </div>

        {!showUPI ? (
          <div style={{ padding: 24 }}>
            {/* Direct Purchase */}
            <div style={{ marginBottom: 24 }}>
              <h4 style={{ margin: '0 0 12px', fontSize: 16, fontWeight: 600, color: '#111827' }}>
                🛒 Direct Purchase
              </h4>
              <button
                onClick={() => handlePayment('direct')}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  backgroundColor: '#059669',
                  color: 'white',
                  border: 'none',
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8
                }}
              >
                🔗 Buy Directly from Store
              </button>
            </div>

            {/* UPI Payment Apps */}
            <div style={{ marginBottom: 24 }}>
              <h4 style={{ margin: '0 0 12px', fontSize: 16, fontWeight: 600, color: '#111827' }}>
                💳 Quick UPI Payment
              </h4>
              <div style={{ display: 'grid', gap: 8 }}>
                <button
                  onClick={() => handlePayment('gpay')}
                  style={{
                    padding: '12px 16px',
                    backgroundColor: '#4285f4',
                    color: 'white',
                    border: 'none',
                    borderRadius: 8,
                    fontSize: 14,
                    fontWeight: 500,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12
                  }}
                >
                  <span style={{ fontSize: 18 }}>📱</span>
                  Google Pay
                </button>
                
                <button
                  onClick={() => handlePayment('phonepe')}
                  style={{
                    padding: '12px 16px',
                    backgroundColor: '#5f259f',
                    color: 'white',
                    border: 'none',
                    borderRadius: 8,
                    fontSize: 14,
                    fontWeight: 500,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12
                  }}
                >
                  <span style={{ fontSize: 18 }}>📲</span>
                  PhonePe
                </button>
                
                <button
                  onClick={() => handlePayment('paytm')}
                  style={{
                    padding: '12px 16px',
                    backgroundColor: '#00baf2',
                    color: 'white',
                    border: 'none',
                    borderRadius: 8,
                    fontSize: 14,
                    fontWeight: 500,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12
                  }}
                >
                  <span style={{ fontSize: 18 }}>💙</span>
                  Paytm
                </button>
              </div>
            </div>

            {/* UPI QR Code */}
            <div>
              <h4 style={{ margin: '0 0 12px', fontSize: 16, fontWeight: 600, color: '#111827' }}>
                📱 Scan & Pay
              </h4>
              <button
                onClick={() => handlePayment('upi')}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  backgroundColor: '#6b7280',
                  color: 'white',
                  border: 'none',
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8
                }}
              >
                📷 Show UPI QR Code
              </button>
            </div>

            {/* Security Note */}
            <div style={{
              marginTop: 20,
              padding: 12,
              backgroundColor: '#f3f4f6',
              borderRadius: 8,
              fontSize: 12,
              color: '#6b7280',
              textAlign: 'center'
            }}>
              🔒 Secure payment via UPI. Your financial data is protected.
            </div>
          </div>
        ) : (
          <div style={{ padding: 24, textAlign: 'center' }}>
            <h4 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 600, color: '#111827' }}>
              Scan QR Code to Pay
            </h4>
            
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: 16
            }}>
              <img 
                src={generateQRCode()}
                alt="UPI QR Code"
                style={{
                  width: 200,
                  height: 200,
                  border: '2px solid #e5e7eb',
                  borderRadius: 8
                }}
              />
            </div>
            
            <div style={{
              backgroundColor: '#f9fafb',
              border: '1px solid #e5e7eb',
              borderRadius: 8,
              padding: 12,
              marginBottom: 16
            }}>
              <p style={{ margin: '0 0 8px', fontSize: 14, fontWeight: 500, color: '#111827' }}>
                Payment Details:
              </p>
              <p style={{ margin: '0 0 4px', fontSize: 12, color: '#6b7280' }}>
                Amount: ₹{productPrice.toLocaleString()}
              </p>
              <p style={{ margin: '0 0 4px', fontSize: 12, color: '#6b7280' }}>
                UPI ID: {upiId}
              </p>
              <p style={{ margin: 0, fontSize: 12, color: '#6b7280' }}>
                Merchant: {merchantName}
              </p>
            </div>
            
            <button
              onClick={() => setShowUPI(false)}
              style={{
                padding: '8px 16px',
                backgroundColor: '#6b7280',
                color: 'white',
                border: 'none',
                borderRadius: 6,
                fontSize: 14,
                cursor: 'pointer'
              }}
            >
              ← Back to Payment Options
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentGateway;

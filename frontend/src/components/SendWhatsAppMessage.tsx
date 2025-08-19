import React, { useState } from 'react';

const SendWhatsAppMessage: React.FC = () => {
  const [to, setTo] = useState('');
  const [message, setMessage] = useState('');
  const [productName, setProductName] = useState('');
  const [currentPrice, setCurrentPrice] = useState('');
  const [targetPrice, setTargetPrice] = useState('');
  const [platform, setPlatform] = useState('');
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Sending...');
    const productInfo = productName ? {
      name: productName,
      currentPrice: Number(currentPrice),
      targetPrice: Number(targetPrice),
      platform,
      url,
    } : undefined;
    try {
      const res = await fetch('/api/send-whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to, message, productInfo }),
      });
      const data = await res.json();
      setStatus(data.success ? 'Message sent!' : 'Failed to send message');
    } catch (err) {
      setStatus('Error sending message');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '2rem auto', padding: 20, border: '1px solid #ccc', borderRadius: 8 }}>
      <h2>Send WhatsApp Message</h2>
      <form onSubmit={handleSubmit}>
        <label>Phone Number (with country code):<br />
          <input type="text" value={to} onChange={e => setTo(e.target.value)} required placeholder="e.g. 919876543210" />
        </label><br /><br />
        <label>Message:<br />
          <textarea value={message} onChange={e => setMessage(e.target.value)} required />
        </label><br /><br />
        <details>
          <summary>Optional Product Info</summary>
          <label>Product Name:<br />
            <input type="text" value={productName} onChange={e => setProductName(e.target.value)} />
          </label><br />
          <label>Current Price:<br />
            <input type="number" value={currentPrice} onChange={e => setCurrentPrice(e.target.value)} />
          </label><br />
          <label>Target Price:<br />
            <input type="number" value={targetPrice} onChange={e => setTargetPrice(e.target.value)} />
          </label><br />
          <label>Platform:<br />
            <input type="text" value={platform} onChange={e => setPlatform(e.target.value)} />
          </label><br />
          <label>Product URL:<br />
            <input type="text" value={url} onChange={e => setUrl(e.target.value)} />
          </label><br />
        </details>
        <button type="submit">Send WhatsApp Message</button>
      </form>
      {status && <p style={{ marginTop: 16 }}>{status}</p>}
    </div>
  );
};

export default SendWhatsAppMessage;

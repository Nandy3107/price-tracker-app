import React from 'react';
import { useWishlist } from '../context/WishlistContext';

const Wishlist: React.FC = () => {
  const { wishlist, removeFromWishlist } = useWishlist();

  return (
    <div style={{ padding: 24 }}>
      <h2>My Wishlist (Live)</h2>
      <p>Products you imported from StoreIntegration will appear here instantly.</p>
      {wishlist.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 40, backgroundColor: '#f9f9f9', borderRadius: 8, margin: '20px 0' }}>
          <h3>Your wishlist is empty</h3>
          <p>Start by importing products from your favorite shopping sites!</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {wishlist.map((item) => (
            <div key={item.url} style={{ border: '1px solid #ddd', borderRadius: 8, padding: 12, backgroundColor: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              {item.image && (
                <img src={item.image} alt={item.title} style={{ width: '100%', height: 140, objectFit: 'cover', borderRadius: 4, marginBottom: 8 }} />
              )}
              <h4 style={{ margin: '0 0 6px 0', fontSize: 14, lineHeight: '1.3', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{item.title}</h4>
              <div style={{ marginBottom: 6 }}>
                <span style={{ fontSize: 16, fontWeight: 'bold', color: '#007bff' }}>{item.price}</span>
              </div>
              <div style={{ fontSize: 11, color: '#666', marginBottom: 8, display: 'flex', justifyContent: 'space-between' }}>
                <span>{item.store}</span>
              </div>
              <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
                <a href={item.url} target="_blank" rel="noopener noreferrer" style={{ flex: 1, padding: '6px 8px', backgroundColor: '#28a745', color: 'white', textDecoration: 'none', borderRadius: 4, textAlign: 'center', fontSize: 11 }}>View Product</a>
                <button onClick={() => removeFromWishlist(item.url)} style={{ padding: '6px 8px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: 4, fontSize: 11, cursor: 'pointer' }}>Remove</button>
              </div>
              {item.message && <div style={{ fontSize: 10, color: '#666' }}>{item.message}</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;

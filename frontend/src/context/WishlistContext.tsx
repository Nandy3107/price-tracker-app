import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface WishlistProduct {
  store: string;
  title: string;
  price: string;
  url: string;
  image?: string;
  message?: string;
}

interface WishlistContextType {
  wishlist: WishlistProduct[];
  addToWishlist: (product: WishlistProduct) => void;
  removeFromWishlist: (url: string) => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [wishlist, setWishlist] = useState<WishlistProduct[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('wishlist');
    if (stored) setWishlist(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const addToWishlist = (product: WishlistProduct) => {
    setWishlist(prev => {
      if (prev.some(item => item.url === product.url)) return prev;
      return [product, ...prev];
    });
  };

  const removeFromWishlist = (url: string) => {
    setWishlist(prev => prev.filter(item => item.url !== url));
  };

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
};

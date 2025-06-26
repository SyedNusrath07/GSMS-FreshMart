import React, { createContext, useContext, useState, ReactNode } from 'react';
import { WishlistItem, Product } from '../types';

interface WishlistContextType {
  wishlist: WishlistItem[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export const WishlistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);

  const addToWishlist = (product: Product) => {
    const existingItem = wishlist.find(item => item.product.id === product.id);
    if (!existingItem) {
      setWishlist(prev => [...prev, { product, addedAt: new Date() }]);
    }
  };

  const removeFromWishlist = (productId: string) => {
    setWishlist(prev => prev.filter(item => item.product.id !== productId));
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some(item => item.product.id === productId);
  };

  const clearWishlist = () => {
    setWishlist([]);
  };

  return (
    <WishlistContext.Provider value={{
      wishlist,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      clearWishlist
    }}>
      {children}
    </WishlistContext.Provider>
  );
};
import React from 'react';
import { X, ShoppingCart, Trash2, Heart } from 'lucide-react';
import { useWishlist } from '../contexts/WishlistContext';
import { useCart } from '../contexts/CartContext';

interface WishlistProps {
  isOpen: boolean;
  onClose: () => void;
}

const Wishlist: React.FC<WishlistProps> = ({ isOpen, onClose }) => {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (!isOpen) return null;

  const handleAddToCart = (productId: string) => {
    const item = wishlist.find(item => item.product.id === productId);
    if (item) {
      addToCart(item.product, 1);
      removeFromWishlist(productId);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white dark:bg-gray-800 shadow-xl">
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <Heart className="h-5 w-5 text-red-500" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Wishlist</h2>
              {wishlist.length > 0 && (
                <span className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 text-xs px-2 py-1 rounded-full">
                  {wishlist.length}
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              {wishlist.length > 0 && (
                <button
                  onClick={clearWishlist}
                  className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  Clear All
                </button>
              )}
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {wishlist.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
                <Heart className="h-16 w-16 mb-4" />
                <p className="text-lg font-medium">Your wishlist is empty</p>
                <p className="text-sm">Save items you love for later</p>
              </div>
            ) : (
              <div className="space-y-4">
                {wishlist.map((item) => (
                  <div key={item.product.id} className="flex items-center space-x-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white">{item.product.name}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{item.product.brand}</p>
                      <p className="text-green-600 dark:text-green-400 font-semibold">₹{item.product.price}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        Added {item.addedAt.toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex flex-col space-y-2">
                      <button
                        onClick={() => handleAddToCart(item.product.id)}
                        disabled={!item.product.inStock}
                        className={`p-2 rounded-lg transition-colors ${
                          item.product.inStock
                            ? 'bg-green-600 text-white hover:bg-green-700'
                            : 'bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed'
                        }`}
                        title={item.product.inStock ? 'Add to cart' : 'Out of stock'}
                      >
                        <ShoppingCart className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => removeFromWishlist(item.product.id)}
                        className="p-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        title="Remove from wishlist"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
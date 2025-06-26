import React from 'react';
import { Plus, Minus, ShoppingCart, Heart, Star, Eye } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
  const { cart, addToCart, updateQuantity } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  
  const cartItem = cart.find(item => item.product.id === product.id);
  const quantity = cartItem?.quantity || 0;
  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product, 1);
  };

  const handleIncrement = () => {
    updateQuantity(product.id, quantity + 1);
  };

  const handleDecrement = () => {
    updateQuantity(product.id, quantity - 1);
  };

  const handleWishlistToggle = () => {
    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${
          i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300 dark:text-gray-600'
        }`}
      />
    ));
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100 dark:border-gray-700">
      <div className="relative h-48 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-2">
            <button
              onClick={() => onQuickView?.(product)}
              className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              title="Quick view"
            >
              <Eye className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            </button>
            <button
              onClick={handleWishlistToggle}
              className={`p-2 rounded-full shadow-lg transition-colors ${
                inWishlist
                  ? 'bg-red-500 text-white hover:bg-red-600'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
              title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <Heart className={`h-4 w-4 ${inWishlist ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* Stock Status */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-semibold bg-red-600 px-3 py-1 rounded-full text-sm">
              Out of Stock
            </span>
          </div>
        )}

        {/* Discount Badge */}
        {product.stock <= 10 && product.inStock && (
          <div className="absolute top-2 left-2">
            <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-medium">
              Low Stock
            </span>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="mb-2">
          <span className="text-xs text-green-600 dark:text-green-400 font-medium bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">
            {product.brand}
          </span>
        </div>

        <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-1">{product.name}</h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">{product.description}</p>
        
        {/* Rating */}
        <div className="flex items-center space-x-2 mb-3">
          <div className="flex items-center">
            {renderStars(product.rating)}
          </div>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {product.rating} ({product.reviews})
          </span>
        </div>

        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-2xl font-bold text-green-600 dark:text-green-400">₹{product.price}</span>
            <div className="text-xs text-gray-500 dark:text-gray-400">{product.stock} in stock</div>
          </div>
        </div>

        {/* Nutrition Info */}
        {product.nutritionInfo && (
          <div className="mb-3 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-xs text-gray-600 dark:text-gray-400 grid grid-cols-2 gap-1">
              <span>Calories: {product.nutritionInfo.calories}</span>
              <span>Protein: {product.nutritionInfo.protein}g</span>
            </div>
          </div>
        )}

        {product.inStock ? (
          quantity > 0 ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 bg-gray-50 dark:bg-gray-700 rounded-lg p-1">
                <button
                  onClick={handleDecrement}
                  className="p-2 rounded-lg bg-white dark:bg-gray-600 hover:bg-gray-100 dark:hover:bg-gray-500 transition-colors shadow-sm"
                >
                  <Minus className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                </button>
                <span className="font-semibold text-lg min-w-[2rem] text-center text-gray-900 dark:text-white">{quantity}</span>
                <button
                  onClick={handleIncrement}
                  className="p-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors shadow-sm"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <div className="text-right">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  ₹{(product.price * quantity).toFixed(2)}
                </span>
              </div>
            </div>
          ) : (
            <button
              onClick={handleAddToCart}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-4 rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 flex items-center justify-center space-x-2 font-medium shadow-md hover:shadow-lg transform hover:scale-105"
            >
              <ShoppingCart className="h-4 w-4" />
              <span>Add to Cart</span>
            </button>
          )
        ) : (
          <button
            disabled
            className="w-full bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 py-3 px-4 rounded-lg cursor-not-allowed font-medium"
          >
            Out of Stock
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
import React, { useState } from 'react';
import { Filter as FilterIcon, Grid, List, Sparkles } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import CategoryFilter from './CategoryFilter';
import ProductCard from './ProductCard';
import FilterPanel from './FilterPanel';
import OrderTracking from './OrderTracking';

const CustomerDashboard: React.FC = () => {
  const { getFilteredProducts, orders, getRecommendedProducts } = useApp();
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'recommendations'>('products');

  const filteredProducts = getFilteredProducts();
  const userOrders = orders.filter(order => order.customerId === user?.id);
  const activeOrders = userOrders.filter(order => order.status !== 'completed');
  const recommendedProducts = user ? getRecommendedProducts(user.id) : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome back, {user?.name}! 👋</h1>
        <p className="text-gray-600 dark:text-gray-400">Discover fresh groceries and quality products</p>
      </div>

      {/* Active Orders */}
      {activeOrders.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Your Active Orders</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {activeOrders.slice(0, 2).map((order) => (
              <OrderTracking key={order.id} order={order} />
            ))}
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex space-x-1 mb-8 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
        <button
          onClick={() => setActiveTab('products')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'products'
              ? 'bg-white dark:bg-gray-700 text-green-600 dark:text-green-400 shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          All Products
        </button>
        {recommendedProducts.length > 0 && (
          <button
            onClick={() => setActiveTab('recommendations')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-2 ${
              activeTab === 'recommendations'
                ? 'bg-white dark:bg-gray-700 text-green-600 dark:text-green-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Sparkles className="h-4 w-4" />
            <span>Recommended</span>
          </button>
        )}
        {userOrders.length > 0 && (
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'orders'
                ? 'bg-white dark:bg-gray-700 text-green-600 dark:text-green-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Order History
          </button>
        )}
      </div>

      {activeTab === 'products' && (
        <>
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className="hidden lg:block w-80 flex-shrink-0">
              <FilterPanel isOpen={true} onClose={() => {}} />
            </div>

            {/* Main Content */}
            <div className="flex-1">
              <CategoryFilter
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
              />

              {/* Controls */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setShowFilters(true)}
                    className="lg:hidden flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <FilterIcon className="h-4 w-4" />
                    <span>Filters</span>
                  </button>
                  <p className="text-gray-600 dark:text-gray-400">
                    {filteredProducts.length} products found
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === 'grid'
                        ? 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                        : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                    }`}
                  >
                    <Grid className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === 'list'
                        ? 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                        : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                    }`}
                  >
                    <List className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Products Grid */}
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {filteredProducts.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-gray-400 dark:text-gray-600 text-6xl mb-4">🛒</div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No products found</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Try adjusting your search terms or filters
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Filter Panel */}
          <FilterPanel isOpen={showFilters} onClose={() => setShowFilters(false)} />
        </>
      )}

      {activeTab === 'recommendations' && (
        <div>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Recommended for You</h2>
            <p className="text-gray-600 dark:text-gray-400">Based on your previous purchases</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {recommendedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <div>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Order History</h2>
            <p className="text-gray-600 dark:text-gray-400">Track your past and current orders</p>
          </div>
          <div className="space-y-6">
            {userOrders.map((order) => (
              <OrderTracking key={order.id} order={order} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerDashboard;
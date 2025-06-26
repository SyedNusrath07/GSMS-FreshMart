import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { WishlistProvider } from './contexts/WishlistContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { AppProvider } from './contexts/AppContext';
import Header from './components/Header';
import CustomerDashboard from './components/CustomerDashboard';
import AdminDashboard from './components/admin/AdminDashboard';
import OrderSummary from './components/OrderSummary';
import Wishlist from './components/Wishlist';
import AuthModal from './components/AuthModal';
import Footer from './components/Footer';

const AppContent: React.FC = () => {
  const { user } = useAuth();
  const [showWishlist, setShowWishlist] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors container mx-auto px-4 sm:px-6 lg:px-8">
        <Header
          onWishlistClick={() => setShowWishlist(true)}
          onAuthClick={() => setShowAuth(true)}
          onFilterClick={() => setShowFilters(true)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          showSearch={!user || user.role === 'customer'}
          showFilters={user?.role === 'customer'}
        />

        <main>
          <Routes>
            <Route path="/order-summary" element={<OrderSummary />} />
            <Route path="/" element={
              !user ? (
                <div className="text-center py-16">
                  <div className="mb-8">
                    <div className="text-8xl mb-4">🛒</div>
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                      Welcome to FreshMart
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
                      Your neighborhood grocery store, now digital
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
                      <div className="text-4xl mb-4">🥕</div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Fresh Products</h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        Locally sourced fruits, vegetables, and organic products
                      </p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
                      <div className="text-4xl mb-4">⚡</div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Quick Pickup</h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        Order online and pick up in just 30 minutes
                      </p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
                      <div className="text-4xl mb-4">💰</div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Best Prices</h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        Competitive prices on all your favorite items
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowAuth(true)}
                    className="bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-3 rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 text-lg font-medium shadow-md hover:shadow-lg transform hover:scale-105"
                  >
                    Get Started
                  </button>
                </div>
              ) : user.role === 'admin' ? (
                <AdminDashboard />
              ) : (
                <CustomerDashboard />
              )
            } />
          </Routes>
        </main>

        <Wishlist
          isOpen={showWishlist}
          onClose={() => setShowWishlist(false)}
        />

        <AuthModal
          isOpen={showAuth}
          onClose={() => setShowAuth(false)}
        />

        <Footer />
      </div>
    </Router>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <CartProvider>
            <WishlistProvider>
              <AppProvider>
                <AppContent />
              </AppProvider>
            </WishlistProvider>
          </CartProvider>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Product, Order, Category, Filter, Analytics } from '../types';
import { useNotifications } from './NotificationContext';

interface AppContextType {
  products: Product[];
  orders: Order[];
  categories: Category[];
  filters: Filter;
  analytics: Analytics;
  searchQuery: string;
  searchSuggestions: string[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  bulkUpdateProducts: (products: Partial<Product>[]) => void;
  addOrder: (order: Omit<Order, 'id'>) => string;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  getOrdersByStatus: (status: Order['status']) => Order[];
  searchProducts: (query: string) => Product[];
  getProductsByCategory: (category: string) => Product[];
  getFilteredProducts: () => Product[];
  updateFilters: (filters: Partial<Filter>) => void;
  setSearchQuery: (query: string) => void;
  getLowStockProducts: () => Product[];
  getRecommendedProducts: (userId: string) => Product[];
  updateAnalytics: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

const initialCategories: Category[] = [
  { id: '1', name: 'Fruits & Vegetables', icon: '🥕', productCount: 0 },
  { id: '2', name: 'Dairy & Eggs', icon: '🥛', productCount: 0 },
  { id: '3', name: 'Meat & Seafood', icon: '🥩', productCount: 0 },
  { id: '4', name: 'Bakery', icon: '🍞', productCount: 0 },
  { id: '5', name: 'Beverages', icon: '🥤', productCount: 0 },
  { id: '6', name: 'Snacks', icon: '🍿', productCount: 0 },
  { id: '7', name: 'Pantry', icon: '🥫', productCount: 0 },
  { id: '8', name: 'Frozen Foods', icon: '🧊', productCount: 0 },
  { id: '9', name: 'Personal Care', icon: '🧴', productCount: 0 },
  { id: '10', name: 'Household', icon: '🧽', productCount: 0 },
];

const initialProducts: Product[] = [
  // Fruits & Vegetables
  {
    id: '1',
    name: 'Fresh Bananas',
    description: 'Premium quality bananas, perfect for breakfast and smoothies',
    price: 89,
    category: 'Fruits & Vegetables',
    brand: 'Fresh Farm',
    image: 'https://images.pexels.com/photos/2872755/pexels-photo-2872755.jpeg?auto=compress&cs=tinysrgb&w=400',
    stock: 50,
    inStock: true,
    rating: 4.5,
    reviews: 128,
    tags: ['fresh', 'organic', 'potassium'],
    nutritionInfo: { calories: 89, protein: 1.1, carbs: 22.8, fat: 0.3 }
  },
  {
    id: '2',
    name: 'Red Apples',
    description: 'Crisp and sweet red apples, rich in fiber and vitamins',
    price: 150,
    category: 'Fruits & Vegetables',
    brand: 'Orchard Fresh',
    image: 'https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg?auto=compress&cs=tinysrgb&w=400',
    stock: 75,
    inStock: true,
    rating: 4.7,
    reviews: 95,
    tags: ['fresh', 'vitamin-c', 'fiber'],
    nutritionInfo: { calories: 52, protein: 0.3, carbs: 14, fat: 0.2 }
  },
  {
    id: '3',
    name: 'Fresh Spinach',
    description: 'Organic spinach leaves, perfect for salads and cooking',
    price: 45,
    category: 'Fruits & Vegetables',
    brand: 'Green Valley',
    image: 'https://images.pexels.com/photos/2325843/pexels-photo-2325843.jpeg?auto=compress&cs=tinysrgb&w=400',
    stock: 30,
    inStock: true,
    rating: 4.3,
    reviews: 67,
    tags: ['organic', 'iron', 'leafy-green'],
    nutritionInfo: { calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4 }
  },
  {
    id: '4',
    name: 'Fresh Tomatoes',
    description: 'Juicy red tomatoes, perfect for cooking and salads',
    price: 60,
    category: 'Fruits & Vegetables',
    brand: 'Farm Fresh',
    image: 'https://images.pexels.com/photos/533280/pexels-photo-533280.jpeg?auto=compress&cs=tinysrgb&w=400',
    stock: 40,
    inStock: true,
    rating: 4.4,
    reviews: 89,
    tags: ['fresh', 'lycopene', 'vitamin-c'],
    nutritionInfo: { calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2 }
  },
  {
    id: '5',
    name: 'Fresh Carrots',
    description: 'Crunchy orange carrots, rich in beta-carotene',
    price: 55,
    category: 'Fruits & Vegetables',
    brand: 'Garden Fresh',
    image: 'https://images.pexels.com/photos/143133/pexels-photo-143133.jpeg?auto=compress&cs=tinysrgb&w=400',
    stock: 35,
    inStock: true,
    rating: 4.6,
    reviews: 72,
    tags: ['fresh', 'beta-carotene', 'vitamin-a'],
    nutritionInfo: { calories: 41, protein: 0.9, carbs: 9.6, fat: 0.2 }
  },

  // Dairy & Eggs
  {
    id: '6',
    name: 'Organic Milk',
    description: 'Fresh organic whole milk, 1 liter pack',
    price: 75,
    category: 'Dairy & Eggs',
    brand: 'Pure Dairy',
    image: 'https://images.pexels.com/photos/248412/pexels-photo-248412.jpeg?auto=compress&cs=tinysrgb&w=400',
    stock: 25,
    inStock: true,
    rating: 4.8,
    reviews: 156,
    tags: ['organic', 'calcium', 'protein'],
    nutritionInfo: { calories: 42, protein: 3.4, carbs: 5, fat: 1 }
  },
  {
    id: '7',
    name: 'Farm Fresh Eggs',
    description: 'Free-range chicken eggs, pack of 12',
    price: 120,
    category: 'Dairy & Eggs',
    brand: 'Happy Hens',
    image: 'https://images.pexels.com/photos/162712/egg-white-food-protein-162712.jpeg?auto=compress&cs=tinysrgb&w=400',
    stock: 45,
    inStock: true,
    rating: 4.7,
    reviews: 134,
    tags: ['free-range', 'protein', 'omega-3'],
    nutritionInfo: { calories: 155, protein: 13, carbs: 1.1, fat: 11 }
  },
  {
    id: '8',
    name: 'Greek Yogurt',
    description: 'Thick and creamy Greek yogurt, 500g container',
    price: 180,
    category: 'Dairy & Eggs',
    brand: 'Mediterranean',
    image: 'https://images.pexels.com/photos/1435735/pexels-photo-1435735.jpeg?auto=compress&cs=tinysrgb&w=400',
    stock: 20,
    inStock: true,
    rating: 4.6,
    reviews: 98,
    tags: ['probiotic', 'protein', 'calcium'],
    nutritionInfo: { calories: 59, protein: 10, carbs: 3.6, fat: 0.4 }
  },
  {
    id: '9',
    name: 'Cheddar Cheese',
    description: 'Aged cheddar cheese, 200g block',
    price: 250,
    category: 'Dairy & Eggs',
    brand: 'Artisan Cheese',
    image: 'https://images.pexels.com/photos/773253/pexels-photo-773253.jpeg?auto=compress&cs=tinysrgb&w=400',
    stock: 15,
    inStock: true,
    rating: 4.5,
    reviews: 76,
    tags: ['aged', 'calcium', 'protein'],
    nutritionInfo: { calories: 113, protein: 7, carbs: 1, fat: 9 }
  },

  // Meat & Seafood
  {
    id: '10',
    name: 'Fresh Salmon',
    description: 'Atlantic salmon fillet, wild caught, 500g',
    price: 650,
    category: 'Meat & Seafood',
    brand: 'Ocean Fresh',
    image: 'https://images.pexels.com/photos/1565982/pexels-photo-1565982.jpeg?auto=compress&cs=tinysrgb&w=400',
    stock: 15,
    inStock: true,
    rating: 4.9,
    reviews: 87,
    tags: ['wild-caught', 'omega-3', 'protein'],
    nutritionInfo: { calories: 208, protein: 20, carbs: 0, fat: 13 }
  },
  {
    id: '11',
    name: 'Chicken Breast',
    description: 'Boneless chicken breast, 1kg pack',
    price: 320,
    category: 'Meat & Seafood',
    brand: 'Farm Chicken',
    image: 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?auto=compress&cs=tinysrgb&w=400',
    stock: 25,
    inStock: true,
    rating: 4.4,
    reviews: 112,
    tags: ['lean', 'protein', 'boneless'],
    nutritionInfo: { calories: 165, protein: 31, carbs: 0, fat: 3.6 }
  },
  {
    id: '12',
    name: 'Fresh Prawns',
    description: 'Large prawns, cleaned and deveined, 500g',
    price: 450,
    category: 'Meat & Seafood',
    brand: 'Coastal Catch',
    image: 'https://images.pexels.com/photos/725991/pexels-photo-725991.jpeg?auto=compress&cs=tinysrgb&w=400',
    stock: 12,
    inStock: true,
    rating: 4.6,
    reviews: 65,
    tags: ['fresh', 'protein', 'low-fat'],
    nutritionInfo: { calories: 99, protein: 18, carbs: 0.2, fat: 1.4 }
  },

  // Bakery
  {
    id: '13',
    name: 'Artisan Bread',
    description: 'Fresh baked sourdough bread, 500g loaf',
    price: 85,
    category: 'Bakery',
    brand: 'Baker\'s Choice',
    image: 'https://images.pexels.com/photos/1586947/pexels-photo-1586947.jpeg?auto=compress&cs=tinysrgb&w=400',
    stock: 20,
    inStock: true,
    rating: 4.7,
    reviews: 143,
    tags: ['artisan', 'sourdough', 'fresh-baked'],
    nutritionInfo: { calories: 265, protein: 9, carbs: 49, fat: 3.2 }
  },
  {
    id: '14',
    name: 'Chocolate Croissants',
    description: 'Buttery croissants with chocolate filling, pack of 4',
    price: 160,
    category: 'Bakery',
    brand: 'French Bakery',
    image: 'https://images.pexels.com/photos/2067396/pexels-photo-2067396.jpeg?auto=compress&cs=tinysrgb&w=400',
    stock: 18,
    inStock: true,
    rating: 4.8,
    reviews: 89,
    tags: ['buttery', 'chocolate', 'french'],
    nutritionInfo: { calories: 406, protein: 8, carbs: 45, fat: 21 }
  },
  {
    id: '15',
    name: 'Whole Wheat Bread',
    description: 'Healthy whole wheat bread, 400g loaf',
    price: 65,
    category: 'Bakery',
    brand: 'Healthy Grains',
    image: 'https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg?auto=compress&cs=tinysrgb&w=400',
    stock: 30,
    inStock: true,
    rating: 4.3,
    reviews: 97,
    tags: ['whole-wheat', 'fiber', 'healthy'],
    nutritionInfo: { calories: 247, protein: 13, carbs: 41, fat: 4.2 }
  },

  // Beverages
  {
    id: '16',
    name: 'Orange Juice',
    description: 'Fresh squeezed orange juice, no pulp, 1 liter',
    price: 120,
    category: 'Beverages',
    brand: 'Citrus Fresh',
    image: 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=400',
    stock: 30,
    inStock: true,
    rating: 4.5,
    reviews: 156,
    tags: ['fresh', 'vitamin-c', 'no-pulp'],
    nutritionInfo: { calories: 45, protein: 0.7, carbs: 10.4, fat: 0.2 }
  },
  {
    id: '17',
    name: 'Green Tea',
    description: 'Premium green tea bags, pack of 25',
    price: 180,
    category: 'Beverages',
    brand: 'Tea Garden',
    image: 'https://images.pexels.com/photos/1638280/pexels-photo-1638280.jpeg?auto=compress&cs=tinysrgb&w=400',
    stock: 40,
    inStock: true,
    rating: 4.6,
    reviews: 203,
    tags: ['antioxidants', 'premium', 'healthy'],
    nutritionInfo: { calories: 2, protein: 0, carbs: 0, fat: 0 }
  },
  {
    id: '18',
    name: 'Coconut Water',
    description: 'Natural coconut water, 500ml bottle',
    price: 45,
    category: 'Beverages',
    brand: 'Tropical Pure',
    image: 'https://images.pexels.com/photos/1435735/pexels-photo-1435735.jpeg?auto=compress&cs=tinysrgb&w=400',
    stock: 35,
    inStock: true,
    rating: 4.4,
    reviews: 124,
    tags: ['natural', 'electrolytes', 'hydrating'],
    nutritionInfo: { calories: 19, protein: 0.7, carbs: 3.7, fat: 0.2 }
  },

  // Snacks
  {
    id: '19',
    name: 'Mixed Nuts',
    description: 'Premium mixed nuts, lightly salted, 250g pack',
    price: 320,
    category: 'Snacks',
    brand: 'Nutty Delights',
    image: 'https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg?auto=compress&cs=tinysrgb&w=400',
    stock: 40,
    inStock: true,
    rating: 4.7,
    reviews: 189,
    tags: ['premium', 'protein', 'healthy-fats'],
    nutritionInfo: { calories: 607, protein: 20, carbs: 16, fat: 54 }
  },
  {
    id: '20',
    name: 'Dark Chocolate',
    description: '70% dark chocolate bar, 100g',
    price: 150,
    category: 'Snacks',
    brand: 'Cocoa Rich',
    image: 'https://images.pexels.com/photos/918327/pexels-photo-918327.jpeg?auto=compress&cs=tinysrgb&w=400',
    stock: 25,
    inStock: true,
    rating: 4.8,
    reviews: 167,
    tags: ['dark', 'antioxidants', '70%'],
    nutritionInfo: { calories: 546, protein: 7.8, carbs: 46, fat: 31 }
  },
  {
    id: '21',
    name: 'Potato Chips',
    description: 'Crispy potato chips, classic salted, 150g pack',
    price: 75,
    category: 'Snacks',
    brand: 'Crispy Bites',
    image: 'https://images.pexels.com/photos/1583884/pexels-photo-1583884.jpeg?auto=compress&cs=tinysrgb&w=400',
    stock: 50,
    inStock: true,
    rating: 4.2,
    reviews: 234,
    tags: ['crispy', 'salted', 'classic'],
    nutritionInfo: { calories: 536, protein: 6, carbs: 53, fat: 34 }
  },

  // Pantry
  {
    id: '22',
    name: 'Olive Oil',
    description: 'Extra virgin olive oil, cold pressed, 500ml',
    price: 450,
    category: 'Pantry',
    brand: 'Mediterranean Gold',
    image: 'https://images.pexels.com/photos/33783/olive-oil-salad-dressing-cooking-olive.jpg?auto=compress&cs=tinysrgb&w=400',
    stock: 35,
    inStock: true,
    rating: 4.9,
    reviews: 145,
    tags: ['extra-virgin', 'cold-pressed', 'premium'],
    nutritionInfo: { calories: 884, protein: 0, carbs: 0, fat: 100 }
  },
  {
    id: '23',
    name: 'Basmati Rice',
    description: 'Premium aged basmati rice, 5kg pack',
    price: 650,
    category: 'Pantry',
    brand: 'Royal Grains',
    image: 'https://images.pexels.com/photos/723198/pexels-photo-723198.jpeg?auto=compress&cs=tinysrgb&w=400',
    stock: 20,
    inStock: true,
    rating: 4.6,
    reviews: 178,
    tags: ['basmati', 'aged', 'premium'],
    nutritionInfo: { calories: 365, protein: 7.1, carbs: 78, fat: 0.9 }
  },
  {
    id: '24',
    name: 'Pasta',
    description: 'Italian durum wheat pasta, 500g pack',
    price: 120,
    category: 'Pantry',
    brand: 'Italiano',
    image: 'https://images.pexels.com/photos/1437267/pexels-photo-1437267.jpeg?auto=compress&cs=tinysrgb&w=400',
    stock: 45,
    inStock: true,
    rating: 4.4,
    reviews: 156,
    tags: ['italian', 'durum-wheat', 'authentic'],
    nutritionInfo: { calories: 371, protein: 13, carbs: 75, fat: 1.5 }
  },

  // Frozen Foods
  {
    id: '25',
    name: 'Frozen Berries',
    description: 'Mixed frozen berries, 500g pack',
    price: 280,
    category: 'Frozen Foods',
    brand: 'Arctic Fresh',
    image: 'https://images.pexels.com/photos/1841555/pexels-photo-1841555.jpeg?auto=compress&cs=tinysrgb&w=400',
    stock: 22,
    inStock: true,
    rating: 4.5,
    reviews: 98,
    tags: ['mixed', 'antioxidants', 'vitamin-c'],
    nutritionInfo: { calories: 57, protein: 0.7, carbs: 14, fat: 0.3 }
  },
  {
    id: '26',
    name: 'Frozen Vegetables',
    description: 'Mixed frozen vegetables, 1kg pack',
    price: 180,
    category: 'Frozen Foods',
    brand: 'Garden Freeze',
    image: 'https://images.pexels.com/photos/1435735/pexels-photo-1435735.jpeg?auto=compress&cs=tinysrgb&w=400',
    stock: 30,
    inStock: true,
    rating: 4.3,
    reviews: 134,
    tags: ['mixed', 'convenient', 'nutritious'],
    nutritionInfo: { calories: 42, protein: 2.2, carbs: 8.7, fat: 0.4 }
  },

  // Personal Care
  {
    id: '27',
    name: 'Organic Shampoo',
    description: 'Natural organic shampoo for all hair types, 300ml',
    price: 320,
    category: 'Personal Care',
    brand: 'Nature\'s Care',
    image: 'https://images.pexels.com/photos/4465124/pexels-photo-4465124.jpeg?auto=compress&cs=tinysrgb&w=400',
    stock: 25,
    inStock: true,
    rating: 4.6,
    reviews: 89,
    tags: ['organic', 'natural', 'sulfate-free'],
    nutritionInfo: { calories: 0, protein: 0, carbs: 0, fat: 0 }
  },
  {
    id: '28',
    name: 'Toothpaste',
    description: 'Fluoride toothpaste for cavity protection, 100g',
    price: 85,
    category: 'Personal Care',
    brand: 'Dental Pro',
    image: 'https://images.pexels.com/photos/4465124/pexels-photo-4465124.jpeg?auto=compress&cs=tinysrgb&w=400',
    stock: 40,
    inStock: true,
    rating: 4.4,
    reviews: 156,
    tags: ['fluoride', 'cavity-protection', 'fresh'],
    nutritionInfo: { calories: 0, protein: 0, carbs: 0, fat: 0 }
  },

  // Household
  {
    id: '29',
    name: 'Dish Soap',
    description: 'Concentrated dish soap, lemon scented, 500ml',
    price: 95,
    category: 'Household',
    brand: 'Clean Master',
    image: 'https://images.pexels.com/photos/4465124/pexels-photo-4465124.jpeg?auto=compress&cs=tinysrgb&w=400',
    stock: 35,
    inStock: true,
    rating: 4.3,
    reviews: 123,
    tags: ['concentrated', 'lemon', 'grease-cutting'],
    nutritionInfo: { calories: 0, protein: 0, carbs: 0, fat: 0 }
  },
  {
    id: '30',
    name: 'Laundry Detergent',
    description: 'Liquid laundry detergent, 1 liter',
    price: 180,
    category: 'Household',
    brand: 'Fresh Clean',
    image: 'https://images.pexels.com/photos/4465124/pexels-photo-4465124.jpeg?auto=compress&cs=tinysrgb&w=400',
    stock: 28,
    inStock: true,
    rating: 4.5,
    reviews: 167,
    tags: ['liquid', 'stain-removal', 'fresh-scent'],
    nutritionInfo: { calories: 0, protein: 0, carbs: 0, fat: 0 }
  }
];

const initialFilters: Filter = {
  brands: [],
  priceRange: [0, 1000],
  availability: 'all',
  rating: 0,
  sortBy: 'name'
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [orders, setOrders] = useState<Order[]>([]);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [filters, setFilters] = useState<Filter>(initialFilters);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [analytics, setAnalytics] = useState<Analytics>({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    averageOrderValue: 0,
    topSellingProducts: [],
    orderTrends: [],
    categoryPerformance: []
  });

  const { addNotification } = useNotifications();

  // Update category product counts
  useEffect(() => {
    const updatedCategories = categories.map(category => ({
      ...category,
      productCount: products.filter(product => product.category === category.name).length
    }));
    setCategories(updatedCategories);
  }, [products]);

  // Update search suggestions
  useEffect(() => {
    if (searchQuery.length > 0) {
      const suggestions = products
        .filter(product => 
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
        )
        .slice(0, 5)
        .map(product => product.name);
      setSearchSuggestions(suggestions);
    } else {
      setSearchSuggestions([]);
    }
  }, [searchQuery, products]);

  // Check for low stock and send notifications
  useEffect(() => {
    const lowStockProducts = products.filter(product => product.stock <= 5 && product.inStock);
    lowStockProducts.forEach(product => {
      addNotification({
        userId: 'admin',
        title: 'Low Stock Alert',
        message: `${product.name} is running low (${product.stock} items left)`,
        type: 'warning'
      });
    });
  }, [products, addNotification]);

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...product,
      id: Date.now().toString(),
    };
    setProducts(prev => [...prev, newProduct]);
    addNotification({
      userId: 'admin',
      title: 'Product Added',
      message: `${product.name} has been added to inventory`,
      type: 'success'
    });
  };

  const updateProduct = (id: string, updatedProduct: Partial<Product>) => {
    setProducts(prev =>
      prev.map(product =>
        product.id === id ? { ...product, ...updatedProduct } : product
      )
    );
  };

  const deleteProduct = (id: string) => {
    const product = products.find(p => p.id === id);
    setProducts(prev => prev.filter(product => product.id !== id));
    if (product) {
      addNotification({
        userId: 'admin',
        title: 'Product Deleted',
        message: `${product.name} has been removed from inventory`,
        type: 'info'
      });
    }
  };

  const bulkUpdateProducts = (productsToUpdate: Partial<Product>[]) => {
    productsToUpdate.forEach(productUpdate => {
      if (productUpdate.id) {
        updateProduct(productUpdate.id, productUpdate);
      }
    });
    addNotification({
      userId: 'admin',
      title: 'Bulk Update Complete',
      message: `${productsToUpdate.length} products have been updated`,
      type: 'success'
    });
  };

  const addOrder = (order: Omit<Order, 'id'>): string => {
    const newOrder: Order = {
      ...order,
      id: `ORDER-${Date.now()}`,
    };
    setOrders(prev => [...prev, newOrder]);
    
    // Send notification to admin
    addNotification({
      userId: 'admin',
      title: 'New Order Received',
      message: `Order ${newOrder.id} from ${newOrder.customerName} - ₹${newOrder.total.toFixed(2)}`,
      type: 'info'
    });

    // Send confirmation to customer
    addNotification({
      userId: order.customerId,
      title: 'Order Confirmed',
      message: `Your order ${newOrder.id} has been placed successfully. Pickup in 30 minutes.`,
      type: 'success'
    });

    updateAnalytics();
    return newOrder.id;
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    const order = orders.find(o => o.id === orderId);
    setOrders(prev =>
      prev.map(order =>
        order.id === orderId ? { ...order, status } : order
      )
    );

    if (order) {
      // Notify customer about status change
      let message = '';
      switch (status) {
        case 'preparing':
          message = 'Your order is being prepared';
          break;
        case 'ready':
          message = 'Your order is ready for pickup!';
          break;
        case 'completed':
          message = 'Thank you for your order!';
          break;
        case 'cancelled':
          message = 'Your order has been cancelled';
          break;
      }

      addNotification({
        userId: order.customerId,
        title: 'Order Status Update',
        message: `Order ${orderId}: ${message}`,
        type: status === 'ready' ? 'success' : 'info'
      });
    }
  };

  const getOrdersByStatus = (status: Order['status']) => {
    return orders.filter(order => order.status === status);
  };

  const searchProducts = (query: string) => {
    return products.filter(product =>
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.description.toLowerCase().includes(query.toLowerCase()) ||
      product.category.toLowerCase().includes(query.toLowerCase()) ||
      product.brand.toLowerCase().includes(query.toLowerCase()) ||
      product.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    );
  };

  const getProductsByCategory = (category: string) => {
    return products.filter(product => product.category === category);
  };

  const getFilteredProducts = () => {
    let filteredProducts = [...products];

    // Apply search filter
    if (searchQuery) {
      filteredProducts = searchProducts(searchQuery);
    }

    // Apply brand filter
    if (filters.brands.length > 0) {
      filteredProducts = filteredProducts.filter(product =>
        filters.brands.includes(product.brand)
      );
    }

    // Apply price range filter
    filteredProducts = filteredProducts.filter(product =>
      product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1]
    );

    // Apply availability filter
    if (filters.availability === 'inStock') {
      filteredProducts = filteredProducts.filter(product => product.inStock);
    } else if (filters.availability === 'outOfStock') {
      filteredProducts = filteredProducts.filter(product => !product.inStock);
    }

    // Apply rating filter
    if (filters.rating > 0) {
      filteredProducts = filteredProducts.filter(product => product.rating >= filters.rating);
    }

    // Apply sorting
    switch (filters.sortBy) {
      case 'price-low':
        filteredProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filteredProducts.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filteredProducts.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filteredProducts.sort((a, b) => parseInt(b.id) - parseInt(a.id));
        break;
      default:
        filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
    }

    return filteredProducts;
  };

  const updateFilters = (newFilters: Partial<Filter>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const getLowStockProducts = () => {
    return products.filter(product => product.stock <= 10);
  };

  const getRecommendedProducts = (userId: string) => {
    // Simple recommendation based on user's order history
    const userOrders = orders.filter(order => order.customerId === userId);
    const purchasedCategories = userOrders.flatMap(order => 
      order.items.map(item => item.product.category)
    );
    
    const categoryCount = purchasedCategories.reduce((acc, category) => {
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topCategories = Object.entries(categoryCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([category]) => category);

    return products
      .filter(product => topCategories.includes(product.category))
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 6);
  };

  const updateAnalytics = () => {
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = orders.length;
    const uniqueCustomers = new Set(orders.map(order => order.customerId)).size;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Calculate top selling products
    const productSales = orders.flatMap(order => order.items).reduce((acc, item) => {
      const productId = item.product.id;
      if (!acc[productId]) {
        acc[productId] = { product: item.product, quantity: 0, revenue: 0 };
      }
      acc[productId].quantity += item.quantity;
      acc[productId].revenue += item.product.price * item.quantity;
      return acc;
    }, {} as Record<string, { product: Product; quantity: number; revenue: number }>);

    const topSellingProducts = Object.values(productSales)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    // Calculate category performance
    const categoryPerformance = categories.map(category => {
      const categoryOrders = orders.flatMap(order => 
        order.items.filter(item => item.product.category === category.name)
      );
      const sales = categoryOrders.reduce((sum, item) => sum + item.quantity, 0);
      const revenue = categoryOrders.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
      
      return {
        category: category.name,
        sales,
        revenue
      };
    }).filter(cat => cat.sales > 0);

    setAnalytics({
      totalRevenue,
      totalOrders,
      totalCustomers: uniqueCustomers,
      averageOrderValue,
      topSellingProducts,
      orderTrends: [], // Would be calculated with date-based data
      categoryPerformance
    });
  };

  return (
    <AppContext.Provider value={{
      products,
      orders,
      categories,
      filters,
      analytics,
      searchQuery,
      searchSuggestions,
      addProduct,
      updateProduct,
      deleteProduct,
      bulkUpdateProducts,
      addOrder,
      updateOrderStatus,
      getOrdersByStatus,
      searchProducts,
      getProductsByCategory,
      getFilteredProducts,
      updateFilters,
      setSearchQuery,
      getLowStockProducts,
      getRecommendedProducts,
      updateAnalytics,
    }}>
      {children}
    </AppContext.Provider>
  );
};
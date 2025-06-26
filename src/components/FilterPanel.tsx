import React, { useState } from 'react';
import { Filter, ChevronDown, ChevronUp, Star } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ isOpen, onClose }) => {
  const { products, filters, updateFilters } = useApp();
  const [expandedSections, setExpandedSections] = useState({
    brand: true,
    price: true,
    availability: true,
    rating: true,
    sort: true
  });

  if (!isOpen) return null;

  const brands = [...new Set(products.map(p => p.brand))].sort();
  const maxPrice = Math.max(...products.map(p => p.price));

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleBrandChange = (brand: string, checked: boolean) => {
    const newBrands = checked
      ? [...filters.brands, brand]
      : filters.brands.filter(b => b !== brand);
    updateFilters({ brands: newBrands });
  };

  const handlePriceRangeChange = (min: number, max: number) => {
    updateFilters({ priceRange: [min, max] });
  };

  const clearAllFilters = () => {
    updateFilters({
      brands: [],
      priceRange: [0, maxPrice],
      availability: 'all',
      rating: 0,
      sortBy: 'name'
    });
  };

  const activeFiltersCount = 
    filters.brands.length +
    (filters.priceRange[0] > 0 || filters.priceRange[1] < maxPrice ? 1 : 0) +
    (filters.availability !== 'all' ? 1 : 0) +
    (filters.rating > 0 ? 1 : 0) +
    (filters.sortBy !== 'name' ? 1 : 0);

  return (
    <div className="fixed inset-0 z-50 lg:relative lg:inset-auto">
      <div className="absolute inset-0 bg-black bg-opacity-50 lg:hidden" onClick={onClose} />
      
      <div className="absolute right-0 top-0 h-full w-80 bg-white dark:bg-gray-800 shadow-xl lg:relative lg:w-full lg:shadow-none border-l lg:border-l-0 lg:border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              <h3 className="font-semibold text-gray-900 dark:text-white">Filters</h3>
              {activeFiltersCount > 0 && (
                <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs px-2 py-1 rounded-full">
                  {activeFiltersCount}
                </span>
              )}
            </div>
            <button
              onClick={clearAllFilters}
              className="text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300"
            >
              Clear All
            </button>
          </div>
        </div>

        <div className="overflow-y-auto h-full pb-20">
          {/* Sort By */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => toggleSection('sort')}
              className="flex items-center justify-between w-full text-left"
            >
              <span className="font-medium text-gray-900 dark:text-white">Sort By</span>
              {expandedSections.sort ? (
                <ChevronUp className="h-4 w-4 text-gray-500" />
              ) : (
                <ChevronDown className="h-4 w-4 text-gray-500" />
              )}
            </button>
            {expandedSections.sort && (
              <div className="mt-3 space-y-2">
                {[
                  { value: 'name', label: 'Name (A-Z)' },
                  { value: 'price-low', label: 'Price: Low to High' },
                  { value: 'price-high', label: 'Price: High to Low' },
                  { value: 'rating', label: 'Highest Rated' },
                  { value: 'newest', label: 'Newest First' }
                ].map(option => (
                  <label key={option.value} className="flex items-center">
                    <input
                      type="radio"
                      name="sortBy"
                      value={option.value}
                      checked={filters.sortBy === option.value}
                      onChange={(e) => updateFilters({ sortBy: e.target.value as any })}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 dark:border-gray-600"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{option.label}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Brand Filter */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => toggleSection('brand')}
              className="flex items-center justify-between w-full text-left"
            >
              <span className="font-medium text-gray-900 dark:text-white">Brand</span>
              {expandedSections.brand ? (
                <ChevronUp className="h-4 w-4 text-gray-500" />
              ) : (
                <ChevronDown className="h-4 w-4 text-gray-500" />
              )}
            </button>
            {expandedSections.brand && (
              <div className="mt-3 space-y-2 max-h-40 overflow-y-auto">
                {brands.map(brand => (
                  <label key={brand} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.brands.includes(brand)}
                      onChange={(e) => handleBrandChange(brand, e.target.checked)}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 dark:border-gray-600 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{brand}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Price Range */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => toggleSection('price')}
              className="flex items-center justify-between w-full text-left"
            >
              <span className="font-medium text-gray-900 dark:text-white">Price Range</span>
              {expandedSections.price ? (
                <ChevronUp className="h-4 w-4 text-gray-500" />
              ) : (
                <ChevronDown className="h-4 w-4 text-gray-500" />
              )}
            </button>
            {expandedSections.price && (
              <div className="mt-3 space-y-3">
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.priceRange[0]}
                    onChange={(e) => handlePriceRangeChange(Number(e.target.value), filters.priceRange[1])}
                    className="w-20 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  <span className="text-gray-500">to</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.priceRange[1]}
                    onChange={(e) => handlePriceRangeChange(filters.priceRange[0], Number(e.target.value))}
                    className="w-20 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  ₹{filters.priceRange[0]} - ₹{filters.priceRange[1]}
                </div>
              </div>
            )}
          </div>

          {/* Availability */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => toggleSection('availability')}
              className="flex items-center justify-between w-full text-left"
            >
              <span className="font-medium text-gray-900 dark:text-white">Availability</span>
              {expandedSections.availability ? (
                <ChevronUp className="h-4 w-4 text-gray-500" />
              ) : (
                <ChevronDown className="h-4 w-4 text-gray-500" />
              )}
            </button>
            {expandedSections.availability && (
              <div className="mt-3 space-y-2">
                {[
                  { value: 'all', label: 'All Products' },
                  { value: 'inStock', label: 'In Stock Only' },
                  { value: 'outOfStock', label: 'Out of Stock' }
                ].map(option => (
                  <label key={option.value} className="flex items-center">
                    <input
                      type="radio"
                      name="availability"
                      value={option.value}
                      checked={filters.availability === option.value}
                      onChange={(e) => updateFilters({ availability: e.target.value as any })}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 dark:border-gray-600"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{option.label}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Rating */}
          <div className="p-4">
            <button
              onClick={() => toggleSection('rating')}
              className="flex items-center justify-between w-full text-left"
            >
              <span className="font-medium text-gray-900 dark:text-white">Minimum Rating</span>
              {expandedSections.rating ? (
                <ChevronUp className="h-4 w-4 text-gray-500" />
              ) : (
                <ChevronDown className="h-4 w-4 text-gray-500" />
              )}
            </button>
            {expandedSections.rating && (
              <div className="mt-3 space-y-2">
                {[4, 3, 2, 1].map(rating => (
                  <label key={rating} className="flex items-center">
                    <input
                      type="radio"
                      name="rating"
                      value={rating}
                      checked={filters.rating === rating}
                      onChange={(e) => updateFilters({ rating: Number(e.target.value) })}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 dark:border-gray-600"
                    />
                    <div className="ml-2 flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300 dark:text-gray-600'
                          }`}
                        />
                      ))}
                      <span className="ml-1 text-sm text-gray-700 dark:text-gray-300">& up</span>
                    </div>
                  </label>
                ))}
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="rating"
                    value={0}
                    checked={filters.rating === 0}
                    onChange={(e) => updateFilters({ rating: Number(e.target.value) })}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 dark:border-gray-600"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">All Ratings</span>
                </label>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
import React from 'react';
import { useApp } from '../contexts/AppContext';

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onCategoryChange
}) => {
  const { categories } = useApp();

  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Shop by Category</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
        <button
          onClick={() => onCategoryChange('all')}
          className={`p-4 rounded-lg border-2 transition-all ${
            selectedCategory === 'all'
              ? 'border-green-600 bg-green-50 text-green-700'
              : 'border-gray-200 hover:border-green-300 hover:bg-green-50'
          }`}
        >
          <div className="text-2xl mb-2">🛒</div>
          <div className="text-sm font-medium">All Items</div>
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.name)}
            className={`p-4 rounded-lg border-2 transition-all ${
              selectedCategory === category.name
                ? 'border-green-600 bg-green-50 text-green-700'
                : 'border-gray-200 hover:border-green-300 hover:bg-green-50'
            }`}
          >
            <div className="text-2xl mb-2">{category.icon}</div>
            <div className="text-sm font-medium">{category.name}</div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
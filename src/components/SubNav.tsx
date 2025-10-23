import React from 'react';
import { useCategories } from '../hooks/useCategories';

interface SubNavProps {
  selectedCategory: string;
  onCategoryClick: (categoryId: string) => void;
}

const SubNav: React.FC<SubNavProps> = ({ selectedCategory, onCategoryClick }) => {
  const { categories, loading } = useCategories();

  return (
    <div className="sticky top-24 z-40 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex items-center gap-3 overflow-x-auto py-6 scrollbar-hide elegant-scrollbar">
          {loading ? (
            <div className="flex gap-3">
              {[1,2,3,4,5].map(i => (
                <div key={i} className="h-10 w-28 bg-gray-100 rounded animate-pulse" />
              ))}
            </div>
          ) : (
            <>
              <button
                onClick={() => onCategoryClick('all')}
                className={`px-6 py-2.5 text-xs font-sans font-medium tracking-wide uppercase transition-all duration-300 flex items-center gap-2 whitespace-nowrap ${
                  selectedCategory === 'all'
                    ? 'bg-black text-white'
                    : 'bg-white text-black border border-gray-300 hover:border-black'
                }`}
              >
                <span className="text-base">🍽️</span>
                <span>All Items</span>
              </button>
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => onCategoryClick(c.id)}
                  className={`px-6 py-2.5 text-xs font-sans font-medium tracking-wide uppercase transition-all duration-300 flex items-center gap-2 whitespace-nowrap ${
                    selectedCategory === c.id
                      ? 'bg-black text-white'
                      : 'bg-white text-black border border-gray-300 hover:border-black'
                  }`}
                >
                  <span className="text-base">{c.icon}</span>
                  <span>{c.name}</span>
                </button>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubNav;



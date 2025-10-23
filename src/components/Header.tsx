import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { useSiteSettings } from '../hooks/useSiteSettings';

interface HeaderProps {
  cartItemsCount: number;
  onCartClick: () => void;
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ cartItemsCount, onCartClick, onMenuClick }) => {
  const { siteSettings, loading } = useSiteSettings();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 elegant-shadow">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-24">
          <button 
            onClick={onMenuClick}
            className="flex items-center space-x-4 group"
          >
            {loading ? (
              <div className="w-16 h-16 bg-gray-100 rounded-sm animate-pulse" />
            ) : (
              <img 
                src={siteSettings?.site_logo || "/logo.jpg"} 
                alt={siteSettings?.site_name || "Messy Bite"}
                className="w-16 h-16 object-cover transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  e.currentTarget.src = "/logo.jpg";
                }}
              />
            )}
            <div className="flex flex-col items-start">
              <h1 className="text-3xl font-serif font-semibold text-black tracking-luxury group-hover:text-mb-red transition-colors duration-300">
                {loading ? (
                  <div className="w-32 h-8 bg-gray-100 rounded animate-pulse" />
                ) : (
                  "Messy Bite"
                )}
              </h1>
              <p className="text-xs font-sans text-gray-500 tracking-wide uppercase mt-0.5">Seafood & Grill</p>
            </div>
          </button>

          <div className="flex items-center space-x-6">
            <button 
              onClick={onCartClick}
              className="relative group"
            >
              <div className="flex items-center space-x-2 px-5 py-3 border border-gray-300 hover:border-black transition-all duration-300">
                <ShoppingCart className="h-5 w-5 text-black" />
                <span className="font-sans text-sm font-medium text-black tracking-wide hidden sm:inline">Cart</span>
                {cartItemsCount > 0 && (
                  <span className="ml-1 font-sans text-sm font-semibold text-mb-red">
                    ({cartItemsCount})
                  </span>
                )}
              </div>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
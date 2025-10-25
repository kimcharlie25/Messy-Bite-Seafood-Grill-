import React, { useState } from 'react';
import { Plus, Minus, X, ShoppingCart } from 'lucide-react';
import { MenuItem, Variation, AddOn } from '../types';

interface MenuItemCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem, quantity?: number, variation?: Variation, addOns?: AddOn[]) => void;
  quantity: number;
  onUpdateQuantity: (id: string, quantity: number) => void;
  cartItemId?: string;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({ 
  item, 
  onAddToCart, 
  quantity, 
  onUpdateQuantity,
  cartItemId
}) => {
  const [showCustomization, setShowCustomization] = useState(false);
  const [selectedVariation, setSelectedVariation] = useState<Variation | undefined>(
    item.variations?.[0]
  );
  const [selectedAddOns, setSelectedAddOns] = useState<(AddOn & { quantity: number })[]>([]);

  const calculatePrice = () => {
    // Use effective price (discounted or regular) as base
    let price = item.effectivePrice || item.basePrice;
    if (selectedVariation) {
      price = (item.effectivePrice || item.basePrice) + selectedVariation.price;
    }
    selectedAddOns.forEach(addOn => {
      price += addOn.price * addOn.quantity;
    });
    return price;
  };

  const handleAddToCart = () => {
    if (item.variations?.length || item.addOns?.length) {
      setShowCustomization(true);
    } else {
      onAddToCart(item, 1);
    }
  };

  const handleCustomizedAddToCart = () => {
    // Convert selectedAddOns back to regular AddOn array for cart
    const addOnsForCart: AddOn[] = selectedAddOns.flatMap(addOn => 
      Array(addOn.quantity).fill({ ...addOn, quantity: undefined })
    );
    onAddToCart(item, 1, selectedVariation, addOnsForCart);
    setShowCustomization(false);
    setSelectedAddOns([]);
  };

  const handleIncrement = () => {
    if (cartItemId) {
      onUpdateQuantity(cartItemId, quantity + 1);
    } else {
      // If no cart item exists, add to cart
      onAddToCart(item, 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 0 && cartItemId) {
      onUpdateQuantity(cartItemId, quantity - 1);
    }
  };

  const updateAddOnQuantity = (addOn: AddOn, quantity: number) => {
    setSelectedAddOns(prev => {
      const existingIndex = prev.findIndex(a => a.id === addOn.id);
      
      if (quantity === 0) {
        // Remove add-on if quantity is 0
        return prev.filter(a => a.id !== addOn.id);
      }
      
      if (existingIndex >= 0) {
        // Update existing add-on quantity
        const updated = [...prev];
        updated[existingIndex] = { ...updated[existingIndex], quantity };
        return updated;
      } else {
        // Add new add-on with quantity
        return [...prev, { ...addOn, quantity }];
      }
    });
  };

  const groupedAddOns = item.addOns?.reduce((groups, addOn) => {
    const category = addOn.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(addOn);
    return groups;
  }, {} as Record<string, AddOn[]>);

  return (
    <>
      <div className={`bg-white luxury-card overflow-hidden group animate-elegant-scale ${!item.available ? 'opacity-60' : ''}`}>
        {/* List Layout: Image Left, Content Right */}
        <div className="flex flex-row">
          {/* Image Container - Left Side */}
          <div className="relative w-32 sm:w-48 h-32 sm:h-40 bg-gray-50 elegant-image-container flex-shrink-0">
            {item.image ? (
              <img
                src={item.image}
                alt={item.name}
                className="elegant-image transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
                decoding="async"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
            ) : null}
            <div className={`absolute inset-0 flex items-center justify-center ${item.image ? 'hidden' : ''}`}>
              <div className="text-4xl opacity-10 text-gray-400">🦞</div>
            </div>
            <div className="elegant-image-overlay"></div>
            
            {/* Badges - Repositioned for list layout */}
            <div className="absolute top-1 left-1 sm:top-2 sm:left-2 flex flex-col gap-0.5 sm:gap-1">
              {item.isOnDiscount && item.discountPrice && (
                <div className="badge-sale text-xs px-1.5 py-0.5 sm:px-2 sm:py-1">
                  SALE
                </div>
              )}
              {item.popular && (
                <div className="badge-popular text-xs px-1.5 py-0.5 sm:px-2 sm:py-1">
                  ★ POPULAR
                </div>
              )}
            </div>
            
            {!item.available && (
              <div className="absolute top-1 right-1 sm:top-2 sm:right-2 badge-elegant text-xs px-1.5 py-0.5 sm:px-2 sm:py-1">
                UNAVAILABLE
              </div>
            )}
            
            {/* Discount Percentage Badge */}
            {item.isOnDiscount && item.discountPrice && (
              <div className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 bg-mb-red text-white text-xs font-sans font-semibold tracking-wide uppercase px-1.5 py-0.5 sm:px-2 sm:py-1">
                {Math.round(((item.basePrice - item.discountPrice) / item.basePrice) * 100)}% OFF
              </div>
            )}
          </div>
          
          {/* Content - Right Side */}
          <div className="flex-1 p-3 sm:p-6 flex flex-col justify-between min-w-0">
            {/* Header Section */}
            <div className="mb-3 sm:mb-4">
              <div className="flex items-start justify-between mb-2">
                <h4 className="text-base sm:text-xl font-serif font-semibold text-black leading-tight flex-1 pr-2 truncate">{item.name}</h4>
                {item.variations && item.variations.length > 0 && (
                  <div className="elegant-label text-gray-600 whitespace-nowrap text-xs flex-shrink-0">
                    {item.variations.length} sizes
                  </div>
                )}
              </div>
              
              <p className={`text-xs sm:text-sm leading-relaxed font-sans line-clamp-2 ${!item.available ? 'text-gray-400' : 'text-gray-600'}`}>
                {!item.available ? 'Currently Unavailable' : item.description}
              </p>
            </div>
            
            {/* Bottom Section: Pricing and Actions */}
            <div className="flex items-end justify-between gap-2">
              {/* Pricing */}
              <div className="flex-1 min-w-0">
                {item.isOnDiscount && item.discountPrice ? (
                  <div className="space-y-1">
                    <div className="flex items-baseline gap-1 sm:gap-2">
                      <span className="text-lg sm:text-2xl font-serif font-semibold text-mb-red">
                        ₱{item.discountPrice.toFixed(2)}
                      </span>
                      <span className="text-xs sm:text-base text-gray-400 line-through font-sans">
                        ₱{item.basePrice.toFixed(2)}
                      </span>
                    </div>
                    <div className="text-xs text-mb-red font-sans font-medium tracking-wide uppercase">
                      Save ₱{(item.basePrice - item.discountPrice).toFixed(2)}
                    </div>
                  </div>
                ) : (
                  <div className="text-lg sm:text-2xl font-serif font-semibold text-black">
                    ₱{item.basePrice.toFixed(2)}
                  </div>
                )}
                
                {item.variations && item.variations.length > 0 && (
                  <div className="text-xs text-gray-500 mt-1 font-sans">
                    Starting price
                  </div>
                )}
              </div>
              
              {/* Action Buttons */}
              <div className="flex-shrink-0">
                {!item.available ? (
                  <button
                    disabled
                    className="btn-subtle text-gray-400 cursor-not-allowed opacity-50 text-xs sm:text-sm py-1.5 sm:py-2 px-2 sm:px-4"
                  >
                    Unavailable
                  </button>
                ) : quantity === 0 ? (
                  <button
                    onClick={handleAddToCart}
                    className="btn-primary text-xs sm:text-sm py-1.5 sm:py-2 px-2 sm:px-4"
                  >
                    {item.variations?.length || item.addOns?.length ? 'Customize' : 'Add'}
                  </button>
                ) : (
                  <div className="flex items-center gap-1 sm:gap-2 border border-gray-300 p-0.5 sm:p-1">
                    <button
                      onClick={handleDecrement}
                      className="p-1 sm:p-2 hover:bg-gray-100 transition-all duration-200"
                    >
                      <Minus className="h-3 w-3 sm:h-4 sm:w-4 text-black" />
                    </button>
                    <span className="font-sans font-semibold text-black min-w-[24px] sm:min-w-[32px] text-center text-sm sm:text-base">{quantity}</span>
                    <button
                      onClick={handleIncrement}
                      className="p-1 sm:p-2 hover:bg-gray-100 transition-all duration-200"
                    >
                      <Plus className="h-3 w-3 sm:h-4 sm:w-4 text-black" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Add-ons indicator */}
            {item.addOns && item.addOns.length > 0 && (
              <div className="flex items-center gap-1 text-xs text-gray-600 border-t border-gray-200 pt-2 sm:pt-3 mt-2 sm:mt-3 font-sans">
                <span className="text-mb-yellow">+</span>
                <span>{item.addOns.length} add-on{item.addOns.length > 1 ? 's' : ''} available</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Customization Modal */}
      {showCustomization && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white max-w-lg w-full max-h-[90vh] overflow-y-auto elegant-shadow-xl">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-8 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-serif font-semibold text-black tracking-luxury">Customize {item.name}</h3>
                <p className="text-sm text-gray-500 mt-2 font-sans">Select your preferred options</p>
              </div>
              <button
                onClick={() => setShowCustomization(false)}
                className="p-2 hover:bg-gray-100 transition-colors duration-300"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <div className="p-8">
              {/* Size Variations */}
              {item.variations && item.variations.length > 0 && (
                <div className="mb-8">
                  <h4 className="elegant-label mb-5">Choose Size</h4>
                  <div className="space-y-3">
                    {item.variations.map((variation) => (
                      <label
                        key={variation.id}
                        className={`flex items-center justify-between p-5 border cursor-pointer transition-all duration-300 ${
                          selectedVariation?.id === variation.id
                            ? 'border-black bg-gray-50'
                            : 'border-gray-200 hover:border-gray-400'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <input
                            type="radio"
                            name="variation"
                            checked={selectedVariation?.id === variation.id}
                            onChange={() => setSelectedVariation(variation)}
                            className="text-black focus:ring-black"
                          />
                          <span className="font-sans font-medium text-black">{variation.name}</span>
                        </div>
                        <span className="font-serif font-semibold text-black">
                          ₱{((item.effectivePrice || item.basePrice) + variation.price).toFixed(2)}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Add-ons */}
              {groupedAddOns && Object.keys(groupedAddOns).length > 0 && (
                <div className="mb-8">
                  <h4 className="elegant-label mb-5">Add-ons</h4>
                  {Object.entries(groupedAddOns).map(([category, addOns]) => (
                    <div key={category} className="mb-6">
                      <h5 className="elegant-label text-gray-600 mb-4 capitalize">
                        {category.replace('-', ' ')}
                      </h5>
                      <div className="space-y-3">
                        {addOns.map((addOn) => (
                          <div
                            key={addOn.id}
                            className="flex items-center justify-between p-4 border border-gray-200 hover:border-gray-300 transition-all duration-300"
                          >
                            <div className="flex-1">
                              <span className="font-sans font-medium text-black">{addOn.name}</span>
                              <div className="text-sm text-gray-600 font-sans mt-0.5">
                                {addOn.price > 0 ? `₱${addOn.price.toFixed(2)} each` : 'Complimentary'}
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              {selectedAddOns.find(a => a.id === addOn.id) ? (
                                <div className="flex items-center gap-2 border border-gray-300 p-1">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const current = selectedAddOns.find(a => a.id === addOn.id);
                                      updateAddOnQuantity(addOn, (current?.quantity || 1) - 1);
                                    }}
                                    className="p-1.5 hover:bg-gray-100 transition-colors duration-200"
                                  >
                                    <Minus className="h-3 w-3 text-black" />
                                  </button>
                                  <span className="font-sans font-semibold text-black min-w-[28px] text-center">
                                    {selectedAddOns.find(a => a.id === addOn.id)?.quantity || 0}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const current = selectedAddOns.find(a => a.id === addOn.id);
                                      updateAddOnQuantity(addOn, (current?.quantity || 0) + 1);
                                    }}
                                    className="p-1.5 hover:bg-gray-100 transition-colors duration-200"
                                  >
                                    <Plus className="h-3 w-3 text-black" />
                                  </button>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => updateAddOnQuantity(addOn, 1)}
                                  className="btn-secondary text-xs py-2"
                                >
                                  Add
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Price Summary */}
              <div className="premium-divider pt-6 mb-6">
                <div className="flex items-center justify-between">
                  <span className="elegant-label">Total</span>
                  <span className="text-3xl font-serif font-semibold text-mb-red">₱{calculatePrice().toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleCustomizedAddToCart}
                className="w-full btn-primary py-4 flex items-center justify-center gap-3"
              >
                <ShoppingCart className="h-5 w-5" />
                <span>Add to Cart</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MenuItemCard;
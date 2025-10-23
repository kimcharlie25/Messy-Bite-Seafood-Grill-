import React from 'react';
import { Trash2, Plus, Minus, ArrowLeft } from 'lucide-react';
import { CartItem } from '../types';

interface CartProps {
  cartItems: CartItem[];
  updateQuantity: (id: string, quantity: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  onContinueShopping: () => void;
  onCheckout: () => void;
}

const Cart: React.FC<CartProps> = ({
  cartItems,
  updateQuantity,
  removeFromCart,
  clearCart,
  getTotalPrice,
  onContinueShopping,
  onCheckout
}) => {
  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 py-20">
        <div className="text-center py-20 border border-gray-200 bg-gray-50">
          <div className="text-7xl mb-8 opacity-20">🦞</div>
          <h2 className="text-3xl font-serif font-semibold text-black mb-4 tracking-luxury">Your Cart is Empty</h2>
          <p className="text-base font-sans text-gray-600 mb-10 max-w-md mx-auto">Discover our menu and add some delicious items to get started.</p>
          <button
            onClick={onContinueShopping}
            className="btn-primary"
          >
            Browse Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12 py-12">
      <div className="flex items-center justify-between mb-12 pb-6 border-b border-gray-200">
        <button
          onClick={onContinueShopping}
          className="flex items-center gap-2 text-black hover:text-mb-red transition-colors duration-300 font-sans"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Continue Shopping</span>
        </button>
        <h1 className="text-4xl font-serif font-semibold text-black tracking-luxury">Your Cart</h1>
        <button
          onClick={clearCart}
          className="text-sm font-sans text-gray-600 hover:text-mb-red transition-colors duration-300 tracking-wide uppercase"
        >
          Clear All
        </button>
      </div>

      <div className="bg-white border border-gray-200 mb-8">
        {cartItems.map((item, index) => (
          <div key={item.id} className={`p-8 ${index !== cartItems.length - 1 ? 'border-b border-gray-200' : ''}`}>
            <div className="flex items-center justify-between gap-6">
              <div className="flex-1">
                <h3 className="text-xl font-serif font-semibold text-black mb-2">{item.name}</h3>
                {item.selectedVariation && (
                  <p className="text-sm text-gray-600 mb-1 font-sans">Size: {item.selectedVariation.name}</p>
                )}
                {item.selectedAddOns && item.selectedAddOns.length > 0 && (
                  <p className="text-sm text-gray-600 mb-1 font-sans">
                    Add-ons: {item.selectedAddOns.map(addOn => 
                      addOn.quantity && addOn.quantity > 1 
                        ? `${addOn.name} ×${addOn.quantity}`
                        : addOn.name
                    ).join(', ')}
                  </p>
                )}
                <p className="text-base font-sans text-gray-500 mt-2">₱{item.totalPrice.toFixed(2)} each</p>
              </div>
              
              <div className="flex items-center gap-8">
                <div className="flex items-center gap-3 border border-gray-300 p-1">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="p-2 hover:bg-gray-100 transition-all duration-200"
                  >
                    <Minus className="h-4 w-4 text-black" />
                  </button>
                  <span className="font-sans font-semibold text-black min-w-[32px] text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="p-2 hover:bg-gray-100 transition-all duration-200"
                  >
                    <Plus className="h-4 w-4 text-black" />
                  </button>
                </div>
                
                <div className="text-right min-w-[100px]">
                  <p className="text-xl font-serif font-semibold text-black">₱{(item.totalPrice * item.quantity).toFixed(2)}</p>
                </div>
                
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="p-2 text-gray-400 hover:text-mb-red hover:bg-gray-50 transition-all duration-300"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-gray-200 p-8">
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-200">
          <span className="elegant-label">Total</span>
          <span className="text-4xl font-serif font-semibold text-black">₱{parseFloat(getTotalPrice() || 0).toFixed(2)}</span>
        </div>
        
        <button
          onClick={onCheckout}
          className="w-full btn-primary py-4 text-base"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;
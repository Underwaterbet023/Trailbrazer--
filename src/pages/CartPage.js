import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { hasActiveBooking } from '../utils/bookingStorage';

function CartPage() {
  const { cartItems, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    // Check if user has active booking
    if (hasActiveBooking()) {
      alert('You have an active booking. Please complete or delete your current trip before making a new booking.');
      return;
    }

    if (cartItems.length === 0) {
      alert('Your cart is empty. Please add items to proceed.');
      return;
    }

    // Calculate total amount
    const totalPrice = cartItems.reduce((total, item) => total + (item.price || 0), 0);
    const taxes = Math.round(totalPrice * 0.18);
    const totalAmount = totalPrice + taxes;

    // Create cart booking details
    const cartBookingDetails = {
      id: `CART-${Date.now().toString().slice(-6)}`,
      type: 'Cart Items',
      name: `Multiple Items (${cartItems.length})`,
      price: totalAmount,
      date: new Date().toISOString().split('T')[0],
      items: cartItems,
      status: 'Pending Payment',
      details: {
        'Booking ID': `CART-${Date.now().toString().slice(-6)}`,
        'Items Count': cartItems.length,
        'Subtotal': `₹${totalPrice}`,
        'Taxes & Fees': `₹${taxes}`,
        'Total Amount': `₹${totalAmount}`,
        'Payment': 'Pending'
      }
    };

    // Navigate to payment page with cart booking details
    navigate('/payment', {
      state: {
        bookingDetails: cartBookingDetails,
        totalAmount: totalAmount,
        bookingType: 'Cart Items',
        cartItems: cartItems
      }
    });
  };
  
  // Calculate total price
  const totalPrice = cartItems.reduce((total, item) => total + (item.price || 0), 0);
  
  // Group items by type
  const groupedItems = cartItems.reduce((acc, item) => {
    if (!acc[item.type]) {
      acc[item.type] = [];
    }
    acc[item.type].push(item);
    return acc;
  }, {});
  
  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center py-16">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Your Trip Cart is Empty</h2>
          <p className="text-lg text-gray-600 mb-8">Start adding attractions, packages, and services to plan your perfect trip!</p>
          <Link to="/recommendations" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700">
            Browse Recommendations
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Your Trip Cart</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3">
          {Object.entries(groupedItems).map(([type, items]) => (
            <div key={type} className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 capitalize">{type}s</h2>
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                  {items.map((item) => (
                    <li key={`${item.type}-${item.id}`} className="px-6 py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          {item.image && (
                            <div className="flex-shrink-0 h-16 w-16 mr-4">
                              <img className="h-16 w-16 rounded-md object-cover" src={item.image} alt={item.name} />
                            </div>
                          )}
                          <div>
                            <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                            <p className="text-sm text-gray-500">{item.description}</p>
                            {item.location && <p className="text-sm text-gray-500">{item.location}</p>}
                            {item.date && <p className="text-sm text-gray-500">Date: {item.date}</p>}
                          </div>
                        </div>
                        <div className="flex items-center">
                          {item.price && (
                            <span className="text-lg font-medium text-gray-900 mr-4">₹{item.price}</span>
                          )}
                          <button
                            onClick={() => removeFromCart(item.id, item.type)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
          
          <div className="flex justify-end mt-6">
            <button
              onClick={clearCart}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Clear Cart
            </button>
          </div>
        </div>
        
        <div className="lg:w-1/3">
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Trip Summary</h3>
              <div className="mt-5">
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600">Items in cart</span>
                  <span className="font-medium">{cartItems.length}</span>
                </div>
                {totalPrice > 0 && (
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">₹{totalPrice}</span>
                  </div>
                )}
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600">Taxes & Fees</span>
                  <span className="font-medium">₹{Math.round(totalPrice * 0.18)}</span>
                </div>
                <div className="flex justify-between py-4 font-bold">
                  <span>Total</span>
                  <span>₹{totalPrice + Math.round(totalPrice * 0.18)}</span>
                </div>
                <div className="mt-6">
                  <button
                    onClick={handleCheckout}
                    className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
                  >
                    Proceed to Checkout
                  </button>
                  <Link
                    to="/recommendations"
                    className="w-full mt-3 inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartPage;
import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  
  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem('tripCart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Failed to parse cart from localStorage:', error);
        setCartItems([]);
      }
    }
  }, []);
  
  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('tripCart', JSON.stringify(cartItems));
  }, [cartItems]);
  
  // Add item to cart
  const addToCart = (item) => {
    // Check if item already exists in cart
    const existingItem = cartItems.find(cartItem => 
      cartItem.id === item.id && cartItem.type === item.type
    );
    
    if (existingItem) {
      // If item exists, show notification but don't add duplicate
      return false;
    } else {
      // Add new item to cart
      setCartItems(prevItems => [...prevItems, { ...item, addedAt: new Date().toISOString() }]);
      return true;
    }
  };
  
  // Remove item from cart
  const removeFromCart = (id, type) => {
    setCartItems(prevItems => 
      prevItems.filter(item => !(item.id === id && item.type === type))
    );
  };
  
  // Clear entire cart
  const clearCart = () => {
    setCartItems([]);
  };
  
  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    clearCart
  };
  
  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export default CartContext;
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

// Helper to transform server cart data to UI format
const transformServerCart = (serverCart) => {
  return serverCart
    .filter((item) => item.product) // skip if product was deleted
    .map((item) => ({
      _id: item.product._id,
      name: item.product.name,
      price: item.product.price,
      images: item.product.images,
      description: item.product.description,
      category: item.product.category,
      brand: item.product.brand,
      stockQuantity: item.product.stockQuantity,
      quantity: item.quantity,
    }));
};

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { user } = useAuth();

  // Get token helper
  const getToken = useCallback(() => {
    if (user && user.token) return user.token;
    const stored = localStorage.getItem('userInfo');
    if (stored) {
      try {
        return JSON.parse(stored).token;
      } catch {
        return null;
      }
    }
    return null;
  }, [user]);

  const isLoggedIn = useCallback(() => !!getToken(), [getToken]);

  // Load cart on mount or when user changes
  useEffect(() => {
    const token = getToken();
    if (token) {
      // Logged in — fetch cart from backend
      fetch('/api/cart', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setCartItems(transformServerCart(data));
          }
        })
        .catch((err) => console.error('Failed to fetch cart:', err));
    } else {
      // Guest — load from localStorage
      const saved = localStorage.getItem('guestCart');
      if (saved) {
        try {
          setCartItems(JSON.parse(saved));
        } catch {
          setCartItems([]);
        }
      } else {
        setCartItems([]);
      }
    }
  }, [user, getToken]);

  // Save guest cart to localStorage whenever it changes (only for guests)
  useEffect(() => {
    if (!isLoggedIn()) {
      localStorage.setItem('guestCart', JSON.stringify(cartItems));
    }
  }, [cartItems, isLoggedIn]);

  const addToCart = async (item) => {
    const token = getToken();
    if (token) {
      // Logged in — sync to backend
      try {
        const res = await fetch('/api/cart', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ productId: item._id, quantity: 1 }),
        });
        const data = await res.json();
        if (res.ok && Array.isArray(data)) {
          setCartItems(transformServerCart(data));
        } else {
          alert(data.message || 'Cart API error');
          console.error('Cart API error:', data);
        }
      } catch (error) {
        console.error('Failed to add to cart:', error);
      }
    } else {
      // Guest — local state
      setCartItems((prev) => {
        const existing = prev.find((i) => i._id === item._id);
        if (existing) {
          if (existing.quantity >= item.stockQuantity) {
            alert('Cannot add more than available stock');
            return prev;
          }
          return prev.map((i) =>
            i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i
          );
        }
        if (1 > item.stockQuantity) {
          alert('Out of stock');
          return prev;
        }
        return [...prev, { ...item, quantity: 1 }];
      });
    }
    setIsCartOpen(true);
  };

  const removeFromCart = async (productId) => {
    const token = getToken();
    if (token) {
      try {
        const res = await fetch(`/api/cart/${productId}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (Array.isArray(data)) {
          setCartItems(transformServerCart(data));
        }
      } catch (error) {
        console.error('Failed to remove from cart:', error);
      }
    } else {
      setCartItems((prev) => prev.filter((item) => item._id !== productId));
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    const item = cartItems.find((i) => i._id === productId);
    if (item && newQuantity > item.stockQuantity) {
      alert('Cannot add more than available stock');
      return;
    }

    if (newQuantity <= 0) {
      return removeFromCart(productId);
    }

    const token = getToken();
    if (token) {
      try {
        const res = await fetch(`/api/cart/${productId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ quantity: newQuantity }),
        });
        const data = await res.json();
        if (res.ok && Array.isArray(data)) {
          setCartItems(transformServerCart(data));
        } else {
          alert(data.message || 'Failed to update quantity');
        }
      } catch (error) {
        console.error('Failed to update cart quantity:', error);
      }
    } else {
      setCartItems((prev) =>
        prev.map((i) =>
          i._id === productId ? { ...i, quantity: newQuantity } : i
        )
      );
    }
  };

  const clearCart = async () => {
    const token = getToken();
    if (token) {
      try {
        await fetch('/api/cart', {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });
        setCartItems([]);
      } catch (error) {
        console.error('Failed to clear cart:', error);
      }
    } else {
      setCartItems([]);
    }
  };

  const cartTotal = cartItems.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);

  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        clearCart,
        updateQuantity,
        cartTotal,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);

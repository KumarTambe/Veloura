import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { API_URL } from '../config/api';

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

const readGuestCart = () => {
  try {
    return JSON.parse(localStorage.getItem('guestCart')) || [];
  } catch {
    return [];
  }
};

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { user } = useAuth();

  const token = user?.token || null;

  const getToken = useCallback(() => token, [token]);
  const isLoggedIn = useCallback(() => !!token, [token]);

  // When the logged-in user changes, swap carts during render (no effect needed):
  // guests read localStorage, logged-in users start empty until the fetch below lands
  const [cartOwner, setCartOwner] = useState(undefined);
  if (cartOwner !== token) {
    setCartOwner(token);
    setCartItems(token ? [] : readGuestCart());
  }

  // Logged in — fetch cart from backend
  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    fetch(`${API_URL}/api/cart`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled && Array.isArray(data)) {
          setCartItems(transformServerCart(data));
        }
      })
      .catch((err) => console.error('Failed to fetch cart:', err));
    return () => {
      cancelled = true;
    };
  }, [token]);

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
        const res = await fetch(`${API_URL}/api/cart`, {
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
        const res = await fetch(`${API_URL}/api/cart/${productId}`, {
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
        const res = await fetch(`${API_URL}/api/cart/${productId}`, {
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
        await fetch(`${API_URL}/api/cart`, {
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

  // Server already emptied the cart (e.g. after a verified payment); just sync the UI
  const resetCart = () => setCartItems([]);

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
        resetCart,
        updateQuantity,
        cartTotal,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => useContext(CartContext);

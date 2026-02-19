import { createContext, useContext, useMemo, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  function addToCart(product, qty = 1) {
    setCartItems((prev) => {
      const exist = prev.find((x) => x.id === product.id);
      if (exist) {
        return prev.map((x) => (x.id === product.id ? { ...x, qty: x.qty + qty } : x));
      }
      return [...prev, { ...product, qty }];
    });
  }

  function removeFromCart(id) {
    setCartItems((prev) => prev.filter((x) => x.id !== id));
  }

  function updateQty(id, qty) {
    if (qty <= 0) return;
    setCartItems((prev) => prev.map((x) => (x.id === id ? { ...x, qty } : x)));
  }

  function clearCart() {
    setCartItems([]);
  }

  const getTotal = () =>
    cartItems.reduce((sum, it) => sum + Number(it.price || 0) * Number(it.qty || 1), 0);

  const value = useMemo(
    () => ({ cartItems, addToCart, removeFromCart, updateQty, clearCart, getTotal }),
    [cartItems]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

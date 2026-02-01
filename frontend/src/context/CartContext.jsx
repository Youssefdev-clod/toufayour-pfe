import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);

const STORAGE_KEY = "toufayour_cart_v1";

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addToCart = (product, qty = 1) => {
    setItems((prev) => {
      const exist = prev.find((x) => x.id === product.id);
      if (exist) {
        return prev.map((x) => (x.id === product.id ? { ...x, qty: x.qty + qty } : x));
      }
      return [...prev, { ...product, qty }];
    });
  };

  const removeFromCart = (id) => {
    setItems((prev) => prev.filter((x) => x.id !== id));
  };

  const setQty = (id, qty) => {
    const n = Number(qty);
    if (Number.isNaN(n)) return;
    setItems((prev) =>
      prev
        .map((x) => (x.id === id ? { ...x, qty: Math.max(1, Math.min(99, n)) } : x))
    );
  };

  const clearCart = () => setItems([]);

  const total = useMemo(() => {
    return items.reduce((sum, x) => sum + Number(x.price || 0) * Number(x.qty || 1), 0);
  }, [items]);

  const count = useMemo(() => items.reduce((sum, x) => sum + Number(x.qty || 1), 0), [items]);

  const value = {
    items,
    addToCart,
    removeFromCart,
    setQty,
    clearCart,
    total,
    count,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}

import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();
export const useCartContext = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const stored = localStorage.getItem("floriva_cart");
      return stored ? JSON.parse(stored) : [];
    } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem("floriva_cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (flower) => {
    setCartItems((prev) => {
      const exist = prev.find((i) => i._id === flower._id);
      if (exist) {
        return prev.map((i) =>
          i._id === flower._id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      const basePrice = flower.pricePerStem ?? flower.priceRange?.min ?? flower.price ?? 0;
      const fillerPrice = flower.filler?.price || 0;
      return [...prev, {
        _id: flower._id,
        name: flower.name,
        basePrice,
        fillerPrice,
        image: flower.image || null,
        category: flower.category || "",
        color: flower.color || "",
        emotion: flower.emotion || "",
        city: flower.city || "",
        quantity: 1,
        filler: flower.filler || null,
        postcard: flower.postcard || null,
      }];
    });
  };

  const removeFromCart = (id) =>
    setCartItems((prev) => prev.filter((i) => i._id !== id));

  const updateQuantity = (id, type) =>
    setCartItems((prev) =>
      prev.map((i) =>
        i._id === id
          ? { ...i, quantity: type === "inc" ? i.quantity + 1 : Math.max(1, i.quantity - 1) }
          : i
      )
    );

  const updateCartItem = (id, updates) =>
    setCartItems(prev => prev.map(i => i._id === id ? { ...i, ...updates } : i));

  const clearCart = () => setCartItems([]);

  const cartCount = cartItems.reduce((s, i) => s + i.quantity, 0);
  const totalPrice = cartItems.reduce((s, i) => {
    const fillerPrice = i.filler?.price || i.fillerPrice || 0;
    return s + (i.basePrice + fillerPrice) * i.quantity;
  }, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, updateCartItem, clearCart, cartCount, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
};

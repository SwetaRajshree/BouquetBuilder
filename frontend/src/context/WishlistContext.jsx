import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

const WishlistContext = createContext();
export const useWishlist = () => useContext(WishlistContext);

export function WishlistProvider({ children }) {
  const { user } = useAuth();
  const key = user ? `floriva_wishlist_${user._id || user.id}` : "floriva_wishlist_guest";

  const [wishlist, setWishlist] = useState(() => {
    try { return JSON.parse(localStorage.getItem(key)) || []; }
    catch { return []; }
  });

  // Re-load when user changes (login/logout)
  useEffect(() => {
    try { setWishlist(JSON.parse(localStorage.getItem(key)) || []); }
    catch { setWishlist([]); }
  }, [key]);

  // Persist on every change
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(wishlist));
  }, [wishlist, key]);

  const toggle = (item) => {
    setWishlist(prev => {
      const exists = prev.find(w => w._id === item._id);
      return exists ? prev.filter(w => w._id !== item._id) : [...prev, item];
    });
  };

  const has = (id) => wishlist.some(w => w._id === id);

  return (
    <WishlistContext.Provider value={{ wishlist, toggle, has }}>
      {children}
    </WishlistContext.Provider>
  );
}

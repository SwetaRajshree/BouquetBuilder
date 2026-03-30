import { useState } from 'react';
import { INITIAL_CART } from '../data/mockData';

export function useCart() {
  const [items, setItems] = useState(INITIAL_CART);

  const addItem  = item  => setItems(prev => [...prev, { ...item, id: Date.now() }]);
  const removeItem = id  => setItems(prev => prev.filter(i => i.id !== id));
  const clearCart = ()   => setItems([]);

  const total    = items.reduce((s, i) => s + i.price, 0);
  const count    = items.length;

  return { items, addItem, removeItem, clearCart, total, count };
}

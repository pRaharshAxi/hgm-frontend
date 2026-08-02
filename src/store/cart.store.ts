import { create } from 'zustand';

export type CartItem = {
  id: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
  supplierId: string;
  supplierName?: string;
  available: number;
};

type CartState = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  itemCount: () => number;
};

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  addItem: (item) => {
    set((state) => {
      const existing = state.items.find((entry) => entry.id === item.id);
      if (existing) {
        return {
          items: state.items.map((entry) =>
            entry.id === item.id
              ? { ...entry, quantity: Math.min(entry.quantity + item.quantity, entry.available) }
              : entry,
          ),
        };
      }

      return {
        items: [...state.items, item],
      };
    });
  },
  updateQuantity: (id, quantity) => {
    set((state) => ({
      items: state.items
        .map((item) => {
          if (item.id !== id) {
            return item;
          }

          return { ...item, quantity: Math.max(1, Math.min(quantity, item.available)) };
        })
        .filter((item) => item.quantity > 0),
    }));
  },
  removeItem: (id) => {
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    }));
  },
  clearCart: () => {
    set({ items: [] });
  },
  itemCount: () => get().items.reduce((count, item) => count + item.quantity, 0),
}));

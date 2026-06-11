import { create } from 'zustand';
import type { MenuItem } from '../data/menuData';
import { loadMenuFromStorage, saveMenuToStorage } from '../data/menuData';

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}

interface AppState {
  menu: MenuItem[];
  cart: CartItem[];
  isCheckoutOpen: boolean;

  updateMenuItem: (id: string, patch: Partial<MenuItem>) => void;

  addToCart: (item: MenuItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  clearCart: () => void;

  openCheckout: () => void;
  closeCheckout: () => void;

  cartTotal: () => number;
  cartCount: () => number;
}

export const useAppStore = create<AppState>((set, get) => ({
  menu: loadMenuFromStorage(),
  cart: [],
  isCheckoutOpen: false,

  updateMenuItem: (id, patch) => {
    const next = get().menu.map((item) =>
      item.id === id ? { ...item, ...patch } : item
    );
    saveMenuToStorage(next);
    set({ menu: next });
  },

  addToCart: (menuItem) => {
    const cart = get().cart;
    const existing = cart.find((c) => c.menuItem.id === menuItem.id);
    if (existing) {
      set({
        cart: cart.map((c) =>
          c.menuItem.id === menuItem.id
            ? { ...c, quantity: c.quantity + 1 }
            : c
        ),
      });
    } else {
      set({ cart: [...cart, { menuItem, quantity: 1 }] });
    }
  },

  removeFromCart: (id) => {
    set({ cart: get().cart.filter((c) => c.menuItem.id !== id) });
  },

  updateQuantity: (id, qty) => {
    if (qty <= 0) {
      get().removeFromCart(id);
      return;
    }
    set({
      cart: get().cart.map((c) =>
        c.menuItem.id === id ? { ...c, quantity: qty } : c
      ),
    });
  },

  clearCart: () => set({ cart: [] }),
  openCheckout: () => set({ isCheckoutOpen: true }),
  closeCheckout: () => set({ isCheckoutOpen: false }),

  cartTotal: () =>
    get().cart.reduce((sum, c) => sum + c.menuItem.price * c.quantity, 0),

  cartCount: () =>
    get().cart.reduce((sum, c) => sum + c.quantity, 0),
}));

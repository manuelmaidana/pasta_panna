import { create } from 'zustand';
import type { MenuItem, MenuCategory, DishOfDay, DeliveryZone, SiteContent } from '../data/menuData';
import {
  DEFAULT_MENU, DEFAULT_CATEGORIES, DEFAULT_DISH_OF_DAY,
  DEFAULT_DELIVERY_ZONES, DEFAULT_SITE_CONTENT,
} from '../data/menuData';
import {
  saveMenu, saveCategories, saveDishOfDay,
  saveDeliveryZones, saveSiteContent,
} from '../lib/firestoreService';

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}

interface AppState {
  menu: MenuItem[];
  categories: MenuCategory[];
  dishOfDay: DishOfDay;
  deliveryZones: DeliveryZone[];
  siteContent: SiteContent;
  cart: CartItem[];
  isCheckoutOpen: boolean;
  isLoading: boolean;

  addMenuItem: (item: MenuItem) => void;
  updateMenuItem: (id: string, patch: Partial<MenuItem>) => void;
  removeMenuItem: (id: string) => void;

  addCategory: (label: string, emoji: string) => void;
  updateCategory: (id: string, patch: Partial<MenuCategory>) => void;
  removeCategory: (id: string) => void;

  setDishOfDay: (dod: DishOfDay) => void;

  addDeliveryZone: (name: string, price: number) => void;
  updateDeliveryZone: (id: string, patch: Partial<Omit<DeliveryZone, 'id'>>) => void;
  removeDeliveryZone: (id: string) => void;

  setSiteContent: (content: SiteContent) => void;

  addToCart: (item: MenuItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  clearCart: () => void;

  openCheckout: () => void;
  closeCheckout: () => void;

  cartTotal: () => number;
  cartCount: () => number;

  // internal setters called by Firestore onSnapshot listeners
  _applyMenu: (items: MenuItem[]) => void;
  _applyCategories: (cats: MenuCategory[]) => void;
  _applyDishOfDay: (dod: DishOfDay) => void;
  _applyDeliveryZones: (zones: DeliveryZone[]) => void;
  _applySiteContent: (content: SiteContent) => void;
  _setLoading: (v: boolean) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  menu: DEFAULT_MENU,
  categories: DEFAULT_CATEGORIES,
  dishOfDay: DEFAULT_DISH_OF_DAY,
  deliveryZones: DEFAULT_DELIVERY_ZONES,
  siteContent: DEFAULT_SITE_CONTENT,
  cart: [],
  isCheckoutOpen: false,
  isLoading: true,

  addMenuItem: (item) => {
    const next = [...get().menu, item];
    set({ menu: next });
    void saveMenu(next);
  },

  updateMenuItem: (id, patch) => {
    const next = get().menu.map((item) => item.id === id ? { ...item, ...patch } : item);
    set({ menu: next });
    void saveMenu(next);
  },

  removeMenuItem: (id) => {
    const next = get().menu.filter((m) => m.id !== id);
    const dod = get().dishOfDay;
    if (dod.itemId === id) {
      const newDod = { enabled: false, itemId: null };
      set({ menu: next, dishOfDay: newDod });
      void saveMenu(next);
      void saveDishOfDay(newDod);
    } else {
      set({ menu: next });
      void saveMenu(next);
    }
  },

  addCategory: (label, emoji) => {
    const id = `cat_${Date.now()}`;
    const next = [...get().categories, { id, label, emoji }];
    set({ categories: next });
    void saveCategories(next);
  },

  updateCategory: (id, patch) => {
    const next = get().categories.map((c) => c.id === id ? { ...c, ...patch } : c);
    set({ categories: next });
    void saveCategories(next);
  },

  removeCategory: (id) => {
    const nextMenu = get().menu.filter((m) => m.category !== id);
    const nextCats = get().categories.filter((c) => c.id !== id);
    set({ menu: nextMenu, categories: nextCats });
    void saveMenu(nextMenu);
    void saveCategories(nextCats);
  },

  setDishOfDay: (dod) => {
    set({ dishOfDay: dod });
    void saveDishOfDay(dod);
  },

  addDeliveryZone: (name, price) => {
    const next = [...get().deliveryZones, { id: `zone_${Date.now()}`, name, price }];
    set({ deliveryZones: next });
    void saveDeliveryZones(next);
  },

  updateDeliveryZone: (id, patch) => {
    const next = get().deliveryZones.map((z) => z.id === id ? { ...z, ...patch } : z);
    set({ deliveryZones: next });
    void saveDeliveryZones(next);
  },

  removeDeliveryZone: (id) => {
    const next = get().deliveryZones.filter((z) => z.id !== id);
    set({ deliveryZones: next });
    void saveDeliveryZones(next);
  },

  setSiteContent: (content) => {
    set({ siteContent: content });
    void saveSiteContent(content);
  },

  addToCart: (menuItem) => {
    const cart = get().cart;
    const existing = cart.find((c) => c.menuItem.id === menuItem.id);
    if (existing) {
      set({ cart: cart.map((c) => c.menuItem.id === menuItem.id ? { ...c, quantity: c.quantity + 1 } : c) });
    } else {
      set({ cart: [...cart, { menuItem, quantity: 1 }] });
    }
  },

  removeFromCart: (id) => set({ cart: get().cart.filter((c) => c.menuItem.id !== id) }),

  updateQuantity: (id, qty) => {
    if (qty <= 0) { get().removeFromCart(id); return; }
    set({ cart: get().cart.map((c) => c.menuItem.id === id ? { ...c, quantity: qty } : c) });
  },

  clearCart: () => set({ cart: [] }),
  openCheckout: () => set({ isCheckoutOpen: true }),
  closeCheckout: () => set({ isCheckoutOpen: false }),

  cartTotal: () => get().cart.reduce((sum, c) => sum + c.menuItem.price * c.quantity, 0),
  cartCount: () => get().cart.reduce((sum, c) => sum + c.quantity, 0),

  _applyMenu: (items) => set({ menu: items }),
  _applyCategories: (cats) => set({ categories: cats }),
  _applyDishOfDay: (dod) => set({ dishOfDay: dod }),
  _applyDeliveryZones: (zones) => set({ deliveryZones: zones }),
  _applySiteContent: (content) => set({ siteContent: content }),
  _setLoading: (isLoading) => set({ isLoading }),
}));

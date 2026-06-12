import { create } from 'zustand';
import type { MenuItem, MenuCategory, DishOfDay, DeliveryZone, SiteContent } from '../data/menuData';
import {
  loadMenuFromStorage, saveMenuToStorage,
  loadCategoriesFromStorage, saveCategoriesToStorage,
  loadDishOfDayFromStorage, saveDishOfDayToStorage,
  loadDeliveryZonesFromStorage, saveDeliveryZonesToStorage,
  loadSiteContentFromStorage, saveSiteContentToStorage,
} from '../data/menuData';

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
}

export const useAppStore = create<AppState>((set, get) => ({
  menu: loadMenuFromStorage(),
  categories: loadCategoriesFromStorage(),
  dishOfDay: loadDishOfDayFromStorage(),
  deliveryZones: loadDeliveryZonesFromStorage(),
  siteContent: loadSiteContentFromStorage(),
  cart: [],
  isCheckoutOpen: false,

  addMenuItem: (item) => {
    const next = [...get().menu, item];
    saveMenuToStorage(next);
    set({ menu: next });
  },

  updateMenuItem: (id, patch) => {
    const next = get().menu.map((item) =>
      item.id === id ? { ...item, ...patch } : item
    );
    saveMenuToStorage(next);
    set({ menu: next });
  },

  removeMenuItem: (id) => {
    const next = get().menu.filter((m) => m.id !== id);
    saveMenuToStorage(next);
    const dod = get().dishOfDay;
    if (dod.itemId === id) {
      const newDod = { enabled: false, itemId: null };
      saveDishOfDayToStorage(newDod);
      set({ menu: next, dishOfDay: newDod });
    } else {
      set({ menu: next });
    }
  },

  addCategory: (label, emoji) => {
    const id = `cat_${Date.now()}`;
    const next = [...get().categories, { id, label, emoji }];
    saveCategoriesToStorage(next);
    set({ categories: next });
  },

  updateCategory: (id, patch) => {
    const next = get().categories.map((c) =>
      c.id === id ? { ...c, ...patch } : c
    );
    saveCategoriesToStorage(next);
    set({ categories: next });
  },

  removeCategory: (id) => {
    const nextMenu = get().menu.filter((m) => m.category !== id);
    const nextCats = get().categories.filter((c) => c.id !== id);
    saveMenuToStorage(nextMenu);
    saveCategoriesToStorage(nextCats);
    set({ menu: nextMenu, categories: nextCats });
  },

  setDishOfDay: (dod) => {
    saveDishOfDayToStorage(dod);
    set({ dishOfDay: dod });
  },

  addDeliveryZone: (name, price) => {
    const next = [...get().deliveryZones, { id: `zone_${Date.now()}`, name, price }];
    saveDeliveryZonesToStorage(next);
    set({ deliveryZones: next });
  },

  updateDeliveryZone: (id, patch) => {
    const next = get().deliveryZones.map((z) => (z.id === id ? { ...z, ...patch } : z));
    saveDeliveryZonesToStorage(next);
    set({ deliveryZones: next });
  },

  removeDeliveryZone: (id) => {
    const next = get().deliveryZones.filter((z) => z.id !== id);
    saveDeliveryZonesToStorage(next);
    set({ deliveryZones: next });
  },

  setSiteContent: (content) => {
    saveSiteContentToStorage(content);
    set({ siteContent: content });
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

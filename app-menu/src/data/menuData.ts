export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

export interface MenuCategory {
  id: string;
  label: string;
  emoji: string;
}

export interface DishOfDay {
  enabled: boolean;
  itemId: string | null;
}

export interface DeliveryZone {
  id: string;
  name: string;
  price: number;
}

export const DEFAULT_CATEGORIES: MenuCategory[] = [
  { id: 'principal', label: 'Plato Principal', emoji: '🍝' },
  { id: 'acompanamiento', label: 'Acompañamiento', emoji: '🥗' },
];

export const DEFAULT_MENU: MenuItem[] = [
  {
    id: 'p1',
    name: 'Pasta Panna e Salmone',
    description: 'Penne rigate con salmón ahumado noruego en salsa cremosa de parmesano, alcaparras y eneldo fresco.',
    price: 2500,
    image: 'https://picsum.photos/seed/pasta-salmon-cream/600/400',
    category: 'principal',
  },
  {
    id: 'p2',
    name: 'Risotto ai Funghi',
    description: 'Arroz arborio cremoso con mix de hongos porcini, shiitake y champiñones, vino blanco y parmesano añejo.',
    price: 2800,
    image: 'https://picsum.photos/seed/risotto-mushroom/600/400',
    category: 'principal',
  },
  {
    id: 'p3',
    name: 'Pollo alla Griglia',
    description: 'Pechuga de pollo a la parrilla marinada con hierbas frescas, limón siciliano y aceite de oliva extra virgen.',
    price: 2200,
    image: 'https://picsum.photos/seed/grilled-chicken-herbs/600/400',
    category: 'principal',
  },
  {
    id: 'a1',
    name: 'Insalata Mista',
    description: 'Ensalada de hojas verdes con rúcula, cherry, queso de cabra y vinagreta de limón y mostaza de Dijon.',
    price: 800,
    image: 'https://picsum.photos/seed/mixed-green-salad/600/400',
    category: 'acompanamiento',
  },
  {
    id: 'a2',
    name: 'Patatine al Rosmarino',
    description: 'Papas rústicas al horno con romero fresco, ajo confitado, sal marina y aceite de oliva.',
    price: 700,
    image: 'https://picsum.photos/seed/rosemary-potatoes/600/400',
    category: 'acompanamiento',
  },
];

export const DEFAULT_DISH_OF_DAY: DishOfDay = { enabled: false, itemId: null };

export const DEFAULT_DELIVERY_ZONES: DeliveryZone[] = [];

export interface SiteContent {
  heroTitle: string;
  heroSubtitle: string;
}

export const DEFAULT_SITE_CONTENT: SiteContent = {
  heroTitle: 'Pasta Panna',
  heroSubtitle: 'Cocina italiana artesanal. Seleccioná tus platos y envianos el pedido por WhatsApp.',
};

const MENU_KEY = 'pasta_panna_menu';
const CATEGORIES_KEY = 'pasta_panna_categories';
const DOD_KEY = 'pasta_panna_dod';
const ZONES_KEY = 'pasta_panna_delivery_zones';
const SITE_CONTENT_KEY = 'pasta_panna_site_content';

export function loadMenuFromStorage(): MenuItem[] {
  try {
    const stored = localStorage.getItem(MENU_KEY);
    if (stored) return JSON.parse(stored) as MenuItem[];
  } catch { /* ignore */ }
  return DEFAULT_MENU;
}

export function saveMenuToStorage(items: MenuItem[]): void {
  localStorage.setItem(MENU_KEY, JSON.stringify(items));
}

export function loadCategoriesFromStorage(): MenuCategory[] {
  try {
    const stored = localStorage.getItem(CATEGORIES_KEY);
    if (stored) return JSON.parse(stored) as MenuCategory[];
  } catch { /* ignore */ }
  return DEFAULT_CATEGORIES;
}

export function saveCategoriesToStorage(cats: MenuCategory[]): void {
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(cats));
}

export function loadDishOfDayFromStorage(): DishOfDay {
  try {
    const stored = localStorage.getItem(DOD_KEY);
    if (stored) return JSON.parse(stored) as DishOfDay;
  } catch { /* ignore */ }
  return DEFAULT_DISH_OF_DAY;
}

export function saveDishOfDayToStorage(dod: DishOfDay): void {
  localStorage.setItem(DOD_KEY, JSON.stringify(dod));
}

export function loadDeliveryZonesFromStorage(): DeliveryZone[] {
  try {
    const stored = localStorage.getItem(ZONES_KEY);
    if (stored) return JSON.parse(stored) as DeliveryZone[];
  } catch { /* ignore */ }
  return DEFAULT_DELIVERY_ZONES;
}

export function saveDeliveryZonesToStorage(zones: DeliveryZone[]): void {
  localStorage.setItem(ZONES_KEY, JSON.stringify(zones));
}

export function loadSiteContentFromStorage(): SiteContent {
  try {
    const stored = localStorage.getItem(SITE_CONTENT_KEY);
    if (stored) return { ...DEFAULT_SITE_CONTENT, ...JSON.parse(stored) };
  } catch { /* ignore */ }
  return DEFAULT_SITE_CONTENT;
}

export function saveSiteContentToStorage(content: SiteContent): void {
  localStorage.setItem(SITE_CONTENT_KEY, JSON.stringify(content));
}

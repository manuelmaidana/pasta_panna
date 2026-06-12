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

export interface SiteContent {
  heroTitle: string;
  heroSubtitle: string;
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
export const DEFAULT_SITE_CONTENT: SiteContent = {
  heroTitle: 'Pasta Panna',
  heroSubtitle: 'Cocina italiana artesanal. Seleccioná tus platos y envianos el pedido por WhatsApp.',
};

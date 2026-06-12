import { doc, setDoc, onSnapshot, getDoc } from 'firebase/firestore';
import { db } from './firebase';
import type { MenuItem, MenuCategory, DishOfDay, DeliveryZone, SiteContent } from '../data/menuData';
import {
  DEFAULT_MENU, DEFAULT_CATEGORIES, DEFAULT_DISH_OF_DAY,
  DEFAULT_DELIVERY_ZONES, DEFAULT_SITE_CONTENT,
} from '../data/menuData';

const COL = 'appData';

const menuRef = () => doc(db, COL, 'menu');
const catsRef = () => doc(db, COL, 'categories');
const dodRef = () => doc(db, COL, 'dishOfDay');
const zonesRef = () => doc(db, COL, 'deliveryZones');
const siteRef = () => doc(db, COL, 'siteContent');

export async function saveMenu(items: MenuItem[]): Promise<void> {
  await setDoc(menuRef(), { items });
}

export async function saveCategories(cats: MenuCategory[]): Promise<void> {
  await setDoc(catsRef(), { items: cats });
}

export async function saveDishOfDay(dod: DishOfDay): Promise<void> {
  await setDoc(dodRef(), { enabled: dod.enabled, itemId: dod.itemId ?? null });
}

export async function saveDeliveryZones(zones: DeliveryZone[]): Promise<void> {
  await setDoc(zonesRef(), { items: zones });
}

export async function saveSiteContent(content: SiteContent): Promise<void> {
  await setDoc(siteRef(), content);
}

export async function seedIfEmpty(): Promise<void> {
  const [menuSnap, catsSnap, dodSnap, zonesSnap, siteSnap] = await Promise.all([
    getDoc(menuRef()), getDoc(catsRef()), getDoc(dodRef()),
    getDoc(zonesRef()), getDoc(siteRef()),
  ]);
  const ops: Promise<void>[] = [];
  if (!menuSnap.exists()) ops.push(saveMenu(DEFAULT_MENU));
  if (!catsSnap.exists()) ops.push(saveCategories(DEFAULT_CATEGORIES));
  if (!dodSnap.exists()) ops.push(saveDishOfDay(DEFAULT_DISH_OF_DAY));
  if (!zonesSnap.exists()) ops.push(saveDeliveryZones(DEFAULT_DELIVERY_ZONES));
  if (!siteSnap.exists()) ops.push(saveSiteContent(DEFAULT_SITE_CONTENT));
  await Promise.all(ops);
}

export interface SnapshotSetters {
  setMenu: (items: MenuItem[]) => void;
  setCategories: (cats: MenuCategory[]) => void;
  setDishOfDay: (dod: DishOfDay) => void;
  setDeliveryZones: (zones: DeliveryZone[]) => void;
  setSiteContent: (content: SiteContent) => void;
  setLoading: (v: boolean) => void;
}

// ── Admin session (single active device) ─────────────────────────────────────

const sessionRef = () => doc(db, 'adminSession', 'active');

export async function writeAdminSession(token: string): Promise<void> {
  await setDoc(sessionRef(), { token });
}

export function listenAdminSession(cb: (token: string | null) => void): () => void {
  return onSnapshot(sessionRef(), (snap) => {
    cb(snap.exists() ? ((snap.data().token as string | null) ?? null) : null);
  });
}

// ── App data listeners ────────────────────────────────────────────────────────

export function setupFirestoreListeners(setters: SnapshotSetters): () => void {
  const resolved = new Set<string>();
  const markResolved = (key: string) => {
    resolved.add(key);
    if (resolved.size >= 5) setters.setLoading(false);
  };

  const unsubs = [
    onSnapshot(menuRef(), (snap) => {
      setters.setMenu(snap.exists() ? (snap.data().items as MenuItem[]) : DEFAULT_MENU);
      markResolved('menu');
    }),
    onSnapshot(catsRef(), (snap) => {
      setters.setCategories(snap.exists() ? (snap.data().items as MenuCategory[]) : DEFAULT_CATEGORIES);
      markResolved('cats');
    }),
    onSnapshot(dodRef(), (snap) => {
      if (snap.exists()) {
        const d = snap.data();
        setters.setDishOfDay({ enabled: d.enabled ?? false, itemId: d.itemId ?? null });
      } else {
        setters.setDishOfDay(DEFAULT_DISH_OF_DAY);
      }
      markResolved('dod');
    }),
    onSnapshot(zonesRef(), (snap) => {
      setters.setDeliveryZones(snap.exists() ? (snap.data().items as DeliveryZone[]) : DEFAULT_DELIVERY_ZONES);
      markResolved('zones');
    }),
    onSnapshot(siteRef(), (snap) => {
      setters.setSiteContent(snap.exists() ? ({ ...DEFAULT_SITE_CONTENT, ...snap.data() } as SiteContent) : DEFAULT_SITE_CONTENT);
      markResolved('site');
    }),
  ];

  return () => unsubs.forEach((u) => u());
}

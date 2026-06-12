import { useState } from 'react';
import { Edit3, Save, X, ArrowLeft, Check, Trash2, Plus, LogOut, Star, MapPin, Type } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import type { MenuItem } from '../data/menuData';
import { useAdminAuth } from '../hooks/useAdminAuth';

// ─── Login ────────────────────────────────────────────────────────────────────

function AdminLogin({ onLogin }: { onLogin: (u: string, p: string) => Promise<boolean> }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const ok = await onLogin(username, password);
    setSubmitting(false);
    if (!ok) {
      setError(true);
      setTimeout(() => setError(false), 2500);
    }
  }

  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-bg-base px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <span className="text-4xl">🍝</span>
          <h1 className="mt-3 font-display text-2xl font-800 text-text-primary" style={{ fontWeight: 800 }}>
            Pasta Panna
          </h1>
          <p className="mt-1 text-sm text-text-muted">Panel de administración</p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-2xl bg-bg-surface ring-1 ring-border p-6">
          <h2 className="mb-5 font-display text-base font-700 text-text-primary" style={{ fontWeight: 700 }}>
            Ingresá tus credenciales
          </h2>

          <div className="flex flex-col gap-3">
            <AdminField
              label="Usuario"
              value={username}
              onChange={setUsername}
              placeholder="Usuario"
              autoComplete="username"
            />
            <AdminField
              label="Contraseña"
              value={password}
              onChange={setPassword}
              placeholder="••••••••"
              type="password"
              autoComplete="current-password"
            />
          </div>

          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-3 text-xs text-red-400"
              >
                Usuario o contraseña incorrectos.
              </motion.p>
            )}
          </AnimatePresence>

          <button
            type="submit"
            disabled={submitting}
            className="mt-5 w-full rounded-full bg-accent py-3 text-sm font-700 text-white shadow-glow-accent transition-all hover:bg-accent-light active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
            style={{ fontWeight: 700 }}
          >
            {submitting ? 'Ingresando…' : 'Ingresar'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/" className="text-xs text-text-muted transition-colors hover:text-text-secondary">
            ← Volver al menú
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── Main panel ───────────────────────────────────────────────────────────────

interface ItemFormState {
  name: string;
  description: string;
  price: string;
  image: string;
}

const emptyItemForm: ItemFormState = { name: '', description: '', price: '', image: '' };

export default function AdminPanel() {
  const { authed, isChecking, login, logout } = useAdminAuth();

  if (isChecking) {
    return (
      <div className="flex min-h-[100dvh] flex-col items-center justify-center gap-4 bg-bg-base">
        <span className="text-5xl">🍝</span>
        <p className="animate-pulse text-sm text-text-muted">Verificando sesión…</p>
      </div>
    );
  }

  if (!authed) return <AdminLogin onLogin={login} />;
  return <AdminPanelInner onLogout={logout} />;
}

function AdminPanelInner({ onLogout }: { onLogout: () => void }) {
  const menu = useAppStore((s) => s.menu);
  const categories = useAppStore((s) => s.categories);
  const dishOfDay = useAppStore((s) => s.dishOfDay);
  const deliveryZones = useAppStore((s) => s.deliveryZones);
  const updateMenuItem = useAppStore((s) => s.updateMenuItem);
  const addMenuItem = useAppStore((s) => s.addMenuItem);
  const removeMenuItem = useAppStore((s) => s.removeMenuItem);
  const addCategory = useAppStore((s) => s.addCategory);
  const updateCategory = useAppStore((s) => s.updateCategory);
  const removeCategory = useAppStore((s) => s.removeCategory);
  const setDishOfDay = useAppStore((s) => s.setDishOfDay);
  const siteContent = useAppStore((s) => s.siteContent);
  const setSiteContent = useAppStore((s) => s.setSiteContent);
  const addDeliveryZone = useAppStore((s) => s.addDeliveryZone);
  const updateDeliveryZone = useAppStore((s) => s.updateDeliveryZone);
  const removeDeliveryZone = useAppStore((s) => s.removeDeliveryZone);

  // Item editing
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editItemForm, setEditItemForm] = useState<ItemFormState>(emptyItemForm);

  // Item adding
  const [addingItemCatId, setAddingItemCatId] = useState<string | null>(null);
  const [newItemForm, setNewItemForm] = useState<ItemFormState>(emptyItemForm);

  // Category editing
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [editCatForm, setEditCatForm] = useState({ label: '', emoji: '' });

  // Category adding
  const [addingCat, setAddingCat] = useState(false);
  const [newCatForm, setNewCatForm] = useState({ label: '', emoji: '' });

  // Zone editing
  const [editingZoneId, setEditingZoneId] = useState<string | null>(null);
  const [editZoneForm, setEditZoneForm] = useState({ name: '', price: '' });

  // Zone adding
  const [addingZone, setAddingZone] = useState(false);
  const [newZoneForm, setNewZoneForm] = useState({ name: '', price: '' });

  // Site content editing
  const [editingContent, setEditingContent] = useState(false);
  const [contentForm, setContentForm] = useState({ heroTitle: siteContent.heroTitle, heroSubtitle: siteContent.heroSubtitle });

  const [saved, setSaved] = useState(false);

  function flash() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  // ── item edit ───────────────────────────────────────────────────────────────
  function startEditItem(item: MenuItem) {
    setEditingItemId(item.id);
    setEditItemForm({ name: item.name, description: item.description, price: String(item.price), image: item.image });
  }

  function saveEditItem(id: string) {
    const price = parseFloat(editItemForm.price);
    if (!editItemForm.name.trim() || isNaN(price) || price <= 0) return;
    updateMenuItem(id, {
      name: editItemForm.name.trim(),
      description: editItemForm.description.trim(),
      price,
      image: editItemForm.image.trim(),
    });
    setEditingItemId(null);
    flash();
  }

  // ── item add ────────────────────────────────────────────────────────────────
  function startAddItem(catId: string) {
    setAddingItemCatId(catId);
    setNewItemForm(emptyItemForm);
  }

  function saveNewItem() {
    if (!addingItemCatId) return;
    const price = parseFloat(newItemForm.price);
    if (!newItemForm.name.trim() || isNaN(price) || price <= 0) return;
    const item: MenuItem = {
      id: `item_${Date.now()}`,
      name: newItemForm.name.trim(),
      description: newItemForm.description.trim(),
      price,
      image: newItemForm.image.trim() || 'https://picsum.photos/seed/new/600/400',
      category: addingItemCatId,
    };
    addMenuItem(item);
    setAddingItemCatId(null);
    flash();
  }

  // ── category edit ───────────────────────────────────────────────────────────
  function startEditCat(cat: { id: string; label: string; emoji: string }) {
    setEditingCatId(cat.id);
    setEditCatForm({ label: cat.label, emoji: cat.emoji });
  }

  function saveEditCat(id: string) {
    if (!editCatForm.label.trim()) return;
    updateCategory(id, { label: editCatForm.label.trim(), emoji: editCatForm.emoji });
    setEditingCatId(null);
    flash();
  }

  // ── category add ────────────────────────────────────────────────────────────
  function saveNewCat() {
    if (!newCatForm.label.trim()) return;
    addCategory(newCatForm.label.trim(), newCatForm.emoji || '🍽️');
    setAddingCat(false);
    setNewCatForm({ label: '', emoji: '' });
    flash();
  }

  // ── zone edit ────────────────────────────────────────────────────────────────
  function startEditZone(zone: { id: string; name: string; price: number }) {
    setEditingZoneId(zone.id);
    setEditZoneForm({ name: zone.name, price: String(zone.price) });
  }

  function saveEditZone(id: string) {
    const price = parseFloat(editZoneForm.price);
    if (!editZoneForm.name.trim() || isNaN(price) || price < 0) return;
    updateDeliveryZone(id, { name: editZoneForm.name.trim(), price });
    setEditingZoneId(null);
    flash();
  }

  // ── zone add ─────────────────────────────────────────────────────────────────
  function saveNewZone() {
    const price = parseFloat(newZoneForm.price);
    if (!newZoneForm.name.trim() || isNaN(price) || price < 0) return;
    addDeliveryZone(newZoneForm.name.trim(), price);
    setAddingZone(false);
    setNewZoneForm({ name: '', price: '' });
    flash();
  }

  return (
    <div className="min-h-[100dvh] bg-bg-base px-4 py-6">
      <div className="mx-auto max-w-lg">

        {/* Header */}
        <div className="mb-6 flex items-center gap-3">
          <Link
            to="/"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-bg-elevated ring-1 ring-border text-text-secondary transition-colors hover:text-text-primary"
          >
            <ArrowLeft size={16} strokeWidth={1.5} />
          </Link>
          <div className="flex-1">
            <h1 className="font-display text-xl font-700 text-text-primary leading-tight" style={{ fontWeight: 700 }}>
              Panel Admin
            </h1>
            <p className="text-xs text-text-muted">Editá el menú y las secciones</p>
          </div>
          <AnimatePresence>
            {saved && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center gap-1.5 rounded-full bg-green-500/15 px-3 py-1.5 text-xs font-600 text-green-400"
                style={{ fontWeight: 600 }}
              >
                <Check size={12} strokeWidth={2} />
                Guardado
              </motion.div>
            )}
          </AnimatePresence>
          <button
            onClick={onLogout}
            title="Cerrar sesión"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-bg-elevated ring-1 ring-border text-text-muted transition-colors hover:text-text-primary"
          >
            <LogOut size={15} strokeWidth={1.5} />
          </button>
        </div>

        {/* Storage notice */}
        <div className="mb-5 rounded-xl bg-emerald-500/10 px-4 py-3 ring-1 ring-emerald-500/20">
          <p className="text-xs text-emerald-400/90">
            ☁️ Los cambios se guardan en la nube y se reflejan en todos los dispositivos en tiempo real.
          </p>
        </div>

        {/* ── Título y subtítulo ───────────────────────────────────────────── */}
        <div className="mb-6 rounded-2xl bg-bg-surface ring-1 ring-border p-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Type size={13} className="text-text-secondary" strokeWidth={1.5} />
              <h2 className="font-display text-sm font-700 uppercase tracking-[0.08em] text-text-primary" style={{ fontWeight: 700 }}>
                Título y subtítulo
              </h2>
            </div>
            {!editingContent && (
              <button
                onClick={() => {
                  setContentForm({ heroTitle: siteContent.heroTitle, heroSubtitle: siteContent.heroSubtitle });
                  setEditingContent(true);
                }}
                className="flex items-center gap-1 rounded-full bg-bg-elevated px-2.5 py-1.5 text-xs font-600 text-text-secondary ring-1 ring-border transition-all hover:ring-accent/40 hover:text-accent active:scale-95"
                style={{ fontWeight: 600 }}
              >
                <Edit3 size={11} strokeWidth={1.5} /> Editar
              </button>
            )}
          </div>

          <AnimatePresence mode="wait">
            {editingContent ? (
              <motion.div
                key="editing-content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col gap-3"
              >
                <AdminField
                  label="Título"
                  value={contentForm.heroTitle}
                  onChange={(v) => setContentForm((s) => ({ ...s, heroTitle: v }))}
                  placeholder="Pasta Panna"
                />
                <AdminField
                  label="Subtítulo"
                  value={contentForm.heroSubtitle}
                  onChange={(v) => setContentForm((s) => ({ ...s, heroSubtitle: v }))}
                  placeholder="Descripción breve del local..."
                  multiline
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingContent(false)}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-bg-elevated py-2.5 text-sm font-600 text-text-secondary ring-1 ring-border"
                    style={{ fontWeight: 600 }}
                  >
                    <X size={14} strokeWidth={1.5} /> Cancelar
                  </button>
                  <button
                    onClick={() => {
                      if (!contentForm.heroTitle.trim()) return;
                      setSiteContent({ heroTitle: contentForm.heroTitle.trim(), heroSubtitle: contentForm.heroSubtitle.trim() });
                      setEditingContent(false);
                      flash();
                    }}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-accent py-2.5 text-sm font-700 text-white shadow-glow-accent"
                    style={{ fontWeight: 700 }}
                  >
                    <Save size={14} strokeWidth={1.5} /> Guardar
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="viewing-content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <p className="text-sm font-700 text-text-primary" style={{ fontWeight: 700 }}>{siteContent.heroTitle}</p>
                <p className="mt-1 text-xs text-text-muted leading-relaxed">{siteContent.heroSubtitle}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Plato del día ────────────────────────────────────────────────── */}
        <div className="mb-6 rounded-2xl bg-bg-surface ring-1 ring-border p-4">
          <div className="mb-3 flex items-center gap-2">
            <Star size={13} className="text-amber-400" fill="currentColor" strokeWidth={0} />
            <h2 className="font-display text-sm font-700 uppercase tracking-[0.08em] text-text-primary" style={{ fontWeight: 700 }}>
              Plato del día
            </h2>
          </div>

          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm text-text-secondary">Mostrar en el menú</span>
            <button
              onClick={() => setDishOfDay({ ...dishOfDay, enabled: !dishOfDay.enabled })}
              className={`relative h-6 w-11 rounded-full transition-colors duration-200 ${dishOfDay.enabled ? 'bg-accent' : 'bg-bg-elevated ring-1 ring-border'}`}
            >
              <motion.span
                animate={{ x: dishOfDay.enabled ? 20 : 2 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className="absolute top-[2px] h-5 w-5 rounded-full bg-white shadow-sm block"
              />
            </button>
          </div>

          {dishOfDay.enabled && (
            <div>
              <label className="mb-1.5 block text-xs font-600 text-text-muted" style={{ fontWeight: 600 }}>
                Plato destacado
              </label>
              <select
                value={dishOfDay.itemId ?? ''}
                onChange={(e) => setDishOfDay({ ...dishOfDay, itemId: e.target.value || null })}
                style={{ colorScheme: 'dark' }}
                className="w-full rounded-xl bg-bg-elevated px-3 py-2.5 text-sm text-text-primary ring-1 ring-border transition-all focus:outline-none focus:ring-accent/50"
              >
                <option value="">— Seleccionar plato —</option>
                {menu.map((item) => (
                  <option key={item.id} value={item.id}>{item.name}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* ── Zonas de entrega ─────────────────────────────────────────────── */}
        <div className="mb-6 rounded-2xl bg-bg-surface ring-1 ring-border p-4">
          <div className="mb-3 flex items-center gap-2">
            <MapPin size={13} className="text-accent" strokeWidth={1.5} />
            <h2 className="font-display text-sm font-700 uppercase tracking-[0.08em] text-text-primary" style={{ fontWeight: 700 }}>
              Zonas de entrega
            </h2>
          </div>

          <div className="flex flex-col gap-2 mb-3">
            {deliveryZones.length === 0 && (
              <p className="text-xs text-text-muted py-1">No hay zonas configuradas aún.</p>
            )}
            {deliveryZones.map((zone) => (
              <div key={zone.id} className="rounded-xl bg-bg-elevated ring-1 ring-border overflow-hidden">
                <AnimatePresence mode="wait">
                  {editingZoneId === zone.id ? (
                    <motion.div
                      key="editing-zone"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="p-3 flex flex-col gap-2"
                    >
                      <AdminField
                        label="Nombre del barrio/zona"
                        value={editZoneForm.name}
                        onChange={(v) => setEditZoneForm((s) => ({ ...s, name: v }))}
                        placeholder="Ej: San Isidro"
                      />
                      <AdminField
                        label="Precio de envío (ARS)"
                        value={editZoneForm.price}
                        onChange={(v) => setEditZoneForm((s) => ({ ...s, price: v }))}
                        type="number"
                        placeholder="0"
                      />
                      <div className="flex gap-2 mt-1">
                        <button
                          onClick={() => setEditingZoneId(null)}
                          className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-bg-muted py-2 text-xs font-600 text-text-secondary ring-1 ring-border"
                          style={{ fontWeight: 600 }}
                        >
                          <X size={12} strokeWidth={1.5} /> Cancelar
                        </button>
                        <button
                          onClick={() => saveEditZone(zone.id)}
                          className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-accent py-2 text-xs font-700 text-white shadow-glow-accent"
                          style={{ fontWeight: 700 }}
                        >
                          <Save size={12} strokeWidth={1.5} /> Guardar
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="viewing-zone"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-3 px-3 py-2.5"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-600 text-text-primary truncate" style={{ fontWeight: 600 }}>{zone.name}</p>
                        <p className="text-xs text-text-secondary">${zone.price.toLocaleString('es-AR')}</p>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => startEditZone(zone)}
                          className="flex items-center gap-1 rounded-full bg-bg-muted px-2.5 py-1.5 text-xs font-600 text-text-secondary ring-1 ring-border transition-all hover:ring-accent/40 hover:text-accent active:scale-95"
                          style={{ fontWeight: 600 }}
                        >
                          <Edit3 size={11} strokeWidth={1.5} /> Editar
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`¿Eliminar la zona "${zone.name}"?`)) removeDeliveryZone(zone.id);
                          }}
                          className="flex h-7 w-7 items-center justify-center rounded-full bg-bg-muted ring-1 ring-border text-text-muted transition-colors hover:text-red-400 active:scale-95"
                        >
                          <Trash2 size={11} strokeWidth={1.5} />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* Add zone */}
          <AnimatePresence>
            {addingZone ? (
              <motion.div
                key="add-zone-form"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="rounded-xl bg-bg-elevated ring-1 ring-accent/30 p-3 flex flex-col gap-2"
              >
                <p className="text-xs font-700 uppercase tracking-[0.08em] text-accent" style={{ fontWeight: 700 }}>
                  Nueva zona
                </p>
                <AdminField
                  label="Nombre del barrio/zona"
                  value={newZoneForm.name}
                  onChange={(v) => setNewZoneForm((s) => ({ ...s, name: v }))}
                  placeholder="Ej: San Isidro"
                />
                <AdminField
                  label="Precio de envío (ARS)"
                  value={newZoneForm.price}
                  onChange={(v) => setNewZoneForm((s) => ({ ...s, price: v }))}
                  type="number"
                  placeholder="0"
                />
                <div className="flex gap-2 mt-1">
                  <button
                    onClick={() => setAddingZone(false)}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-bg-muted py-2 text-xs font-600 text-text-secondary ring-1 ring-border"
                    style={{ fontWeight: 600 }}
                  >
                    <X size={12} strokeWidth={1.5} /> Cancelar
                  </button>
                  <button
                    onClick={saveNewZone}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-accent py-2 text-xs font-700 text-white shadow-glow-accent"
                    style={{ fontWeight: 700 }}
                  >
                    <Plus size={12} strokeWidth={2} /> Agregar
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.button
                key="add-zone-btn"
                onClick={() => { setAddingZone(true); setNewZoneForm({ name: '', price: '' }); }}
                className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-border py-2.5 text-xs font-600 text-text-muted transition-all hover:border-accent/40 hover:text-accent active:scale-[0.98]"
                style={{ fontWeight: 600 }}
              >
                <Plus size={12} strokeWidth={2} /> Agregar zona
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* ── Categories ───────────────────────────────────────────────────── */}
        {categories.map((cat) => {
          const items = menu.filter((m) => m.category === cat.id);
          const isEditingCat = editingCatId === cat.id;

          return (
            <div key={cat.id} className="mb-6">
              {/* Category header */}
              <AnimatePresence mode="wait">
                {isEditingCat ? (
                  <motion.div
                    key="editing-cat"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="mb-3 flex items-center gap-2"
                  >
                    <input
                      value={editCatForm.emoji}
                      onChange={(e) => setEditCatForm((s) => ({ ...s, emoji: e.target.value }))}
                      className="w-12 rounded-lg bg-bg-elevated px-2 py-1.5 text-center text-sm ring-1 ring-border focus:outline-none focus:ring-accent/50"
                      placeholder="🍽️"
                      maxLength={2}
                    />
                    <input
                      value={editCatForm.label}
                      onChange={(e) => setEditCatForm((s) => ({ ...s, label: e.target.value }))}
                      className="flex-1 rounded-lg bg-bg-elevated px-3 py-1.5 text-sm font-600 text-text-primary ring-1 ring-border focus:outline-none focus:ring-accent/50"
                      style={{ fontWeight: 600 }}
                    />
                    <button
                      onClick={() => saveEditCat(cat.id)}
                      className="flex h-7 w-7 items-center justify-center rounded-full bg-accent text-white"
                    >
                      <Check size={12} strokeWidth={2} />
                    </button>
                    <button
                      onClick={() => setEditingCatId(null)}
                      className="flex h-7 w-7 items-center justify-center rounded-full bg-bg-elevated ring-1 ring-border text-text-secondary"
                    >
                      <X size={12} strokeWidth={2} />
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="viewing-cat"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="mb-3 flex items-center gap-2"
                  >
                    <span>{cat.emoji}</span>
                    <h2 className="flex-1 font-display text-sm font-700 uppercase tracking-[0.08em] text-text-secondary" style={{ fontWeight: 700 }}>
                      {cat.label}
                    </h2>
                    <button
                      onClick={() => startEditCat(cat)}
                      className="flex h-7 w-7 items-center justify-center rounded-full bg-bg-elevated ring-1 ring-border text-text-muted transition-colors hover:text-text-primary"
                    >
                      <Edit3 size={11} strokeWidth={1.5} />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`¿Eliminar la sección "${cat.label}" y todos sus platos?`)) {
                          removeCategory(cat.id);
                        }
                      }}
                      className="flex h-7 w-7 items-center justify-center rounded-full bg-bg-elevated ring-1 ring-border text-text-muted transition-colors hover:text-red-400"
                    >
                      <Trash2 size={11} strokeWidth={1.5} />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Items list */}
              <div className="flex flex-col gap-3">
                {items.map((item) => (
                  <div key={item.id} className="rounded-2xl bg-bg-surface ring-1 ring-border overflow-hidden">
                    <AnimatePresence mode="wait">
                      {editingItemId === item.id ? (
                        <motion.div
                          key="editing"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="p-4"
                        >
                          <div className="flex flex-col gap-3">
                            <AdminField label="Nombre" value={editItemForm.name} onChange={(v) => setEditItemForm((s) => ({ ...s, name: v }))} />
                            <AdminField label="Descripción" value={editItemForm.description} onChange={(v) => setEditItemForm((s) => ({ ...s, description: v }))} multiline />
                            <AdminField label="Precio (ARS)" value={editItemForm.price} onChange={(v) => setEditItemForm((s) => ({ ...s, price: v }))} type="number" placeholder="2500" />
                            <AdminField label="URL de imagen" value={editItemForm.image} onChange={(v) => setEditItemForm((s) => ({ ...s, image: v }))} placeholder="https://..." />
                            {editItemForm.image && (
                              <div className="overflow-hidden rounded-xl">
                                <img src={editItemForm.image} alt="preview" className="h-28 w-full object-cover" />
                              </div>
                            )}
                            <div className="flex gap-2">
                              <button
                                onClick={() => setEditingItemId(null)}
                                className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-bg-elevated py-2.5 text-sm font-600 text-text-secondary ring-1 ring-border transition-colors hover:text-text-primary"
                                style={{ fontWeight: 600 }}
                              >
                                <X size={14} strokeWidth={1.5} /> Cancelar
                              </button>
                              <button
                                onClick={() => saveEditItem(item.id)}
                                className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-accent py-2.5 text-sm font-700 text-white shadow-glow-accent transition-all hover:bg-accent-light"
                                style={{ fontWeight: 700 }}
                              >
                                <Save size={14} strokeWidth={1.5} /> Guardar
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="viewing"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center gap-3 p-3"
                        >
                          <img src={item.image} alt={item.name} className="h-12 w-12 rounded-xl object-cover shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="truncate text-sm font-600 text-text-primary" style={{ fontWeight: 600 }}>{item.name}</p>
                            <p className="text-xs text-text-secondary">${item.price.toLocaleString('es-AR')}</p>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              onClick={() => startEditItem(item)}
                              className="flex items-center gap-1 rounded-full bg-bg-elevated px-2.5 py-1.5 text-xs font-600 text-text-secondary ring-1 ring-border transition-all hover:ring-accent/40 hover:text-accent active:scale-95"
                              style={{ fontWeight: 600 }}
                            >
                              <Edit3 size={11} strokeWidth={1.5} /> Editar
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm(`¿Eliminar "${item.name}"?`)) removeMenuItem(item.id);
                              }}
                              className="flex h-7 w-7 items-center justify-center rounded-full bg-bg-elevated ring-1 ring-border text-text-muted transition-colors hover:text-red-400 active:scale-95"
                            >
                              <Trash2 size={11} strokeWidth={1.5} />
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}

                {/* Add item */}
                <AnimatePresence>
                  {addingItemCatId === cat.id ? (
                    <motion.div
                      key="add-item-form"
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="rounded-2xl bg-bg-surface ring-1 ring-accent/30 p-4"
                    >
                      <p className="mb-3 text-xs font-700 uppercase tracking-[0.08em] text-accent" style={{ fontWeight: 700 }}>
                        Nuevo plato
                      </p>
                      <div className="flex flex-col gap-3">
                        <AdminField label="Nombre" value={newItemForm.name} onChange={(v) => setNewItemForm((s) => ({ ...s, name: v }))} placeholder="Nombre del plato" />
                        <AdminField label="Descripción" value={newItemForm.description} onChange={(v) => setNewItemForm((s) => ({ ...s, description: v }))} multiline placeholder="Descripción..." />
                        <AdminField label="Precio (ARS)" value={newItemForm.price} onChange={(v) => setNewItemForm((s) => ({ ...s, price: v }))} type="number" placeholder="2500" />
                        <AdminField label="URL de imagen" value={newItemForm.image} onChange={(v) => setNewItemForm((s) => ({ ...s, image: v }))} placeholder="https://..." />
                        {newItemForm.image && (
                          <div className="overflow-hidden rounded-xl">
                            <img src={newItemForm.image} alt="preview" className="h-28 w-full object-cover" />
                          </div>
                        )}
                        <div className="flex gap-2">
                          <button
                            onClick={() => setAddingItemCatId(null)}
                            className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-bg-elevated py-2.5 text-sm font-600 text-text-secondary ring-1 ring-border"
                            style={{ fontWeight: 600 }}
                          >
                            <X size={14} strokeWidth={1.5} /> Cancelar
                          </button>
                          <button
                            onClick={saveNewItem}
                            className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-accent py-2.5 text-sm font-700 text-white shadow-glow-accent"
                            style={{ fontWeight: 700 }}
                          >
                            <Plus size={14} strokeWidth={2} /> Agregar
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.button
                      key="add-item-btn"
                      onClick={() => startAddItem(cat.id)}
                      className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border py-3 text-sm font-600 text-text-muted transition-all hover:border-accent/40 hover:text-accent active:scale-[0.98]"
                      style={{ fontWeight: 600 }}
                    >
                      <Plus size={14} strokeWidth={2} /> Agregar plato
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            </div>
          );
        })}

        {/* ── Add category ─────────────────────────────────────────────────── */}
        <AnimatePresence>
          {addingCat ? (
            <motion.div
              key="add-cat-form"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mb-4 rounded-2xl bg-bg-surface ring-1 ring-accent/30 p-4"
            >
              <p className="mb-3 text-xs font-700 uppercase tracking-[0.08em] text-accent" style={{ fontWeight: 700 }}>
                Nueva sección
              </p>
              <div className="mb-3 flex items-center gap-2">
                <input
                  value={newCatForm.emoji}
                  onChange={(e) => setNewCatForm((s) => ({ ...s, emoji: e.target.value }))}
                  className="w-14 rounded-xl bg-bg-elevated px-2 py-2.5 text-center text-lg ring-1 ring-border focus:outline-none focus:ring-accent/50"
                  placeholder="🍽️"
                  maxLength={2}
                />
                <input
                  value={newCatForm.label}
                  onChange={(e) => setNewCatForm((s) => ({ ...s, label: e.target.value }))}
                  className="flex-1 rounded-xl bg-bg-elevated px-3 py-2.5 text-sm font-600 text-text-primary ring-1 ring-border focus:outline-none focus:ring-accent/50"
                  placeholder="Nombre de la sección"
                  style={{ fontWeight: 600 }}
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setAddingCat(false)}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-bg-elevated py-2.5 text-sm font-600 text-text-secondary ring-1 ring-border"
                  style={{ fontWeight: 600 }}
                >
                  <X size={14} strokeWidth={1.5} /> Cancelar
                </button>
                <button
                  onClick={saveNewCat}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-accent py-2.5 text-sm font-700 text-white shadow-glow-accent"
                  style={{ fontWeight: 700 }}
                >
                  <Plus size={14} strokeWidth={2} /> Crear sección
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.button
              key="add-cat-btn"
              onClick={() => { setAddingCat(true); setNewCatForm({ label: '', emoji: '' }); }}
              className="mb-6 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border py-4 text-sm font-600 text-text-muted transition-all hover:border-accent/40 hover:text-accent active:scale-[0.98]"
              style={{ fontWeight: 600 }}
            >
              <Plus size={15} strokeWidth={2} /> Agregar sección
            </motion.button>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}

// ─── Shared field component ───────────────────────────────────────────────────

interface AdminFieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  multiline?: boolean;
  autoComplete?: string;
}

function AdminField({ label, value, onChange, placeholder, type = 'text', multiline, autoComplete }: AdminFieldProps) {
  return (
    <div>
      <label className="mb-1 block text-xs font-600 text-text-muted" style={{ fontWeight: 600 }}>
        {label}
      </label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          className="w-full resize-none rounded-xl bg-bg-elevated px-3 py-2.5 text-sm text-text-primary placeholder-text-muted ring-1 ring-border transition-all focus:outline-none focus:ring-accent/50"
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className="w-full rounded-xl bg-bg-elevated px-3 py-2.5 text-sm text-text-primary placeholder-text-muted ring-1 ring-border transition-all focus:outline-none focus:ring-accent/50"
        />
      )}
    </div>
  );
}

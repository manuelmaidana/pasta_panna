import { useState } from 'react';
import { Edit3, Save, X, ArrowLeft, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import type { MenuItem } from '../data/menuData';
import { CATEGORIES } from '../data/menuData';

interface EditState {
  name: string;
  description: string;
  price: string;
  image: string;
}

export default function AdminPanel() {
  const menu = useAppStore((s) => s.menu);
  const updateMenuItem = useAppStore((s) => s.updateMenuItem);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editState, setEditState] = useState<EditState>({
    name: '',
    description: '',
    price: '',
    image: '',
  });
  const [saved, setSaved] = useState(false);

  function startEdit(item: MenuItem) {
    setEditingId(item.id);
    setEditState({
      name: item.name,
      description: item.description,
      price: String(item.price),
      image: item.image,
    });
  }

  function cancelEdit() {
    setEditingId(null);
  }

  function saveEdit(id: string) {
    const price = parseFloat(editState.price);
    if (isNaN(price) || price <= 0) return;
    updateMenuItem(id, {
      name: editState.name.trim(),
      description: editState.description.trim(),
      price,
      image: editState.image.trim(),
    });
    setEditingId(null);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="min-h-[100dvh] bg-bg-base px-4 py-6">
      <div className="mx-auto max-w-lg">
        <div className="mb-6 flex items-center gap-3">
          <Link
            to="/"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-bg-elevated text-text-secondary transition-colors hover:text-text-primary ring-1 ring-border"
          >
            <ArrowLeft size={16} strokeWidth={1.5} />
          </Link>
          <div>
            <h1 className="font-display text-xl font-700 text-text-primary leading-tight" style={{ fontWeight: 700 }}>
              Panel Admin
            </h1>
            <p className="text-xs text-text-muted">Editá los platos del menú</p>
          </div>
          <AnimatePresence>
            {saved && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="ml-auto flex items-center gap-1.5 rounded-full bg-green-500/15 px-3 py-1.5 text-xs font-600 text-green-400"
                style={{ fontWeight: 600 }}
              >
                <Check size={12} strokeWidth={2} />
                Guardado
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mb-3 rounded-xl bg-amber-500/10 px-4 py-3 ring-1 ring-amber-500/20">
          <p className="text-xs text-amber-400/90">
            Los cambios se guardan automáticamente en el navegador (localStorage) y se reflejan en el menú del cliente.
          </p>
        </div>

        {CATEGORIES.map((cat) => {
          const items = menu.filter((m) => m.category === cat.id);
          return (
            <div key={cat.id} className="mb-6">
              <div className="mb-3 flex items-center gap-2">
                <span>{cat.emoji}</span>
                <h2 className="font-display text-sm font-700 uppercase tracking-[0.08em] text-text-secondary" style={{ fontWeight: 700 }}>
                  {cat.label}
                </h2>
              </div>

              <div className="flex flex-col gap-3">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-2xl bg-bg-surface ring-1 ring-border overflow-hidden"
                    style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.4)' }}
                  >
                    <AnimatePresence mode="wait">
                      {editingId === item.id ? (
                        <motion.div
                          key="editing"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="p-4"
                        >
                          <div className="flex flex-col gap-3">
                            <AdminField
                              label="Nombre del plato"
                              value={editState.name}
                              onChange={(v) => setEditState((s) => ({ ...s, name: v }))}
                            />
                            <AdminField
                              label="Descripción"
                              value={editState.description}
                              onChange={(v) => setEditState((s) => ({ ...s, description: v }))}
                              multiline
                            />
                            <AdminField
                              label="Precio (ARS)"
                              value={editState.price}
                              onChange={(v) => setEditState((s) => ({ ...s, price: v }))}
                              type="number"
                              placeholder="Ej: 2500"
                            />
                            <AdminField
                              label="URL de imagen"
                              value={editState.image}
                              onChange={(v) => setEditState((s) => ({ ...s, image: v }))}
                              placeholder="https://..."
                            />

                            {editState.image && (
                              <div className="overflow-hidden rounded-xl bg-bg-muted">
                                <img
                                  src={editState.image}
                                  alt="preview"
                                  className="h-32 w-full object-cover"
                                />
                              </div>
                            )}

                            <div className="flex gap-2">
                              <button
                                onClick={cancelEdit}
                                className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-bg-elevated py-2.5 text-sm font-600 text-text-secondary ring-1 ring-border transition-colors hover:text-text-primary"
                                style={{ fontWeight: 600 }}
                              >
                                <X size={14} strokeWidth={1.5} />
                                Cancelar
                              </button>
                              <button
                                onClick={() => saveEdit(item.id)}
                                className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-accent py-2.5 text-sm font-700 text-white shadow-glow-accent transition-all hover:bg-accent-light"
                                style={{ fontWeight: 700 }}
                              >
                                <Save size={14} strokeWidth={1.5} />
                                Guardar
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
                          className="flex items-center gap-3 p-4"
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-14 w-14 rounded-xl object-cover shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="truncate text-sm font-600 text-text-primary" style={{ fontWeight: 600 }}>
                              {item.name}
                            </p>
                            <p className="text-xs text-text-secondary">
                              ${item.price.toLocaleString('es-AR')}
                            </p>
                          </div>
                          <button
                            onClick={() => startEdit(item)}
                            className="flex items-center gap-1.5 rounded-full bg-bg-elevated px-3 py-2 text-xs font-600 text-text-secondary ring-1 ring-border transition-all hover:ring-accent/40 hover:text-accent active:scale-95"
                            style={{ fontWeight: 600 }}
                          >
                            <Edit3 size={12} strokeWidth={1.5} />
                            Editar
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface AdminFieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  multiline?: boolean;
}

function AdminField({ label, value, onChange, placeholder, type = 'text', multiline }: AdminFieldProps) {
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
          className="w-full rounded-xl bg-bg-elevated px-3 py-2.5 text-sm text-text-primary placeholder-text-muted ring-1 ring-border transition-all focus:outline-none focus:ring-accent/50"
        />
      )}
    </div>
  );
}

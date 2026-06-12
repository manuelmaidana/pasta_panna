import { useState } from 'react';
import { ChevronDown, Plus, Minus, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { MenuItem as MenuItemType } from '../data/menuData';
import { useAppStore } from '../store/appStore';

interface Props {
  item: MenuItemType;
}

export default function MenuItem({ item }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const addToCart = useAppStore((s) => s.addToCart);
  const cartItems = useAppStore((s) => s.cart);
  const inCart = cartItems.find((c) => c.menuItem.id === item.id);

  function handleAdd() {
    for (let i = 0; i < qty; i++) addToCart(item);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <div
      className="overflow-hidden rounded-2xl bg-bg-surface ring-1 ring-border transition-shadow duration-300 ease-smooth hover:shadow-card-hover"
      style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.4), 0 8px 24px rgba(0,0,0,0.3)' }}
    >
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left"
      >
        <div className="flex-1 min-w-0">
          <p className="truncate font-display text-[15px] font-600 text-text-primary leading-tight" style={{ fontWeight: 600 }}>
            {item.name}
          </p>
          {!isOpen && (
            <p className="mt-0.5 text-xs text-text-muted font-400 truncate">
              ${item.price.toLocaleString('es-AR')}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {inCart && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent/20 text-[10px] font-700 text-accent">
              {inCart.quantity}
            </span>
          )}
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
          >
            <ChevronDown size={16} strokeWidth={1.5} className="text-text-secondary" />
          </motion.div>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4">
              <div className="overflow-hidden rounded-xl bg-bg-muted">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-44 w-full object-cover"
                  loading="lazy"
                />
              </div>

              <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                {item.description}
              </p>

              <div className="mt-4 flex items-center justify-between">
                <span className="font-display text-lg font-700 text-text-primary" style={{ fontWeight: 700 }}>
                  ${item.price.toLocaleString('es-AR')}
                </span>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 rounded-full bg-bg-muted px-1 py-1">
                    <button
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                      className="flex h-7 w-7 items-center justify-center rounded-full text-text-secondary transition-colors hover:bg-bg-elevated hover:text-text-primary active:scale-90"
                    >
                      <Minus size={13} strokeWidth={2} />
                    </button>
                    <span className="w-5 text-center text-sm font-600 text-text-primary" style={{ fontWeight: 600 }}>
                      {qty}
                    </span>
                    <button
                      onClick={() => setQty((q) => q + 1)}
                      className="flex h-7 w-7 items-center justify-center rounded-full text-text-secondary transition-colors hover:bg-bg-elevated hover:text-text-primary active:scale-90"
                    >
                      <Plus size={13} strokeWidth={2} />
                    </button>
                  </div>

                  <motion.button
                    onClick={handleAdd}
                    whileTap={{ scale: 0.94 }}
                    className="flex items-center gap-1.5 rounded-full bg-accent px-4 py-2 text-sm font-600 text-white shadow-glow-accent transition-all duration-200 hover:bg-accent-light active:scale-[0.96]"
                    style={{ fontWeight: 600 }}
                  >
                    <AnimatePresence mode="wait">
                      {added ? (
                        <motion.span
                          key="added"
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          className="flex items-center gap-1"
                        >
                          ✓ Agregado
                        </motion.span>
                      ) : (
                        <motion.span
                          key="add"
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          className="flex items-center gap-1"
                        >
                          <ShoppingBag size={13} strokeWidth={1.5} />
                          Agregar
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Settings } from 'lucide-react';
import Navbar from '../components/Navbar';
import MenuCategory from '../components/MenuCategory';
import CheckoutModal from '../components/CheckoutModal';
import { CATEGORIES } from '../data/menuData';
import { useAppStore } from '../store/appStore';

export default function CustomerView() {
  const cart = useAppStore((s) => s.cart);
  const cartCount = cart.reduce((sum, c) => sum + c.quantity, 0);
  const cartTotal = cart.reduce((sum, c) => sum + c.menuItem.price * c.quantity, 0);
  const openCheckout = useAppStore((s) => s.openCheckout);

  return (
    <div className="relative min-h-[100dvh] bg-bg-base">
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.03] bg-noise"
        aria-hidden="true"
      />

      <Navbar />

      <main className="mx-auto max-w-lg pb-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="px-4 py-8"
        >
          <p className="text-xs font-600 uppercase tracking-[0.15em] text-accent mb-2" style={{ fontWeight: 600 }}>
            Menú del día
          </p>
          <h1 className="font-display text-3xl font-800 text-text-primary leading-tight" style={{ fontWeight: 800 }}>
            Bienvenido a<br />
            <span className="text-accent">Pasta &amp; Panna</span>
          </h1>
          <p className="mt-2 text-sm text-text-secondary leading-relaxed max-w-xs">
            Cocina italiana artesanal. Seleccioná tus platos y envianos el pedido por WhatsApp.
          </p>
        </motion.div>

        <div className="flex flex-col gap-8">
          {CATEGORIES.map((category, i) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.15 + i * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <MenuCategory category={category} />
            </motion.div>
          ))}
        </div>
      </main>

      {cartCount > 0 && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="fixed bottom-6 left-0 right-0 z-30 mx-auto max-w-lg px-4"
        >
          <motion.button
            onClick={openCheckout}
            whileTap={{ scale: 0.97 }}
            className="flex w-full items-center justify-between rounded-2xl bg-accent px-5 py-4 shadow-glow-accent transition-all hover:bg-accent-light"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15 text-xs font-700 text-white" style={{ fontWeight: 700 }}>
                {cartCount}
              </span>
              <span className="text-sm font-700 text-white" style={{ fontWeight: 700 }}>
                Ver mi pedido
              </span>
            </div>
            <span className="text-sm font-700 text-white/90" style={{ fontWeight: 700 }}>
              ${cartTotal.toLocaleString('es-AR')}
            </span>
          </motion.button>
        </motion.div>
      )}

      <Link
        to="/admin"
        className="fixed bottom-6 right-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-bg-elevated text-text-muted ring-1 ring-border transition-all hover:ring-border-strong hover:text-text-secondary"
        title="Panel de administración"
      >
        <Settings size={16} strokeWidth={1.5} />
      </Link>

      <CheckoutModal />
    </div>
  );
}

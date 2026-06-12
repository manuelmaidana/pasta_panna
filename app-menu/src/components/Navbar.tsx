import { ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store/appStore';

export default function Navbar() {
  const cart = useAppStore((s) => s.cart);
  const cartCount = cart.reduce((sum, c) => sum + c.quantity, 0);
  const openCheckout = useAppStore((s) => s.openCheckout);

  return (
    <header className="sticky top-0 z-40 w-full bg-bg-base/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-lg items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <span className="text-xl">🍝</span>
          <span className="font-display text-base font-700 tracking-tight text-text-primary">
            Pasta Panna
          </span>
        </div>

        <motion.button
          onClick={openCheckout}
          whileTap={{ scale: 0.94 }}
          className="relative flex items-center gap-2 rounded-full bg-bg-elevated px-4 py-2 text-sm font-600 text-text-primary ring-1 ring-border transition-all duration-300 ease-smooth hover:ring-border-strong active:scale-[0.96]"
          style={{ fontWeight: 600 }}
        >
          <ShoppingBag size={16} strokeWidth={1.5} />
          <span>Mi pedido</span>
          <AnimatePresence>
            {cartCount > 0 && (
              <motion.span
                key="badge"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] font-700 text-white"
                style={{ fontWeight: 700 }}
              >
                {cartCount}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      <div className="h-px bg-border" />
    </header>
  );
}

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Star, ShoppingBag } from 'lucide-react';
import { useAppStore } from '../store/appStore';

export default function DishOfDay() {
  const menu = useAppStore((s) => s.menu);
  const dishOfDay = useAppStore((s) => s.dishOfDay);
  const addToCart = useAppStore((s) => s.addToCart);

  const dish = useMemo(
    () =>
      dishOfDay.enabled && dishOfDay.itemId
        ? menu.find((m) => m.id === dishOfDay.itemId) ?? null
        : null,
    [menu, dishOfDay]
  );

  if (!dish) return null;

  return (
    <section className="px-4 mb-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="relative overflow-hidden rounded-2xl"
        style={{
          background: 'linear-gradient(135deg, rgba(217,119,6,0.16) 0%, rgba(180,83,9,0.10) 100%)',
          boxShadow: '0 0 0 1px rgba(245,158,11,0.22), 0 8px 32px rgba(217,119,6,0.12)',
        }}
      >
        {/* Pulsing ambient glow */}
        <motion.div
          animate={{ opacity: [0.3, 0.65, 0.3] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.28) 0%, transparent 70%)' }}
        />

        <div className="relative p-4">
          {/* Badge */}
          <div className="mb-3 flex items-center gap-2">
            <motion.div
              animate={{ rotate: [0, 12, -12, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Star size={13} strokeWidth={0} className="text-amber-400" fill="currentColor" />
            </motion.div>
            <span
              className="text-xs font-700 uppercase tracking-[0.14em] text-amber-400"
              style={{ fontWeight: 700 }}
            >
              Plato del día
            </span>
          </div>

          {/* Image */}
          <div className="mb-3 overflow-hidden rounded-xl">
            <img
              src={dish.image}
              alt={dish.name}
              className="h-48 w-full object-cover"
              loading="eager"
            />
          </div>

          {/* Info */}
          <h3
            className="font-display text-lg font-700 text-text-primary leading-tight"
            style={{ fontWeight: 700 }}
          >
            {dish.name}
          </h3>
          <p className="mt-1.5 text-sm leading-relaxed text-text-secondary">
            {dish.description}
          </p>

          {/* Price + CTA */}
          <div className="mt-4 flex items-center justify-between">
            <span
              className="font-display text-xl font-800 text-amber-400"
              style={{ fontWeight: 800 }}
            >
              ${dish.price.toLocaleString('es-AR')}
            </span>
            <motion.button
              whileTap={{ scale: 0.93 }}
              onClick={() => addToCart(dish)}
              className="flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-700 text-white transition-opacity duration-200 hover:opacity-90"
              style={{
                fontWeight: 700,
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                boxShadow: '0 4px 18px rgba(217,119,6,0.38)',
              }}
            >
              <ShoppingBag size={14} strokeWidth={1.5} />
              Agregar
            </motion.button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

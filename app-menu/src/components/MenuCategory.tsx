import { useMemo } from 'react';
import { motion } from 'framer-motion';
import type { MenuCategory as CategoryType } from '../data/menuData';
import { useAppStore } from '../store/appStore';
import MenuItemCard from './MenuItem';

interface Props {
  category: CategoryType;
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
};

export default function MenuCategory({ category }: Props) {
  const menu = useAppStore((s) => s.menu);
  const items = useMemo(
    () => menu.filter((m) => m.category === category.id),
    [menu, category.id]
  );

  return (
    <section className="px-4">
      <div className="mb-4 flex items-center gap-2">
        <span className="text-lg">{category.emoji}</span>
        <h2 className="font-display text-base font-700 uppercase tracking-[0.08em] text-text-secondary" style={{ fontWeight: 700 }}>
          {category.label}
        </h2>
        <div className="flex-1 h-px bg-border-subtle ml-2" />
        <span className="text-xs text-text-muted">{items.length} platos</span>
      </div>

      <motion.div
        className="flex flex-col gap-3"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        {items.map((item) => (
          <motion.div key={item.id} variants={itemVariants}>
            <MenuItemCard item={item} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

import { useState } from 'react';
import { X, Trash2, MessageCircle, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store/appStore';
import type { CustomerData } from '../utils/whatsapp';
import { buildWhatsAppUrl } from '../utils/whatsapp';

const initialCustomer: CustomerData = {
  name: '',
  address: '',
  phone: '',
  payment: 'efectivo',
  notes: '',
};

export default function CheckoutModal() {
  const isOpen = useAppStore((s) => s.isCheckoutOpen);
  const closeCheckout = useAppStore((s) => s.closeCheckout);
  const cart = useAppStore((s) => s.cart);
  const cartTotal = cart.reduce((sum, c) => sum + c.menuItem.price * c.quantity, 0);
  const updateQuantity = useAppStore((s) => s.updateQuantity);
  const removeFromCart = useAppStore((s) => s.removeFromCart);
  const clearCart = useAppStore((s) => s.clearCart);

  const [customer, setCustomer] = useState<CustomerData>(initialCustomer);
  const [errors, setErrors] = useState<Partial<CustomerData>>({});
  const [step, setStep] = useState<'cart' | 'form'>('cart');

  function validate(): boolean {
    const e: Partial<CustomerData> = {};
    if (!customer.name.trim()) e.name = 'Requerido';
    if (!customer.address.trim()) e.address = 'Requerido';
    if (!customer.phone.trim()) e.phone = 'Requerido';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleConfirm() {
    if (!validate()) return;
    const url = buildWhatsAppUrl(customer, cart, cartTotal);
    window.open(url, '_blank');
    clearCart();
    setCustomer(initialCustomer);
    setStep('cart');
    closeCheckout();
  }

  function handleClose() {
    closeCheckout();
    setStep('cart');
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={handleClose}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
          />

          <motion.div
            key="modal"
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
            className="fixed bottom-0 left-0 right-0 z-50 mx-auto max-w-lg"
          >
            <div className="rounded-t-3xl bg-bg-surface ring-1 ring-border overflow-hidden" style={{ maxHeight: '90dvh' }}>
              <div className="flex items-center justify-between px-5 py-4 border-b border-border-subtle">
                <div className="flex items-center gap-2">
                  {step === 'form' && (
                    <button
                      onClick={() => setStep('cart')}
                      className="mr-1 flex h-8 w-8 items-center justify-center rounded-full bg-bg-elevated text-text-secondary hover:text-text-primary transition-colors"
                    >
                      <ChevronDown size={16} strokeWidth={1.5} className="rotate-90" />
                    </button>
                  )}
                  <h2 className="font-display text-base font-700 text-text-primary" style={{ fontWeight: 700 }}>
                    {step === 'cart' ? 'Mi Pedido' : 'Tus datos'}
                  </h2>
                  {cart.length > 0 && step === 'cart' && (
                    <span className="rounded-full bg-accent/15 px-2 py-0.5 text-xs font-600 text-accent" style={{ fontWeight: 600 }}>
                      {cart.length} items
                    </span>
                  )}
                </div>
                <button
                  onClick={handleClose}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-bg-elevated text-text-secondary transition-colors hover:text-text-primary active:scale-90"
                >
                  <X size={16} strokeWidth={1.5} />
                </button>
              </div>

              <div className="overflow-y-auto scrollbar-hide" style={{ maxHeight: 'calc(90dvh - 64px)' }}>
                <AnimatePresence mode="wait">
                  {step === 'cart' ? (
                    <motion.div
                      key="cart"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.25 }}
                      className="px-5 py-4"
                    >
                      {cart.length === 0 ? (
                        <div className="py-12 text-center">
                          <p className="text-4xl mb-3">🛒</p>
                          <p className="text-sm text-text-muted">Tu pedido está vacío.</p>
                          <p className="text-xs text-text-muted mt-1">Agrega platos del menú para comenzar.</p>
                        </div>
                      ) : (
                        <>
                          <div className="flex flex-col gap-3">
                            {cart.map(({ menuItem, quantity }) => (
                              <div
                                key={menuItem.id}
                                className="flex items-center gap-3 rounded-xl bg-bg-elevated p-3"
                              >
                                <img
                                  src={menuItem.image}
                                  alt={menuItem.name}
                                  className="h-12 w-12 rounded-lg object-cover shrink-0"
                                />
                                <div className="flex-1 min-w-0">
                                  <p className="truncate text-sm font-600 text-text-primary" style={{ fontWeight: 600 }}>
                                    {menuItem.name}
                                  </p>
                                  <p className="text-xs text-text-secondary">
                                    ${(menuItem.price * quantity).toLocaleString('es-AR')}
                                  </p>
                                </div>
                                <div className="flex items-center gap-1.5 shrink-0">
                                  <button
                                    onClick={() => updateQuantity(menuItem.id, quantity - 1)}
                                    className="flex h-6 w-6 items-center justify-center rounded-full bg-bg-muted text-text-secondary hover:text-text-primary transition-colors text-xs active:scale-90"
                                  >
                                    −
                                  </button>
                                  <span className="w-4 text-center text-sm font-600 text-text-primary" style={{ fontWeight: 600 }}>
                                    {quantity}
                                  </span>
                                  <button
                                    onClick={() => updateQuantity(menuItem.id, quantity + 1)}
                                    className="flex h-6 w-6 items-center justify-center rounded-full bg-bg-muted text-text-secondary hover:text-text-primary transition-colors text-xs active:scale-90"
                                  >
                                    +
                                  </button>
                                  <button
                                    onClick={() => removeFromCart(menuItem.id)}
                                    className="ml-1 flex h-6 w-6 items-center justify-center rounded-full text-text-muted hover:text-red-400 transition-colors active:scale-90"
                                  >
                                    <Trash2 size={12} strokeWidth={1.5} />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="mt-4 flex items-center justify-between rounded-xl bg-bg-elevated px-4 py-3">
                            <span className="text-sm text-text-secondary">Total</span>
                            <span className="font-display text-lg font-700 text-text-primary" style={{ fontWeight: 700 }}>
                              ${cartTotal.toLocaleString('es-AR')}
                            </span>
                          </div>

                          <motion.button
                            whileTap={{ scale: 0.97 }}
                            onClick={() => setStep('form')}
                            className="mt-4 w-full rounded-full bg-accent py-3.5 text-sm font-700 text-white shadow-glow-accent transition-all duration-200 hover:bg-accent-light active:scale-[0.98]"
                            style={{ fontWeight: 700 }}
                          >
                            Continuar con mi pedido
                          </motion.button>
                        </>
                      )}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="form"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.25 }}
                      className="px-5 py-4"
                    >
                      <p className="mb-4 text-sm text-text-secondary">
                        Completá tus datos para enviarnos el pedido por WhatsApp.
                      </p>

                      <div className="flex flex-col gap-3">
                        <Field
                          label="Nombre completo"
                          value={customer.name}
                          error={errors.name}
                          onChange={(v) => setCustomer((c) => ({ ...c, name: v }))}
                          placeholder="Ej: María González"
                        />
                        <Field
                          label="Dirección de entrega"
                          value={customer.address}
                          error={errors.address}
                          onChange={(v) => setCustomer((c) => ({ ...c, address: v }))}
                          placeholder="Calle, número, piso, etc."
                        />
                        <Field
                          label="Teléfono"
                          value={customer.phone}
                          error={errors.phone}
                          onChange={(v) => setCustomer((c) => ({ ...c, phone: v }))}
                          placeholder="+54 11 XXXX-XXXX"
                          type="tel"
                        />

                        <div>
                          <label className="mb-1.5 block text-xs font-600 text-text-secondary" style={{ fontWeight: 600 }}>
                            Método de pago
                          </label>
                          <div className="grid grid-cols-3 gap-2">
                            {(['efectivo', 'transferencia', 'tarjeta'] as const).map((method) => (
                              <button
                                key={method}
                                onClick={() => setCustomer((c) => ({ ...c, payment: method }))}
                                className={`rounded-xl px-3 py-2.5 text-xs font-600 capitalize transition-all duration-200 ${
                                  customer.payment === method
                                    ? 'bg-accent text-white shadow-glow-accent'
                                    : 'bg-bg-elevated text-text-secondary ring-1 ring-border hover:ring-border-strong'
                                }`}
                                style={{ fontWeight: 600 }}
                              >
                                {method === 'efectivo' ? '💵 Efectivo' : method === 'transferencia' ? '🏦 Transf.' : '💳 Tarjeta'}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="mb-1.5 block text-xs font-600 text-text-secondary" style={{ fontWeight: 600 }}>
                            Notas adicionales (opcional)
                          </label>
                          <textarea
                            value={customer.notes}
                            onChange={(e) => setCustomer((c) => ({ ...c, notes: e.target.value }))}
                            placeholder="Sin cebolla, alergia a... etc."
                            rows={3}
                            className="w-full resize-none rounded-xl bg-bg-elevated px-4 py-3 text-sm text-text-primary placeholder-text-muted ring-1 ring-border transition-all focus:outline-none focus:ring-accent/50"
                          />
                        </div>
                      </div>

                      <div className="mt-4 mb-2 flex items-center justify-between rounded-xl bg-bg-elevated px-4 py-3">
                        <span className="text-sm text-text-secondary">Total del pedido</span>
                        <span className="font-display text-lg font-700 text-text-primary" style={{ fontWeight: 700 }}>
                          ${cartTotal.toLocaleString('es-AR')}
                        </span>
                      </div>

                      <motion.button
                        whileTap={{ scale: 0.97 }}
                        onClick={handleConfirm}
                        className="mt-3 w-full flex items-center justify-center gap-2 rounded-full bg-[#25D366] py-3.5 text-sm font-700 text-white transition-all duration-200 hover:bg-[#1fb55a] active:scale-[0.98]"
                        style={{ fontWeight: 700 }}
                      >
                        <MessageCircle size={16} strokeWidth={1.5} />
                        Enviar pedido por WhatsApp
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

interface FieldProps {
  label: string;
  value: string;
  error?: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}

function Field({ label, value, error, onChange, placeholder, type = 'text' }: FieldProps) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-600 text-text-secondary" style={{ fontWeight: 600 }}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full rounded-xl bg-bg-elevated px-4 py-3 text-sm text-text-primary placeholder-text-muted ring-1 transition-all focus:outline-none focus:ring-accent/50 ${
          error ? 'ring-red-500/60' : 'ring-border'
        }`}
      />
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
}

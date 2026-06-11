import type { CartItem } from '../store/appStore';

export interface CustomerData {
  name: string;
  address: string;
  phone: string;
  payment: 'efectivo' | 'transferencia' | 'tarjeta';
  notes: string;
}

const WHATSAPP_NUMBER = '5491126541523';

const PAYMENT_LABELS: Record<CustomerData['payment'], string> = {
  efectivo: 'Efectivo',
  transferencia: 'Transferencia bancaria',
  tarjeta: 'Tarjeta de crédito/débito',
};

export function buildWhatsAppUrl(
  customer: CustomerData,
  cart: CartItem[],
  total: number
): string {
  const orderLines = cart
    .map(
      ({ menuItem, quantity }) =>
        `  • ${menuItem.name} x${quantity} — $${(menuItem.price * quantity).toLocaleString('es-AR')}`
    )
    .join('\n');

  const message = [
    '🍝 *Nuevo Pedido — Pasta & Panna*',
    '',
    '*Cliente:* ' + customer.name,
    '*Dirección:* ' + customer.address,
    '*Teléfono:* ' + customer.phone,
    '*Pago:* ' + PAYMENT_LABELS[customer.payment],
    customer.notes ? '*Notas:* ' + customer.notes : null,
    '',
    '*Pedido:*',
    orderLines,
    '',
    `*Total: $${total.toLocaleString('es-AR')}*`,
  ]
    .filter((line) => line !== null)
    .join('\n');

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

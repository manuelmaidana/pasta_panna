import type { CartItem } from '../store/appStore';

export interface CustomerData {
  name: string;
  address: string;

  piso: string;
  payment: 'efectivo' | 'mercadopago';
  deliveryZoneId: string;
  notes: string;
}

const WHATSAPP_NUMBER = '5491126541523';

const PAYMENT_LABELS: Record<CustomerData['payment'], string> = {
  efectivo: 'Efectivo',
  mercadopago: 'Mercado Pago/Transferencia',
};

export function buildWhatsAppUrl(
  customer: CustomerData,
  cart: CartItem[],
  total: number,
  deliveryZone: { name: string; price: number } | null
): string {
  const orderLines = cart
    .map(({ menuItem, quantity }) =>
      `• ${menuItem.name} x${quantity} — $${(menuItem.price * quantity).toLocaleString('es-AR')}`
    )
    .join('\n');

  const totalWithDelivery = total + (deliveryZone?.price ?? 0);
  const zoneText = deliveryZone
    ? `_${deliveryZone.name} ($${deliveryZone.price.toLocaleString('es-AR')})_`
    : '_Sin especificar_';

  const lines: (string | null)[] = [
    `*Nombre:*\n${customer.name}`,
    '',
    `*Dirección/Entre que calles:*\n${customer.address}`,
    '',

    `*Piso/Depto:*\n${customer.piso || '-'}`,
    '',
    `*Pago en efectivo o Mercado Pago/Transferencia?*\n${PAYMENT_LABELS[customer.payment]}`,
    '',
    `*Lo enviamos a:*\n${zoneText}`,
    '',
    customer.notes ? `*ACLARACIONES de tu Pedido:*\n_${customer.notes}_` : null,
    customer.notes ? '' : null,
    '*PEDIDO:*',
    orderLines,
    '',
    `*Total pedido: $${totalWithDelivery.toLocaleString('es-AR')}*`,
    '',
    'PASTA PANNA DELIVERY',
  ];

  const message = lines.filter((l) => l !== null).join('\n');
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

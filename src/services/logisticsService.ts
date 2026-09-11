import { LogisticsOrderRecord } from '../types';
import { addActivityLog } from './userService';

const LOGISTICS_STORAGE_KEY = 'rym_logistics_orders';

const initialLogisticsOrders: LogisticsOrderRecord[] = [
  {
    id: 'LOG-2026-114',
    orderDate: '11/09/2026',
    clientName: 'Ingeniería & Minas de Sandoná',
    destinationCity: 'Sandoná, Nariño',
    carrier: 'Transipiales Carga',
    trackingNumber: 'TRN-892410',
    itemsSummary: '6x Mangueras 2 Hilos 3/8" + 12x Racores Macho NPT',
    status: 'En Tránsito',
    estimatedDelivery: 'Hoy, 04:00 PM',
    managedBy: 'Lucero Adriana Ibarra',
    shippingCost: 28000,
    notes: 'Despacho prioritario para taladradora de roca.',
  },
  {
    id: 'LOG-2026-113',
    orderDate: '10/09/2026',
    clientName: 'Cooperativa Lechera Guachucal',
    destinationCity: 'Guachucal, Nariño',
    carrier: 'Cootranar Carga',
    trackingNumber: 'COOT-449102',
    itemsSummary: '10x Acoples Rápidos Agrícolas 1/2" + 20m Manguera Succión',
    status: 'Despachado',
    estimatedDelivery: '12/09/2026',
    managedBy: 'Lucero Adriana Ibarra',
    shippingCost: 35000,
    notes: 'Entrega en sede de acopio lechero.',
  },
  {
    id: 'LOG-2026-112',
    orderDate: '10/09/2026',
    clientName: 'Consorcio Vial Pasto-Mocoa',
    destinationCity: 'Mocoa, Putumayo',
    carrier: 'Envía Colvanes',
    trackingNumber: 'ENV-9081234',
    itemsSummary: '4x Mangueras 4 Espirales R12 1" + Bridas Código 61',
    status: 'En Alistamiento',
    estimatedDelivery: '13/09/2026',
    managedBy: 'Lucero Adriana Ibarra',
    shippingCost: 52000,
    notes: 'Alistado en bodega Pasto y embalado con protección espiral.',
  },
  {
    id: 'LOG-2026-111',
    orderDate: '09/09/2026',
    clientName: 'Agroindustrial del Pacífico',
    destinationCity: 'Tumaco, Nariño',
    carrier: 'Transipiales Carga',
    trackingNumber: 'TRN-890125',
    itemsSummary: '8x Mangueras Teflón Inox para líneas de vapor + racores inox',
    status: 'Entregado',
    estimatedDelivery: '10/09/2026',
    managedBy: 'Lucero Adriana Ibarra',
    shippingCost: 48000,
    notes: 'Recibido a conformidad en planta extractora.',
  },
];

export function getLogisticsOrders(): LogisticsOrderRecord[] {
  try {
    const raw = localStorage.getItem(LOGISTICS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(LOGISTICS_STORAGE_KEY, JSON.stringify(initialLogisticsOrders));
      return initialLogisticsOrders;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : initialLogisticsOrders;
  } catch {
    return initialLogisticsOrders;
  }
}

export function saveLogisticsOrders(orders: LogisticsOrderRecord[]): void {
  localStorage.setItem(LOGISTICS_STORAGE_KEY, JSON.stringify(orders));
}

export function addLogisticsOrder(
  newOrder: Omit<LogisticsOrderRecord, 'id'>,
  userId: string,
  userName: string
): LogisticsOrderRecord {
  const orders = getLogisticsOrders();
  const id = `LOG-2026-${String(orders.length + 115).padStart(3, '0')}`;
  const order: LogisticsOrderRecord = {
    ...newOrder,
    id,
  };
  orders.unshift(order);
  saveLogisticsOrders(orders);

  addActivityLog({
    userId,
    userName,
    action: 'Despacho Creado',
    details: `${userName} programó despacho ${order.id} destino ${order.destinationCity} (${order.carrier})`,
    category: 'logistics',
  });

  return order;
}

export function updateLogisticsOrder(
  updated: LogisticsOrderRecord,
  userId: string,
  userName: string
): void {
  const orders = getLogisticsOrders();
  const index = orders.findIndex((o) => o.id === updated.id);
  if (index !== -1) {
    orders[index] = updated;
    saveLogisticsOrders(orders);

    addActivityLog({
      userId,
      userName,
      action: 'Estado Despacho',
      details: `${userName} actualizó despacho ${updated.id} a "${updated.status}" (${updated.destinationCity})`,
      category: 'logistics',
    });
  }
}

export function deleteLogisticsOrder(
  id: string,
  userId: string,
  userName: string
): boolean {
  const orders = getLogisticsOrders();
  const target = orders.find((o) => o.id === id);
  if (!target) return false;

  const filtered = orders.filter((o) => o.id !== id);
  saveLogisticsOrders(filtered);

  addActivityLog({
    userId,
    userName,
    action: 'Eliminación Despacho',
    details: `${userName} eliminó el despacho/pedido ${target.id} (${target.destinationCity})`,
    category: 'logistics',
  });

  return true;
}

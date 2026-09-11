import { AccountingRecord } from '../types';
import { addActivityLog } from './userService';

const ACCOUNTING_STORAGE_KEY = 'rym_accounting_records';

const initialAccountingRecords: AccountingRecord[] = [
  {
    id: 'FAC-2026-081',
    date: '11/09/2026',
    invoiceNumber: 'FE-1042',
    clientName: 'Transportes Pasto-Ipiales S.A.S.',
    concept: '2x Ensamble Mangueras SAE 100R2 1/2" 420 Bar + 4x Racores JIC 3/8"',
    amount: 385000,
    paymentMethod: 'Transferencia Bancolombia',
    status: 'Cobrado',
    recordedBy: 'Juan Felipe Piscal',
    notes: 'Volqueta doble troque. Factura enviada por correo.',
  },
  {
    id: 'FAC-2026-080',
    date: '10/09/2026',
    invoiceNumber: 'FE-1041',
    clientName: 'Consorcio Vial del Sur',
    concept: '4x Mangueras 4 Espirales R12 3/4" para Retroexcavadora Caterpillar 320D',
    amount: 1250000,
    paymentMethod: 'Crédito 30 días',
    status: 'Cobrado',
    recordedBy: 'Juan Felipe Piscal',
    notes: 'Aprobado con orden de compra #OC-589.',
  },
  {
    id: 'FAC-2026-079',
    date: '09/09/2026',
    invoiceNumber: 'FE-1040',
    clientName: 'Hacienda Lechera El Encano',
    concept: '12x Acoples Rápidos Agrícolas ISO 7241-A Macho/Hembra 1/2" + Adaptadores NPT',
    amount: 460000,
    paymentMethod: 'Efectivo Mostrador',
    status: 'Cobrado',
    recordedBy: 'Juan Felipe Piscal',
    notes: 'Entregado en mostrador de la Av. Las Américas.',
  },
  {
    id: 'FAC-2026-078',
    date: '08/09/2026',
    invoiceNumber: 'FE-1039',
    clientName: 'Talleres Hidráulicos del Guaitara (Túquerres)',
    concept: 'Lote de 25 Racores Métricos Komatsu / DIN 24 + O-rings de repuesto',
    amount: 690000,
    paymentMethod: 'Nequi / Daviplata',
    status: 'Cobrado',
    recordedBy: 'Juan Felipe Piscal',
    notes: 'Despachado por Cootranar.',
  },
];

export function getAccountingRecords(): AccountingRecord[] {
  try {
    const raw = localStorage.getItem(ACCOUNTING_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(ACCOUNTING_STORAGE_KEY, JSON.stringify(initialAccountingRecords));
      return initialAccountingRecords;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : initialAccountingRecords;
  } catch {
    return initialAccountingRecords;
  }
}

export function saveAccountingRecords(records: AccountingRecord[]): void {
  localStorage.setItem(ACCOUNTING_STORAGE_KEY, JSON.stringify(records));
}

export function addAccountingRecord(
  newRecord: Omit<AccountingRecord, 'id'>,
  userId: string,
  userName: string
): AccountingRecord {
  const records = getAccountingRecords();
  const id = `FAC-2026-${String(records.length + 82).padStart(3, '0')}`;
  const record: AccountingRecord = {
    ...newRecord,
    id,
  };
  records.unshift(record);
  saveAccountingRecords(records);

  addActivityLog({
    userId,
    userName,
    action: 'Registro Contable',
    details: `${userName} registró venta/factura ${record.invoiceNumber} por $${record.amount.toLocaleString('es-CO')} (${record.clientName})`,
    category: 'accounting',
  });

  return record;
}

export function updateAccountingRecord(
  updated: AccountingRecord,
  userId: string,
  userName: string
): void {
  const records = getAccountingRecords();
  const index = records.findIndex((r) => r.id === updated.id);
  if (index !== -1) {
    records[index] = updated;
    saveAccountingRecords(records);

    addActivityLog({
      userId,
      userName,
      action: 'Actualización Contable',
      details: `${userName} actualizó registro contable ${updated.invoiceNumber} (${updated.status})`,
      category: 'accounting',
    });
  }
}

export function deleteAccountingRecord(
  id: string,
  userId: string,
  userName: string
): boolean {
  const records = getAccountingRecords();
  const target = records.find((r) => r.id === id);
  if (!target) return false;

  const filtered = records.filter((r) => r.id !== id);
  saveAccountingRecords(filtered);

  addActivityLog({
    userId,
    userName,
    action: 'Eliminación Contable',
    details: `${userName} eliminó registro contable ${target.invoiceNumber} (${target.clientName})`,
    category: 'accounting',
  });

  return true;
}

export interface Product {
  id: number;
  category: string;
  name: string;
  description: string;
  specs: string;
  image: string;
  estimatedPrice?: number;
}

export interface HoseType {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  specs: string[];
  image: string;
  maxPressureBar?: number;
}

export interface ServiceItem {
  id: number;
  title: string;
  description: string;
  icon: string;
  features: string[];
}

export interface SectorItem {
  id: number;
  name: string;
  description: string;
  icon: string;
}

export interface TestimonialItem {
  id: number;
  name: string;
  position: string;
  company: string;
  quote: string;
  image: string;
}

export interface QuoteCartItem {
  product: Product;
  quantity: number;
  notes?: string;
}

export interface CompanyInfo {
  name: string;
  fullName: string;
  nit: string;
  foundationYear: number;
  address: string;
  city: string;
  phoneMain: string;
  phoneWhatsapp: string;
  email: string;
  hoursWeekday: string;
  hoursSaturday: string;
  hoursSunday: string;
}

export interface GoogleSheetsDatabaseInfo {
  spreadsheetId: string;
  spreadsheetUrl: string;
  title: string;
  connectedAt: string;
  lastSyncedAt?: string;
  sheetsCount?: number;
  totalProductsCount?: number;
  totalQuotesCount?: number;
}

export interface CustomerQuoteRecord {
  id: string;
  timestamp: string;
  clientName: string;
  companyName: string;
  phone: string;
  email: string;
  city: string;
  sector: string;
  requestType: string;
  itemsSummary: string;
  totalQuantity: number;
  notes: string;
  status: 'Pendiente' | 'En Gestión' | 'Cotizado' | 'Cerrado';
  assignedTo?: string;
  internalNotes?: string;
}

export interface AdminUser {
  id: string;
  name: string;
  role: string;
  title: string;
  email: string;
  phone: string;
  pin: string;
  active: boolean;
  isOwner?: boolean;
  avatarColor: string;
  initials: string;
  lastLogin?: string;
  permissions: {
    allAccess: boolean;
    canDeleteAll: boolean;
    manageUsers: boolean;
    manageQuotes: boolean;
    manageAccounting: boolean;
    manageInventory: boolean;
    manageLogistics: boolean;
    accessGoogleSheets: boolean;
  };
}

export interface AccountingRecord {
  id: string;
  date: string;
  invoiceNumber: string;
  clientName: string;
  concept: string;
  amount: number;
  paymentMethod: 'Transferencia Bancolombia' | 'Efectivo Mostrador' | 'Crédito 30 días' | 'Nequi / Daviplata';
  status: 'Cobrado' | 'Pendiente' | 'Anulado';
  recordedBy: string;
  notes?: string;
}

export interface LogisticsOrderRecord {
  id: string;
  orderDate: string;
  clientName: string;
  destinationCity: string;
  carrier: string;
  trackingNumber: string;
  itemsSummary: string;
  status: 'En Alistamiento' | 'Despachado' | 'En Tránsito' | 'Entregado';
  estimatedDelivery: string;
  managedBy: string;
  shippingCost?: number;
  notes?: string;
}

export interface ActivityLogItem {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: string;
  details: string;
  category: 'auth' | 'quotes' | 'inventory' | 'users' | 'sheets' | 'accounting' | 'logistics';
}

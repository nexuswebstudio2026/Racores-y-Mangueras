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

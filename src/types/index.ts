// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'pharmacist' | 'cashier';
}

// Batch Types
export type BatchType = 'A' | 'B' | 'C';

export interface Batch {
  type: BatchType;
  quantity: number;
  expiryDate: string;
}

// Medicine Types
export interface Medicine {
  id: string;
  name: string;
  barcode: string;
  batches: Batch[];
  stock: number;
  price: number;
  manufacturer: string;
  category: string;
  transitionDays?: {
    cToB: number; // Days before expiry to move from C to B
    bToA: number; // Days before expiry to move from B to A
  };
}

// Customer Types
export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  loyaltyPoints: number;
}

// Bill Types
export interface BillItem {
  medicineId: string;
  medicineName: string;
  batchType: BatchType;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Bill {
  id: string;
  customerId?: string;
  items: BillItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  date: string;
}
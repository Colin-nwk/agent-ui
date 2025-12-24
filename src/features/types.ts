export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'SALE' | 'PAYMENT' | 'ALERT' | 'TASK';
  read: boolean;
  time: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  price: number;
  stock: number;
  isSerialize: boolean;
}

export interface Package {
  id: string;
  name: string;
  items: string[];
  price: number;
}

export interface Device {
  sn: string;
  model: string;
}

export interface Sale {
  id: string;
  customer: string;
  customerId?: string;
  product: string;
  amount: number;
  status: 'COMPLETED' | 'PENDING';
  date: string;
  paymentPlan: string;
  devices: string[];
}

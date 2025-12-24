
export const DB_NAME = 'ubuxa_db';
export const DB_VERSION = 2; // Incremented version for schema change

const STORES = {
  CUSTOMERS: 'customers',
  INVENTORY: 'inventory',
  PACKAGES: 'packages',
  SALES: 'sales',
  SALES_REQUESTS: 'sales_requests', // New Store
  DEVICES: 'devices',
  SYNC_QUEUE: 'sync_queue'
};

// Seed Data
const MOCK_CUSTOMERS = [
  { id: '1', name: 'Kathleen Pfeffer', email: 'angela98@gmail.com', phone: '+234 801 234 5678', address: '12 Lekki Phase 1' },
  { id: '2', name: 'Ericka Considine', email: 'carlo34@yahoo.com', phone: '+234 702 345 6789', address: '45 Victoria Island' },
  { id: '3', name: 'Edmond Schulist', email: 'jude_armstrong@hotmail.com', phone: '+234 903 456 7890', address: '8 Ikeja GRA' },
  { id: '4', name: 'Brionna O\'Keefe', email: 'elnora@hotmail.com', phone: '+234 814 567 8901', address: '22 Yaba Tech' },
];

const MOCK_INVENTORY = [
  { id: 'I1', name: 'Canadian Solar 450W', price: 120000, stock: 150, isSerialize: false },
  { id: 'I2', name: 'Solar Hub Pro v2', price: 85000, stock: 45, isSerialize: true },
  { id: 'I3', name: 'Luminous 220Ah Battery', price: 280000, stock: 12, isSerialize: false },
  { id: 'I4', name: 'Felicity 3.5kVA Inverter', price: 450000, stock: 8, isSerialize: false },
  { id: 'I5', name: 'Charge Controller 60A', price: 45000, stock: 25, isSerialize: false },
];

const MOCK_PACKAGES = [
  { id: 'P1', name: 'Starter Home Bundle', items: ['2x 450W Panel', '1x Solar Hub', '1x Battery'], price: 450000 },
  { id: 'P2', name: 'Elite Power System', items: ['4x 450W Panel', '1x Solar Hub Pro', '2x Battery'], price: 1250000 },
  { id: 'P3', name: 'Basic Light Package', items: ['1x 200W Panel', '1x Controller', '1x LED Pack'], price: 65000 },
];

const MOCK_DEVICES = [
  { sn: 'SN-X91-001', model: 'Solar Hub Pro v2' },
  { sn: 'SN-X91-002', model: 'Solar Hub Pro v2' },
  { sn: 'SN-X91-003', model: 'Solar Hub Pro v2' },
  { sn: 'SN-X91-004', model: 'Solar Hub Pro v2' },
  { sn: 'SN-Z88-005', model: 'Inverter Smart 5k' },
];

const MOCK_SALES = [
  { id: 'SL-2024-001', customer: 'Kathleen Pfeffer', product: 'Starter Home Bundle', amount: 450000, status: 'COMPLETED', date: 'Oct 12, 2024', paymentPlan: 'OUTRIGHT', devices: ['SN-X91-001'] },
  { id: 'SL-2024-002', customer: 'Ericka Considine', product: 'Solar Hub Pro v2', amount: 85000, status: 'PENDING', date: 'Oct 11, 2024', paymentPlan: 'FINANCED', devices: ['SN-X91-002'] },
];

export const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      console.error('Database error:', request.error);
      reject(request.error);
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // Create Stores
      if (!db.objectStoreNames.contains(STORES.CUSTOMERS)) {
        const store = db.createObjectStore(STORES.CUSTOMERS, { keyPath: 'id' });
        MOCK_CUSTOMERS.forEach(c => store.add(c));
      }
      if (!db.objectStoreNames.contains(STORES.INVENTORY)) {
        const store = db.createObjectStore(STORES.INVENTORY, { keyPath: 'id' });
        MOCK_INVENTORY.forEach(i => store.add(i));
      }
      if (!db.objectStoreNames.contains(STORES.PACKAGES)) {
        const store = db.createObjectStore(STORES.PACKAGES, { keyPath: 'id' });
        MOCK_PACKAGES.forEach(p => store.add(p));
      }
      if (!db.objectStoreNames.contains(STORES.DEVICES)) {
        const store = db.createObjectStore(STORES.DEVICES, { keyPath: 'sn' });
        MOCK_DEVICES.forEach(d => store.add(d));
      }
      if (!db.objectStoreNames.contains(STORES.SALES)) {
        const store = db.createObjectStore(STORES.SALES, { keyPath: 'id' });
        MOCK_SALES.forEach(s => store.add(s));
      }
      if (!db.objectStoreNames.contains(STORES.SALES_REQUESTS)) {
        db.createObjectStore(STORES.SALES_REQUESTS, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORES.SYNC_QUEUE)) {
        db.createObjectStore(STORES.SYNC_QUEUE, { keyPath: 'id', autoIncrement: true });
      }
    };
  });
};

export const getAllFromStore = async (storeName: string): Promise<any[]> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const addItemToStore = async (storeName: string, item: any) => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.add(item);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const updateItemInStore = async (storeName: string, item: any) => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.put(item); // put updates if key exists

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const deleteFromStore = async (storeName: string, key: string) => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.delete(key);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const addToSyncQueue = async (action: { type: string, payload: any }) => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORES.SYNC_QUEUE], 'readwrite');
    const store = transaction.objectStore(STORES.SYNC_QUEUE);
    const request = store.add({ ...action, timestamp: Date.now() });

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const getSyncQueueCount = async (): Promise<number> => {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORES.SYNC_QUEUE], 'readonly');
      const store = transaction.objectStore(STORES.SYNC_QUEUE);
      const request = store.count();
  
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
};

export const clearSyncQueue = async () => {
    const db = await initDB();
    return new Promise<void>((resolve, reject) => {
      const transaction = db.transaction([STORES.SYNC_QUEUE], 'readwrite');
      const store = transaction.objectStore(STORES.SYNC_QUEUE);
      const request = store.clear();
  
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
};

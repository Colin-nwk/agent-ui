
import React, { useMemo } from 'react';
import { DataTable, DropdownMenu } from './Shared';
import { ColumnDef } from '@tanstack/react-table';
import { Package, ArrowLeftRight, Edit3, ShoppingBag, AlertTriangle } from 'lucide-react';

const MOCK_INVENTORY = [
  { id: '1', name: 'Canadian Solar 450W Panel', stock: 150, price: 120000, type: 'PRODUCT', sku: 'SKU-SLR-450' },
  { id: '2', name: 'Luminous 220Ah Battery', stock: 45, price: 280000, type: 'BATTERY', sku: 'SKU-BAT-220' },
  { id: '3', name: 'Felicity 5kVA Inverter', stock: 12, price: 550000, type: 'INVERTER', sku: 'SKU-INV-005' },
  { id: '4', name: 'Solar Cable 4mm (100m)', stock: 8, price: 35000, type: 'ACCESSORY', sku: 'SKU-CAB-004' },
  { id: '5', name: 'Smart Meter Pro', stock: 35, price: 15000, type: 'PRODUCT', sku: 'SKU-MET-001' },
];

const InventoryList: React.FC = () => {
  const columns = useMemo<ColumnDef<any>[]>(() => [
    {
      accessorKey: 'sku',
      header: 'SKU',
      cell: info => <span className="font-mono text-[10px] font-bold text-slate-400">{String(info.getValue())}</span>,
    },
    {
      accessorKey: 'name',
      header: 'Item Name',
      cell: info => (
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded flex items-center justify-center text-slate-400">
             <Package size={14} />
          </div>
          <span className="font-bold text-slate-900 dark:text-white">{String(info.getValue())}</span>
        </div>
      ),
    },
    {
      accessorKey: 'type',
      header: 'Category',
      cell: info => <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{String(info.getValue())}</span>,
    },
    {
      accessorKey: 'stock',
      header: 'Availability',
      cell: info => {
        const stock = Number(info.getValue());
        return (
          <div className="flex items-center space-x-2">
            <span className={`font-bold ${stock < 10 ? 'text-red-500' : 'text-slate-900 dark:text-white'}`}>{stock} Units</span>
            {stock < 10 && <AlertTriangle size={12} className="text-red-500" />}
          </div>
        );
      },
    },
    {
      accessorKey: 'price',
      header: 'Unit Price',
      cell: info => <span className="font-bold text-slate-900 dark:text-white">₦{Number(info.getValue()).toLocaleString()}</span>,
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: () => (
        <DropdownMenu 
          trigger={<button className="p-2 hover:bg-gold hover:text-slate-900 rounded-lg transition-colors bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">Update</button>}
          items={[
            { label: 'Edit Details', icon: <Edit3 size={14} />, onClick: () => {} },
            { label: 'Request Restock', icon: <ArrowLeftRight size={14} />, onClick: () => {} },
            { label: 'Internal Transfer', icon: <ShoppingBag size={14} />, onClick: () => {} },
          ]}
        />
      ),
    }
  ], []);

  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-slate-900 dark:text-white">Inventory Management</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Monitor stock levels across all categories.</p>
        </div>
      </div>

      <DataTable 
        data={MOCK_INVENTORY} 
        columns={columns} 
        searchPlaceholder="Find items by SKU or Name..."
      />
    </div>
  );
};

export default InventoryList;

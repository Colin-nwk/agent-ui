
import React, { useMemo, useState } from 'react';
import { DataTable, DropdownMenu, SideDrawer, SecondaryButton, PrimaryButton } from './Shared';
import { ColumnDef } from '@tanstack/react-table';
import { Eye, FileText, Trash2, ShoppingCart, Calendar, DollarSign, User, Clock, Smartphone, ShieldCheck, AlertCircle } from 'lucide-react';

const MOCK_SALES = [
  { id: 'SL-2024-001', customer: 'Kathleen Pfeffer', product: 'Starter Home Bundle', amount: 450000, status: 'COMPLETED', date: '2024-10-12', payment: 'MOMO', paymentPlan: 'FINANCED', devices: ['SN-X91-001'] },
  { id: 'SL-2024-002', customer: 'Ericka Considine', product: 'Solar Hub Pro v2', amount: 85000, status: 'PENDING', date: '2024-10-11', payment: 'BANK', paymentPlan: 'OUTRIGHT', devices: ['SN-X91-002'] },
  { id: 'SL-2024-003', customer: 'Edmond Schulist', product: 'Luminous 220Ah Battery', amount: 280000, status: 'COMPLETED', date: '2024-10-10', payment: 'CASH', paymentPlan: 'OUTRIGHT', devices: [] },
  { id: 'SL-2024-004', customer: 'John Smith', product: 'Canadian Solar 450W', amount: 120000, status: 'COMPLETED', date: '2024-10-09', payment: 'MOMO', paymentPlan: 'OUTRIGHT', devices: [] },
  { id: 'SL-2024-005', customer: 'Jane Doe', product: 'Elite Power System', amount: 980000, status: 'PENDING', date: '2024-10-08', payment: 'BANK', paymentPlan: 'FINANCED', devices: ['SN-X91-003', 'SN-X91-004'] },
];

const SalesList: React.FC = () => {
  const [selectedSale, setSelectedSale] = useState<any | null>(null);

  const columns = useMemo<ColumnDef<any>[]>(() => [
    {
      accessorKey: 'id',
      header: 'ID',
      cell: info => <span className="font-mono text-[11px] font-bold text-slate-500 dark:text-slate-400">{String(info.getValue())}</span>,
    },
    {
      accessorKey: 'customer',
      header: 'Client Name',
      cell: info => <span className="font-bold text-slate-900 dark:text-white">{String(info.getValue())}</span>,
    },
    {
      accessorKey: 'product',
      header: 'Items Purchased',
      cell: info => <span className="text-slate-600 dark:text-slate-300 truncate max-w-[180px] inline-block">{String(info.getValue())}</span>,
    },
    {
      accessorKey: 'amount',
      header: 'Revenue',
      cell: info => <span className="font-bold text-gold">₦{Number(info.getValue()).toLocaleString()}</span>,
    },
    {
      accessorKey: 'payment',
      header: 'Method',
      cell: info => <span className="text-[10px] font-bold bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-500 dark:text-slate-400">{String(info.getValue())}</span>,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: info => {
        const status = String(info.getValue());
        return (
          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
            status === 'COMPLETED' ? 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 
            status === 'PENDING' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400'
          }`}>
            {status}
          </span>
        );
      },
    },
    {
      accessorKey: 'date',
      header: 'Date Created',
      cell: info => <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{String(info.getValue())}</span>,
    },
    {
      id: 'actions',
      header: 'Options',
      cell: (info) => (
        <DropdownMenu 
          trigger={<button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg font-bold text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-sm transition-all hover:border-gold">Review</button>}
          items={[
            { label: 'Full Audit', icon: <Eye size={14} />, onClick: () => setSelectedSale(info.row.original) },
            { label: 'Download Receipt', icon: <FileText size={14} />, onClick: () => {} },
            { label: 'Void Transaction', icon: <Trash2 size={14} />, onClick: () => {}, variant: 'danger' },
          ]}
        />
      ),
    }
  ], []);

  return (
    <div className="space-y-6 animate-in slide-in-from-left-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-slate-900 dark:text-white">Sales Transaction Logs</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Detailed historical view of all recorded deals.</p>
        </div>
      </div>

      <DataTable 
        data={MOCK_SALES} 
        columns={columns} 
        searchPlaceholder="Filter transactions..."
      />

      <SideDrawer
        isOpen={!!selectedSale}
        onClose={() => setSelectedSale(null)}
        title="Transaction Audit"
        subtitle={`Audit log for sale ${selectedSale?.id}`}
        footer={
          <div className="flex space-x-4">
            <SecondaryButton className="flex-1" icon={<FileText size={18} />}>
              Export Audit
            </SecondaryButton>
            <PrimaryButton className="flex-1" icon={<ShieldCheck size={18} />}>
              Support
            </PrimaryButton>
          </div>
        }
      >
        {selectedSale && (
          <div className="space-y-8 animate-in fade-in duration-500">
            {/* Status Header */}
            <div className="p-6 bg-slate-900 dark:bg-slate-950 rounded-[2rem] text-white flex items-center justify-between shadow-xl">
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                  selectedSale.status === 'COMPLETED' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'
                }`}>
                  <ShoppingCart size={24} />
                </div>
                <div>
                  <h4 className="text-xl font-bold">{selectedSale.status}</h4>
                  <p className="text-xs text-slate-400 uppercase tracking-widest">{selectedSale.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-400 font-bold uppercase mb-1">Total</p>
                <p className="text-2xl font-serif font-bold text-gold">₦{selectedSale.amount.toLocaleString()}</p>
              </div>
            </div>

            {/* Customer Section */}
            <div className="space-y-4">
              <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-2">Customer Info</h5>
              <div className="p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] flex items-center space-x-4 shadow-sm">
                <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-400">
                  <User size={24} />
                </div>
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">{selectedSale.customer}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Linked to Account #{selectedSale.id.split('-').pop()}</p>
                </div>
              </div>
            </div>

            {/* Product Section */}
            <div className="space-y-4">
              <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-2">Order Breakdown</h5>
              <div className="p-5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[2.5rem] space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500 dark:text-slate-400">Primary Product</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">{selectedSale.product}</span>
                </div>
                <div className="flex justify-between items-center border-t border-slate-200 dark:border-slate-700 pt-4">
                  <span className="text-sm text-slate-500 dark:text-slate-400">Payment Plan</span>
                  <span className="text-xs font-bold bg-slate-200 dark:bg-slate-700 px-2.5 py-1 rounded-lg text-slate-700 dark:text-slate-300">{selectedSale.paymentPlan}</span>
                </div>
                <div className="flex justify-between items-center border-t border-slate-200 dark:border-slate-700 pt-4">
                  <span className="text-sm text-slate-500 dark:text-slate-400">Registration Time</span>
                  <span className="text-sm text-slate-600 dark:text-slate-300 flex items-center space-x-1">
                    <Clock size={12} />
                    <span>09:42 AM</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Devices Section */}
            {selectedSale.devices && selectedSale.devices.length > 0 && (
              <div className="space-y-4">
                <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-2">Hardware Units</h5>
                <div className="space-y-2">
                  {selectedSale.devices.map((sn: string) => (
                    <div key={sn} className="p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl flex items-center space-x-3 shadow-sm group hover:border-gold transition-colors">
                      <Smartphone size={18} className="text-slate-400 group-hover:text-gold" />
                      <span className="text-sm font-mono font-bold text-slate-700 dark:text-slate-300">{sn}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Footer Alert */}
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30 rounded-2xl flex items-start space-x-3">
              <AlertCircle size={18} className="text-blue-500 mt-0.5" />
              <p className="text-[11px] text-blue-600 dark:text-blue-400 font-medium">This transaction audit is locked. Contact your Regional Manager for modifications.</p>
            </div>
          </div>
        )}
      </SideDrawer>
    </div>
  );
};

export default SalesList;

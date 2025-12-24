
import React, { useState, useMemo } from 'react';
import { 
  ArrowDownLeft, 
  ArrowUpRight, 
  Search, 
  Filter, 
  Download, 
  Calendar,
  Wallet,
  RefreshCcw,
  CheckCircle2,
  XCircle,
  Clock
} from 'lucide-react';
import { DataTable, PrimaryButton, Select, Input, Toast } from './Shared';
import { ColumnDef } from '@tanstack/react-table';

const MOCK_TRANSACTIONS = [
  { id: 'TXN-8821', type: 'PAYMENT', amount: 450000, date: '2024-03-15', status: 'SUCCESS', desc: 'Solar Kit Full Payment', method: 'Bank Transfer', customer: 'Kathleen Pfeffer' },
  { id: 'TXN-8822', type: 'COMMISSION', amount: 22500, date: '2024-03-15', status: 'SUCCESS', desc: 'Commission for TXN-8821', method: 'Wallet Credit', customer: '-' },
  { id: 'TXN-8823', type: 'PAYMENT', amount: 15000, date: '2024-03-14', status: 'PENDING', desc: 'Monthly Installment', method: 'MOMO', customer: 'Ericka Considine' },
  { id: 'TXN-8824', type: 'REVERSAL', amount: 5000, date: '2024-03-12', status: 'FAILED', desc: 'Failed Deduction', method: 'Card', customer: 'John Doe' },
  { id: 'TXN-8825', type: 'PAYMENT', amount: 85000, date: '2024-03-10', status: 'SUCCESS', desc: 'Inverter Purchase', method: 'Cash', customer: 'Edmond Schulist' },
  { id: 'TXN-8826', type: 'PAYMENT', amount: 20000, date: '2024-03-09', status: 'SUCCESS', desc: 'Service Fee', method: 'MOMO', customer: 'Brionna O\'Keefe' },
  { id: 'TXN-8827', type: 'COMMISSION', amount: 1000, date: '2024-03-09', status: 'SUCCESS', desc: 'Bonus', method: 'Wallet Credit', customer: '-' },
];

const Transactions: React.FC = () => {
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [toast, setToast] = useState<{ title: string; message: string; type: any } | null>(null);

  const handleExport = () => {
    setToast({ title: 'Export Initiated', message: 'Your transaction report is being generated and will download shortly.', type: 'info' });
    // Mock export logic
    setTimeout(() => {
      setToast({ title: 'Download Complete', message: 'Transactions_Report_2024.xlsx has been saved.', type: 'success' });
    }, 2000);
  };

  const filteredData = useMemo(() => {
    return MOCK_TRANSACTIONS.filter(item => {
      const matchType = filterType === 'ALL' || item.type === filterType;
      const itemDate = new Date(item.date);
      const afterStart = !dateFrom || itemDate >= new Date(dateFrom);
      const beforeEnd = !dateTo || itemDate <= new Date(dateTo);
      return matchType && afterStart && beforeEnd;
    });
  }, [filterType, dateFrom, dateTo]);

  const columns = useMemo<ColumnDef<any>[]>(() => [
    {
      accessorKey: 'id',
      header: 'ID',
      cell: info => <span className="font-mono text-[10px] sm:text-xs font-bold text-slate-500 dark:text-slate-400">{info.getValue() as string}</span>,
    },
    {
      accessorKey: 'desc',
      header: 'Description',
      cell: info => (
         <div className="min-w-[140px]">
            <p className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm truncate">{info.getValue() as string}</p>
            <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 truncate">{info.row.original.customer}</p>
         </div>
      )
    },
    {
      accessorKey: 'type',
      header: 'Type',
      cell: info => {
         const type = info.getValue() as string;
         return (
            <div className="flex items-center space-x-1.5 sm:space-x-2">
               {type === 'PAYMENT' && <ArrowDownLeft size={16} className="text-green-500 shrink-0" />}
               {type === 'COMMISSION' && <Wallet size={16} className="text-blue-500 shrink-0" />}
               {type === 'REVERSAL' && <RefreshCcw size={16} className="text-red-500 shrink-0" />}
               <span className="text-[10px] sm:text-xs font-bold uppercase hidden sm:inline">{type}</span>
            </div>
         )
      }
    },
    {
      accessorKey: 'date',
      header: 'Date',
      cell: info => <span className="text-[10px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 whitespace-nowrap">{info.getValue() as string}</span>,
    },
    {
      accessorKey: 'amount',
      header: 'Amount',
      cell: info => {
         const val = info.getValue() as number;
         const type = info.row.original.type;
         return <span className={`font-bold text-xs sm:text-sm ${type === 'REVERSAL' ? 'text-slate-900 dark:text-white' : 'text-primary'}`}>₦{val.toLocaleString()}</span>
      }
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: info => {
        const status = info.getValue() as string;
        let color = 'bg-slate-100 text-slate-600';
        let Icon = Clock;
        if (status === 'SUCCESS') { color = 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400'; Icon = CheckCircle2; }
        if (status === 'FAILED') { color = 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400'; Icon = XCircle; }
        if (status === 'PENDING') { color = 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'; Icon = Clock; }
        
        return (
          <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase flex items-center w-fit space-x-1 ${color}`}>
            <Icon size={12} />
            <span>{status}</span>
          </span>
        );
      },
    },
  ], []);

  return (
    <div className="space-y-6 sm:space-y-8 animate-in slide-in-from-right-4 duration-500 pb-20 lg:pb-0">
      {toast && (
        <Toast 
          title={toast.title} 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Financial Ledger</h1>
           <p className="text-slate-500 dark:text-slate-400 font-medium text-xs sm:text-sm mt-1">Audit payments, commissions and wallet adjustments</p>
        </div>
        <PrimaryButton icon={<Download size={20} />} onClick={handleExport}>
           Export to Excel
        </PrimaryButton>
      </div>

      <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center space-x-2 text-slate-900 dark:text-white font-bold text-sm uppercase tracking-widest mb-2">
           <Filter size={16} />
           <span>Filter Transactions</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
           <div className="md:col-span-2 space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Date Range</label>
              <div className="flex items-center space-x-2">
                 <div className="relative flex-1 group">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input 
                      type="date" 
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                      value={dateFrom}
                      onChange={(e) => setDateFrom(e.target.value)}
                    />
                 </div>
                 <span className="text-slate-400">-</span>
                 <div className="relative flex-1 group">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input 
                      type="date" 
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                      value={dateTo}
                      onChange={(e) => setDateTo(e.target.value)}
                    />
                 </div>
              </div>
           </div>

           <div className="md:col-span-2">
              <Select 
                label="Transaction Type" 
                value={filterType} 
                onChange={(e) => setFilterType(e.target.value)}
              >
                 <option value="ALL">All Types</option>
                 <option value="PAYMENT">Payments (Inbound)</option>
                 <option value="COMMISSION">Commissions (Earnings)</option>
                 <option value="REVERSAL">Reversals (Corrections)</option>
              </Select>
           </div>
        </div>
      </div>

      <DataTable 
        data={filteredData} 
        columns={columns} 
        searchPlaceholder="Search by ID, Description or Client..."
      />
    </div>
  );
};

export default Transactions;

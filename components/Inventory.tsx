
import React, { useState, useMemo } from 'react';
import { 
  Package, 
  Plus, 
  ArrowLeftRight, 
  ShoppingBag, 
  ChevronLeft as ChevronLeftIcon, 
  ChevronRight as ChevronRightIcon,
  Clock,
  CheckCircle2,
  Truck,
  Building2,
} from 'lucide-react';
import { Tabs, Toast } from './Shared';

const MOCK_INVENTORY = [
  { id: '1', name: 'Canadian Solar 450W Panel', stock: 150, price: 120000, type: 'PRODUCT' },
  { id: '2', name: 'Luminous 220Ah Battery', stock: 45, price: 280000, type: 'BATTERY' },
  { id: '3', name: 'Felicity 5kVA Inverter', stock: 12, price: 550000, type: 'INVERTER' },
  { id: '4', name: 'Solar Cable 4mm (100m)', stock: 8, price: 35000, type: 'ACCESSORY' },
  { id: '5', name: 'Smart Meter Pro', stock: 35, price: 15000, type: 'PRODUCT' },
  { id: '6', name: 'Battery Rack 48V', stock: 20, price: 85000, type: 'ACCESSORY' },
];

const MOCK_REQUESTS = [
  { id: 'REQ-001', item: 'Canadian Solar 450W Panel', qty: 50, store: 'Main Hub Lagos', status: 'RECEIVED', date: '2024-03-10' },
  { id: 'REQ-002', item: 'Luminous 220Ah Battery', qty: 20, store: 'Abuja Distribution', status: 'SHIPPED', date: '2024-03-14' },
  { id: 'REQ-003', item: 'Felicity 5kVA Inverter', qty: 5, store: 'Main Hub Lagos', status: 'PENDING', date: '2024-03-15' },
];

const STORES = ['Main Hub Lagos', 'Abuja Distribution', 'Port Harcourt Outlet'];
const ITEMS_PER_PAGE = 4;

const Inventory: React.FC = () => {
  const [activeTab, setActiveTab] = useState('stock');
  const [isRequestDrawerOpen, setIsRequestDrawerOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [toast, setToast] = useState<{ title: string; message: string; type: any } | null>(null);

  const showToast = (title: string, message: string, type: string = 'success') => {
    setToast({ title, message, type });
  };

  const handleConfirmReceipt = (reqId: string) => {
    showToast('Stock Confirmed', `Inventory for ${reqId} has been added to your local stock.`);
  };

  const totalPages = Math.ceil((activeTab === 'stock' ? MOCK_INVENTORY.length : MOCK_REQUESTS.length) / ITEMS_PER_PAGE);
  
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const source = activeTab === 'stock' ? MOCK_INVENTORY : MOCK_REQUESTS;
    return source.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [activeTab, currentPage]);

  const inventoryTabs = [
    { id: 'stock', label: 'Local Stock', icon: <Package size={14} /> },
    { id: 'requests', label: 'Restock', icon: <ArrowLeftRight size={14} /> }
  ];

  return (
    <div className="space-y-6 sm:space-y-8 animate-in slide-in-from-right-4 duration-500 pb-24 lg:pb-8">
      {toast && (
        <Toast 
          title={toast.title} 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Inventory</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-xs sm:text-sm mt-1">Audit components and manage hub replenishment</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
          <div className="flex-1 lg:w-80">
            <Tabs tabs={inventoryTabs} activeTab={activeTab} onChange={(id) => { setActiveTab(id); setCurrentPage(1); }} />
          </div>
          <button 
            onClick={() => setIsRequestDrawerOpen(true)}
            className="bg-ubuxa-gradient text-white px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl font-bold flex items-center justify-center space-x-2 sm:space-x-3 shadow-xl shadow-ubuxa-blue/20 hover:scale-[1.02] transition-all active:scale-95 text-sm sm:text-base"
          >
            <Plus size={20} strokeWidth={3} />
            <span>Restock Hub</span>
          </button>
        </div>
      </div>

      {activeTab === 'stock' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-8">
          {paginatedData.map((item: any) => (
            <div key={item.id} className="bg-white dark:bg-slate-900 rounded-[2rem] sm:rounded-[3rem] shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden group hover:border-ubuxa-blue dark:hover:border-ubuxa-blue transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 active:scale-[0.98]">
              <div className="relative aspect-[4/3] bg-slate-50 dark:bg-slate-800 overflow-hidden">
                <img src={`https://picsum.photos/seed/${item.id}/400/300`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-90 group-hover:opacity-100" alt={item.name} />
                <div className="absolute top-4 left-4 sm:top-6 sm:left-6">
                   <span className={`px-3 py-1 sm:px-4 sm:py-1.5 rounded-lg sm:rounded-xl text-[8px] sm:text-[10px] font-black uppercase tracking-widest shadow-lg ${
                     item.stock < 10 ? 'bg-red-500 text-white' : 'bg-ubuxa-blue text-white'
                   }`}>
                     {item.type}
                   </span>
                </div>
              </div>
              
              <div className="p-6 sm:p-8">
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-1 sm:mb-2 truncate italic">{item.name}</h3>
                <p className="text-ubuxa-blue font-black text-xl sm:text-2xl tracking-tighter">₦{item.price.toLocaleString()}</p>
                
                <div className="flex items-center justify-between pt-6 sm:pt-8 mt-4 border-t border-slate-50 dark:border-slate-800">
                  <div className="flex flex-col">
                    <span className="text-[9px] sm:text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest">Available</span>
                    <span className={`text-xl sm:text-2xl font-black mt-1 ${item.stock < 10 ? 'text-red-500' : 'text-slate-900 dark:text-white'}`}>{item.stock}</span>
                  </div>
                  <button className="w-12 h-12 sm:w-14 sm:h-14 bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 rounded-xl sm:rounded-2xl flex items-center justify-center hover:bg-ubuxa-gradient hover:text-white transition-all shadow-inner active:scale-90">
                    <ShoppingBag size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4 sm:space-y-5">
          {paginatedData.map((req: any) => (
            <div key={req.id} className="bg-white dark:bg-slate-900 p-5 sm:p-8 rounded-[1.5rem] sm:rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6 sm:gap-8 group hover:border-ubuxa-blue dark:hover:border-ubuxa-blue transition-all duration-300 relative overflow-hidden active:bg-slate-50 dark:active:bg-slate-800">
              <div className="flex items-center space-x-4 sm:space-x-8 min-w-0">
                <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-[1.5rem] flex items-center justify-center transition-all shadow-inner shrink-0 ${
                  req.status === 'PENDING' ? 'bg-slate-100 dark:bg-slate-800 text-slate-400' : 
                  req.status === 'SHIPPED' ? 'bg-blue-50 dark:bg-blue-900/30 text-ubuxa-blue' : 'bg-blue-100 dark:bg-blue-900/50 text-ubuxa-blue'
                }`}>
                  {req.status === 'PENDING' ? <Clock size={24} /> : req.status === 'SHIPPED' ? <Truck size={24} /> : <CheckCircle2 size={24} />}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-x-2 sm:gap-x-4 mb-1 sm:mb-2">
                    <h4 className="font-bold text-slate-900 dark:text-white text-base sm:text-lg italic tracking-tight truncate">{req.item}</h4>
                    <span className="text-[8px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 shrink-0">{req.id}</span>
                  </div>
                  
                  <div className="flex items-center space-x-4 sm:space-x-6 text-slate-500 dark:text-slate-400 overflow-hidden">
                    <p className="text-[11px] sm:text-sm font-medium flex items-center space-x-1.5 truncate">
                       <Building2 size={14} className="text-ubuxa-blue shrink-0" />
                       <span className="truncate">{req.store}</span>
                    </p>
                    <div className="h-3 sm:h-4 w-px bg-slate-200 dark:bg-slate-700 shrink-0"></div>
                    <p className="text-[11px] sm:text-sm font-bold text-slate-900 dark:text-white shrink-0">
                       {req.qty} Units
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between sm:justify-end gap-4 border-t border-slate-100 dark:border-slate-800 sm:border-t-0 pt-4 sm:pt-0">
                <span className={`px-4 sm:px-6 py-1.5 sm:py-2 rounded-lg sm:rounded-2xl text-[9px] sm:text-[10px] font-black uppercase tracking-widest border transition-all ${
                  req.status === 'PENDING' ? 'bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-100 dark:border-slate-700' : 
                  req.status === 'SHIPPED' ? 'bg-blue-50 dark:bg-blue-900/30 text-ubuxa-blue border-blue-200 dark:border-blue-800 animate-pulse' : 'bg-blue-600 text-white border-blue-600'
                }`}>
                  {req.status}
                </span>
                
                {req.status === 'SHIPPED' ? (
                  <button 
                    onClick={() => handleConfirmReceipt(req.id)}
                    className="flex-1 sm:flex-none px-6 sm:px-8 py-2.5 sm:py-3 bg-ubuxa-gradient text-white rounded-lg sm:rounded-2xl font-bold text-xs sm:text-sm shadow-xl shadow-ubuxa-blue/20 active:scale-95 transition-all whitespace-nowrap uppercase tracking-widest"
                  >
                    Receive
                  </button>
                ) : (
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-50 dark:bg-slate-800 rounded-lg sm:rounded-2xl flex items-center justify-center text-slate-300 dark:text-slate-600 group-hover:bg-ubuxa-blue group-hover:text-white transition-all shadow-sm">
                    <ChevronRightIcon size={20} />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="px-6 py-4 sm:px-10 sm:py-6 bg-white dark:bg-slate-900 rounded-2xl sm:rounded-[3rem] border border-slate-100 dark:border-slate-800 flex items-center justify-between shadow-sm">
          <span className="text-[9px] sm:text-[11px] font-black text-slate-400 uppercase tracking-widest">
            Page {currentPage} / {totalPages}
          </span>
          <div className="flex space-x-2 sm:space-x-3">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl sm:rounded-2xl flex items-center justify-center text-slate-400 hover:text-ubuxa-blue active:scale-90 disabled:opacity-30 transition-all"
            >
              <ChevronLeftIcon size={18} />
            </button>
            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl sm:rounded-2xl flex items-center justify-center text-slate-400 hover:text-ubuxa-blue active:scale-90 disabled:opacity-30 transition-all"
            >
              <ChevronRightIcon size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;

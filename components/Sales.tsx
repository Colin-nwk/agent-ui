
import React, { useState, useMemo, useEffect } from 'react';
import { 
  ShoppingCart, 
  Plus, 
  DollarSign, 
  CheckCircle2,
  Search,
  Package,
  X,
  User,
  Minus,
  Smartphone,
  Check,
  ChevronLeft,
  LayoutGrid,
  List,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  ChevronRight,
  Hash,
  Clock,
  FileText,
  Calendar,
  MapPin,
  PenTool,
  FilePlus,
  Shield,
  Users,
  Truck,
  CreditCard,
  RefreshCw,
  Edit,
  Trash2,
  Send,
  Archive,
  CloudOff,
  Globe
} from 'lucide-react';
import { BottomSheetModal, PrimaryButton, SecondaryButton, Input, SignaturePad, Select, FileUpload, Tabs, Toast } from './Shared';
import { getAllFromStore, addItemToStore, addToSyncQueue, updateItemInStore, deleteFromStore } from '../utils/db';

const ITEMS_PER_PAGE = 5;

// Mock Agent Status (In a real app, this comes from Auth Context)
const AGENT_IS_VERIFIED = true; 

const Sales: React.FC = () => {
  // DB Data State
  const [dbCustomers, setDbCustomers] = useState<any[]>([]);
  const [dbInventory, setDbInventory] = useState<any[]>([]);
  const [dbPackages, setDbPackages] = useState<any[]>([]);
  const [dbDevices, setDbDevices] = useState<any[]>([]);
  const [dbSales, setDbSales] = useState<any[]>([]);
  const [dbSalesRequests, setDbSalesRequests] = useState<any[]>([]);

  // ---- View State ----
  const [activeView, setActiveView] = useState('history'); // 'history' | 'requests'
  const [requestTab, setRequestTab] = useState('sent'); // 'sent' | 'awaiting'
  const [toast, setToast] = useState<{ title: string; message: string; type: any } | null>(null);

  // ---- Existing Wizard State ----
  const [showDrawer, setShowDrawer] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);
  const [listSearchQuery, setListSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSaleDetails, setSelectedSaleDetails] = useState<any>(null);
  
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [cart, setCart] = useState<any[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<any>(null);
  const [assignedDevices, setAssignedDevices] = useState<string[]>([]);
  const [paymentPlan, setPaymentPlan] = useState('OUTRIGHT');
  const [selectionMode, setSelectionMode] = useState<'PACKAGE' | 'ITEMS'>('PACKAGE');
  const [installAddress, setInstallAddress] = useState('');
  const [installDate, setInstallDate] = useState('');
  const [signature, setSignature] = useState<string | null>(null);

  // Wizard Search States
  const [custSearch, setCustSearch] = useState('');
  const [pkgSearch, setPkgSearch] = useState('');
  const [invSearch, setInvSearch] = useState('');
  const [devSearch, setDevSearch] = useState('');

  // ---- New Sales Request State ----
  const [showRequestSheet, setShowRequestSheet] = useState(false);
  const [editingRequestId, setEditingRequestId] = useState<string | null>(null);
  const [requestStep, setRequestStep] = useState(1);
  const [reqData, setReqData] = useState({
    // Customer
    firstName: '', lastName: '', phone: '', email: '', address: '',
    addressState: '', addressLGA: '', addressType: 'Home',
    // Package
    packageId: '', packageName: '', packagePrice: 0,
    // Payment
    paymentType: 'FINANCED', downPayment: '', tenor: '12',
    // Identity
    idType: 'NIN', idNumber: '', idImage: null as any, idExpiry: '',
    // Guarantor
    guarantorName: '', guarantorPhone: '', guarantorRel: 'Family', 
    guarantorEmail: '', guarantorAddress: '', guarantorIdType: 'NIN', guarantorIdNumber: '',
    guarantorSignature: null as string | null,
    // Logistics
    deviceSns: [] as string[],
    nokName: '', nokPhone: '',
    installFee: '', accessoriesCost: '',
  });

  // Fetch Data on Mount
  useEffect(() => {
    const fetchData = async () => {
        try {
            const [c, i, p, d, s, reqs] = await Promise.all([
                getAllFromStore('customers'),
                getAllFromStore('inventory'),
                getAllFromStore('packages'),
                getAllFromStore('devices'),
                getAllFromStore('sales'),
                getAllFromStore('sales_requests')
            ]);
            
            setDbCustomers(c);
            setDbInventory(i);
            setDbPackages(p);
            setDbDevices(d);
            setDbSales(s.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()));
            setDbSalesRequests(reqs.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()));
        } catch (e) {
            console.error("Failed to load DB data", e);
        }
    };
    fetchData();
  }, [isSuccess]); 

  // --- Reset Functions ---
  const resetWizard = () => {
    setShowDrawer(false);
    setWizardStep(1);
    setIsSuccess(false);
    setSelectedCustomer(null);
    setCart([]);
    setSelectedPackage(null);
    setAssignedDevices([]);
    setPaymentPlan('OUTRIGHT');
    setSelectionMode('PACKAGE');
    setInstallAddress('');
    setInstallDate('');
    setSignature(null);
  };

  const resetRequestFlow = () => {
      setShowRequestSheet(false);
      setEditingRequestId(null);
      setRequestStep(1);
      setReqData({
        firstName: '', lastName: '', phone: '', email: '', address: '',
        addressState: '', addressLGA: '', addressType: 'Home',
        packageId: '', packageName: '', packagePrice: 0,
        paymentType: 'FINANCED', downPayment: '', tenor: '12',
        idType: 'NIN', idNumber: '', idImage: null, idExpiry: '',
        guarantorName: '', guarantorPhone: '', guarantorRel: 'Family',
        guarantorEmail: '', guarantorAddress: '', guarantorIdType: 'NIN', guarantorIdNumber: '',
        guarantorSignature: null,
        deviceSns: [],
        nokName: '', nokPhone: '',
        installFee: '', accessoriesCost: '',
      });
  };

  // --- Actions ---
  const completeSale = async () => {
    const newSale = {
        id: `SL-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        customer: selectedCustomer?.name,
        customerId: selectedCustomer?.id,
        product: selectionMode === 'PACKAGE' ? selectedPackage?.name : 'Custom Bundle',
        amount: totalPrice,
        status: navigator.onLine ? 'COMPLETED' : 'PENDING',
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        paymentPlan: paymentPlan,
        devices: assignedDevices,
        installAddress,
        installDate,
        signature
    };
    await addItemToStore('sales', newSale);
    if (!navigator.onLine) await addToSyncQueue({ type: 'CREATE_SALE', payload: newSale });
    setTimeout(() => setIsSuccess(true), 800);
  };

  const completeRequest = async () => {
      const isOffline = !navigator.onLine;
      
      // PRD Logic: Verified Agent gets Verified Status immediately (simulated), Unverified gets Pending
      // In a real backend, this status is determined by the server.
      const initialStatus = AGENT_IS_VERIFIED ? 'APPROVED' : 'PENDING_APPROVAL';
      
      const newRequest = {
          id: editingRequestId || `REQ-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
          ...reqData,
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          status: initialStatus,
          syncStatus: isOffline ? 'PENDING_SYNC' : 'SYNCED',
          lastModified: Date.now(),
          // Generate temp account if verified (simulated)
          tempAccount: AGENT_IS_VERIFIED ? `99${Math.floor(10000000 + Math.random() * 90000000)}` : null,
          tempAccountExpiry: AGENT_IS_VERIFIED ? Date.now() + 3600000 : null // 1 hour
      };
      
      if (editingRequestId) {
          await updateItemInStore('sales_requests', newRequest);
          setToast({ title: 'Request Updated', message: 'Changes have been saved successfully.', type: 'success' });
      } else {
          await addItemToStore('sales_requests', newRequest);
          if (AGENT_IS_VERIFIED) {
             setToast({ title: 'Request Approved', message: 'Temporary account generated for payment.', type: 'success' });
          } else {
             setToast({ title: 'Request Submitted', message: 'Sent for admin approval.', type: 'info' });
          }
      }

      if (isOffline) {
          await addToSyncQueue({ type: 'CREATE_REQUEST', payload: newRequest });
          setToast({ title: 'Saved Offline', message: 'Request will sync when online.', type: 'warning' });
      }
      
      resetRequestFlow();
      setIsSuccess(true);
  };

  const handleRetrySync = async (req: any) => {
      const updated = { ...req, syncStatus: 'SYNCED', lastModified: Date.now() };
      await updateItemInStore('sales_requests', updated);
      setIsSuccess(prev => !prev); 
      setToast({ title: 'Synced Successfully', message: 'Request has been sent to the server.', type: 'success' });
  };

  const handleDeleteRequest = async (id: string) => {
      await deleteFromStore('sales_requests', id);
      setIsSuccess(prev => !prev);
      setToast({ title: 'Request Deleted', message: 'The local request has been removed.', type: 'info' });
  };

  const handleEditRequest = (req: any) => {
      setReqData({
          firstName: req.firstName, lastName: req.lastName, phone: req.phone, email: req.email, address: req.address,
          addressState: req.addressState || '', addressLGA: req.addressLGA || '', addressType: req.addressType || 'Home',
          packageId: req.packageId, packageName: req.packageName, packagePrice: req.packagePrice,
          paymentType: req.paymentType, downPayment: req.downPayment, tenor: req.tenor,
          idType: req.idType, idNumber: req.idNumber, idImage: req.idImage, idExpiry: req.idExpiry || '',
          guarantorName: req.guarantorName, guarantorPhone: req.guarantorPhone, guarantorRel: req.guarantorRel,
          guarantorEmail: req.guarantorEmail || '', guarantorAddress: req.guarantorAddress || '', 
          guarantorIdType: req.guarantorIdType || 'NIN', guarantorIdNumber: req.guarantorIdNumber || '',
          guarantorSignature: req.guarantorSignature || null,
          deviceSns: req.deviceSns,
          nokName: req.nokName, nokPhone: req.nokPhone,
          installFee: req.installFee, accessoriesCost: req.accessoriesCost
      });
      setEditingRequestId(req.id);
      setShowRequestSheet(true);
  };

  // --- Calculations ---
  const totalPrice = useMemo(() => {
    if (selectionMode === 'PACKAGE' && selectedPackage) return selectedPackage.price;
    if (selectionMode === 'ITEMS') return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    return 0;
  }, [cart, selectedPackage, selectionMode]);

  const updateCart = (item: any, delta: number) => {
    const existing = cart.find(c => c.id === item.id);
    if (existing) {
      const newQty = existing.quantity + delta;
      if (newQty <= 0) setCart(cart.filter(c => c.id !== item.id));
      else setCart(cart.map(c => c.id === item.id ? { ...c, quantity: newQty } : c));
    } else if (delta > 0) {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const needsDevices = useMemo(() => {
    if (selectionMode === 'ITEMS') return cart.some(item => item.isSerialize);
    if (selectionMode === 'PACKAGE' && selectedPackage) return selectedPackage.items.some((i: string) => i.toLowerCase().includes('hub') || i.toLowerCase().includes('inverter'));
    return false;
  }, [cart, selectedPackage, selectionMode]);

  // --- Filtering ---
  const filteredCustomers = useMemo(() => dbCustomers.filter(c => c.name.toLowerCase().includes(custSearch.toLowerCase()) || c.phone.includes(custSearch)), [dbCustomers, custSearch]);
  const filteredPackages = useMemo(() => dbPackages.filter(p => p.name.toLowerCase().includes(pkgSearch.toLowerCase())), [dbPackages, pkgSearch]);
  const filteredInventory = useMemo(() => dbInventory.filter(i => i.name.toLowerCase().includes(invSearch.toLowerCase())), [dbInventory, invSearch]);
  const filteredDevices = useMemo(() => dbDevices.filter(d => d.sn.toLowerCase().includes(devSearch.toLowerCase()) || d.model.toLowerCase().includes(devSearch.toLowerCase())), [dbDevices, devSearch]);
  
  // Filter for Sales History
  const filteredSales = useMemo(() => dbSales.filter(s => s.customer?.toLowerCase().includes(listSearchQuery.toLowerCase()) || s.product?.toLowerCase().includes(listSearchQuery.toLowerCase()) || s.id.toLowerCase().includes(listSearchQuery.toLowerCase())), [dbSales, listSearchQuery]);
  const salesTotalPages = Math.ceil(filteredSales.length / ITEMS_PER_PAGE);
  const paginatedSales = filteredSales.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  // Filter for Requests
  const filteredRequests = useMemo(() => {
      let filtered = dbSalesRequests;
      if (requestTab === 'sent') {
          // Assume synced if status is SYNCED or undefined (legacy)
          filtered = filtered.filter(r => r.syncStatus === 'SYNCED' || !r.syncStatus);
      } else {
          filtered = filtered.filter(r => r.syncStatus === 'PENDING_SYNC');
      }
      return filtered.filter(r => (r.firstName + ' ' + r.lastName).toLowerCase().includes(listSearchQuery.toLowerCase()) || r.packageName.toLowerCase().includes(listSearchQuery.toLowerCase()));
  }, [dbSalesRequests, requestTab, listSearchQuery]);

  // --- Wizard Navigation ---
  const handleNext = () => {
    if (wizardStep === 1 && selectedCustomer) { setInstallAddress(selectedCustomer.address || ''); setWizardStep(2); } 
    else if (wizardStep === 2) setWizardStep(3);
    else if (wizardStep === 3) setWizardStep(needsDevices ? 4 : 5);
    else if (wizardStep === 4) setWizardStep(5);
    else if (wizardStep === 5) setWizardStep(6);
    else completeSale();
  };
  const handleBack = () => { if (wizardStep === 5 && !needsDevices) setWizardStep(3); else setWizardStep(prev => prev - 1); };
  const isStepValid = () => {
      if (wizardStep === 1) return !!selectedCustomer;
      if (wizardStep === 2) return cart.length > 0 || !!selectedPackage;
      if (wizardStep === 3) return installAddress.length > 3 && !!installDate;
      if (wizardStep === 4) return true;
      if (wizardStep === 5) return !!signature;
      return true;
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in slide-in-from-left-4 duration-500 pb-20 lg:pb-0">
      {toast && (
        <Toast 
          title={toast.title} 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Sales Records</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-xs sm:text-sm mt-1">Audit transactions and initialize new deployments</p>
        </div>
        <div className="flex space-x-3">
            <SecondaryButton 
                onClick={() => setShowRequestSheet(true)}
                className="shadow-lg shadow-slate-200 dark:shadow-slate-900/50"
                icon={<FilePlus size={18} />}
            >
                Create Request
            </SecondaryButton>
            <button 
            onClick={() => setShowDrawer(true)}
            className="bg-ubuxa-gradient text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold flex items-center justify-center space-x-2 sm:space-x-3 shadow-xl shadow-ubuxa-blue/20 hover:scale-[1.02] transition-all active:scale-95 text-sm sm:text-base"
            >
            <Plus size={20} strokeWidth={3} />
            <span>New Sale</span>
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8">
        <div className="bg-slate-900 dark:bg-slate-950 p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] text-white shadow-xl relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-ubuxa-blue/10 rounded-full blur-2xl" />
          <p className="text-slate-400 text-[9px] sm:text-[10px] font-black uppercase tracking-widest mb-2">Today's Revenue</p>
          <h3 className="text-3xl sm:text-4xl font-bold tracking-tight italic">₦280,000</h3>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] shadow-sm flex flex-col justify-center">
          <p className="text-slate-400 text-[9px] sm:text-[10px] font-black uppercase tracking-widest mb-3">Goal Progress</p>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">56%</h3>
            <span className="text-ubuxa-blue font-black text-xs">₦2.8M / 5M</span>
          </div>
          <div className="w-full h-2 sm:h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-ubuxa-gradient rounded-full shadow-lg" style={{ width: '56%' }}></div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] flex items-center justify-between shadow-sm">
            <div>
              <p className="text-slate-400 text-[9px] sm:text-[10px] font-black uppercase tracking-widest mb-2">Commissions</p>
              <h3 className="text-2xl sm:text-4xl font-bold text-slate-900 dark:text-white italic tracking-tight">₦124,500</h3>
            </div>
            <div className="p-4 sm:p-5 bg-blue-50 dark:bg-blue-900/20 text-ubuxa-blue rounded-2xl shrink-0"><DollarSign className="w-6 h-6 sm:w-7 sm:h-7" /></div>
        </div>
      </div>

      {/* --- Main Content Area: Tabs for History vs Requests --- */}
      <div className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl w-fit border border-slate-200 dark:border-slate-800">
         <button onClick={() => { setActiveView('history'); setCurrentPage(1); }} className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeView === 'history' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>Sales History</button>
         <button onClick={() => { setActiveView('requests'); setCurrentPage(1); }} className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeView === 'requests' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>Request Queue</button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[2rem] sm:rounded-[3.5rem] shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
        {activeView === 'requests' && (
            <div className="px-6 sm:px-10 pt-6 sm:pt-8 flex items-center space-x-6 border-b border-slate-100 dark:border-slate-800 pb-0">
               <button onClick={() => setRequestTab('sent')} className={`pb-4 text-sm font-bold border-b-4 transition-all flex items-center space-x-2 ${requestTab === 'sent' ? 'border-ubuxa-blue text-ubuxa-blue' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>
                   <Send size={16} />
                   <span>Sent Requests</span>
               </button>
               <button onClick={() => setRequestTab('awaiting')} className={`pb-4 text-sm font-bold border-b-4 transition-all flex items-center space-x-2 ${requestTab === 'awaiting' ? 'border-amber-500 text-amber-500' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>
                   <CloudOff size={16} />
                   <span>Awaiting Sync</span>
                   {dbSalesRequests.filter(r => r.syncStatus === 'PENDING_SYNC').length > 0 && <span className="bg-amber-100 dark:bg-amber-900 text-amber-600 text-[9px] px-1.5 py-0.5 rounded-full ml-1">{dbSalesRequests.filter(r => r.syncStatus === 'PENDING_SYNC').length}</span>}
               </button>
            </div>
        )}

        <div className="p-6 sm:p-10 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
             <div className="p-2 sm:p-3 bg-blue-50 dark:bg-blue-900/30 text-ubuxa-blue rounded-lg sm:rounded-xl shrink-0">
                {activeView === 'history' ? <Archive size={18} /> : <FileText size={18} />}
             </div>
             <h3 className="font-bold text-slate-900 dark:text-white text-base sm:text-lg">
                {activeView === 'history' ? 'Completed Transactions' : requestTab === 'sent' ? 'Sent & In Review' : 'Offline Drafts'}
             </h3>
          </div>
          <div className="relative group w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-ubuxa-blue transition-colors" size={16} />
            <input 
              type="text" 
              value={listSearchQuery}
              onChange={(e) => { setListSearchQuery(e.target.value); setCurrentPage(1); }}
              placeholder="Search records..." 
              className="w-full pl-10 pr-4 py-2 sm:py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-[11px] sm:text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-ubuxa-blue transition-all"
            />
          </div>
        </div>
        
        {/* Sales History List */}
        {activeView === 'history' ? (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {paginatedSales.map((sale) => (
              <div key={sale.id} onClick={() => setSelectedSaleDetails(sale)} className="p-5 sm:p-8 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer group active:bg-slate-100 dark:active:bg-slate-800">
                <div className="flex items-center space-x-4 sm:space-x-8 min-w-0">
                  <div className={`w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all shadow-sm shrink-0 ${
                      sale.status === 'COMPLETED' ? 'bg-blue-50 dark:bg-blue-900/30 text-ubuxa-blue' : 
                      'bg-slate-100 dark:bg-slate-800 text-slate-400'
                  }`}>
                      <ShoppingCart size={20} />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm sm:text-lg group-hover:text-ubuxa-blue transition-colors tracking-tight truncate">{sale.customer}</h4>
                    <p className="text-[9px] sm:text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1 truncate">{sale.product} • <span className="text-slate-500">{sale.id}</span></p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 sm:space-x-8 shrink-0">
                  <div className="text-right hidden sm:block">
                    <p className="font-black text-slate-900 dark:text-white text-lg italic tracking-tight">₦{sale.amount.toLocaleString()}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">{sale.date}</p>
                  </div>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-slate-50 dark:bg-slate-800 rounded-lg sm:rounded-xl flex items-center justify-center text-slate-300 dark:text-slate-600 group-hover:bg-ubuxa-blue group-hover:text-white transition-all"><ChevronRightIcon size={18} /></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Sales Requests List */
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
             {filteredRequests.map((req) => (
                <div key={req.id} className="p-5 sm:p-8 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all group">
                   <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center space-x-4 sm:space-x-6 min-w-0 cursor-pointer" onClick={() => setSelectedSaleDetails({...req, status: 'REQUEST'})}>
                         <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border shrink-0 ${requestTab === 'sent' ? 'bg-blue-50 border-blue-100 text-blue-500' : 'bg-amber-50 border-amber-100 text-amber-500'}`}>
                            {requestTab === 'sent' ? <Send size={20} /> : <CloudOff size={20} />}
                         </div>
                         <div className="min-w-0">
                             <div className="flex items-center space-x-2">
                                <h4 className="font-bold text-slate-900 dark:text-white text-base truncate">{req.firstName} {req.lastName}</h4>
                                <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-slate-500">{req.id}</span>
                             </div>
                             <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 truncate">{req.packageName} • ₦{(req.packagePrice + Number(req.installFee) + Number(req.accessoriesCost)).toLocaleString()}</p>
                             <p className="text-xs text-slate-400 mt-1">Updated: {new Date(req.lastModified || Date.now()).toLocaleDateString()}</p>
                         </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 sm:ml-auto pl-16 sm:pl-0">
                         {requestTab === 'awaiting' ? (
                            <>
                                <button onClick={() => handleRetrySync(req)} className="p-2.5 bg-ubuxa-gradient text-white rounded-xl shadow-lg shadow-primary/20 hover:scale-105 transition-transform flex items-center space-x-2" title="Retry Sync">
                                   <RefreshCw size={16} />
                                   <span className="text-xs font-bold hidden sm:inline">Sync</span>
                                </button>
                                <button onClick={() => handleEditRequest(req)} className="p-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors" title="Edit">
                                   <Edit size={16} />
                                </button>
                                <button onClick={() => handleDeleteRequest(req.id)} className="p-2.5 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors" title="Delete">
                                   <Trash2 size={16} />
                                </button>
                            </>
                         ) : (
                            <div className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 ${req.status === 'APPROVED' ? 'bg-green-100 text-green-700' : 'bg-blue-50 text-blue-600'}`}>
                               <CheckCircle2 size={14} />
                               <span>{req.status === 'APPROVED' ? 'Approved' : 'Pending Review'}</span>
                            </div>
                         )}
                      </div>
                   </div>
                </div>
             ))}
             {filteredRequests.length === 0 && (
                 <div className="p-12 text-center text-slate-400 flex flex-col items-center">
                     <FileText size={40} className="mb-4 opacity-20" />
                     <p className="font-medium">No requests found in this queue.</p>
                 </div>
             )}
          </div>
        )}

        {/* Pagination (Only for Sales History) */}
        {activeView === 'history' && salesTotalPages > 1 && (
          <div className="px-6 py-4 sm:px-10 sm:py-6 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-[9px] sm:text-[11px] font-black text-slate-400 uppercase tracking-widest">Page {currentPage} of {salesTotalPages}</span>
            <div className="flex space-x-2">
              <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="w-10 h-10 sm:w-12 sm:h-12 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl sm:rounded-2xl flex items-center justify-center text-slate-400 disabled:opacity-30 hover:border-ubuxa-blue active:scale-90 transition-all shadow-sm"><ChevronLeft size={18} /></button>
              <button onClick={() => setCurrentPage(p => Math.min(salesTotalPages, p + 1))} disabled={currentPage === salesTotalPages} className="w-10 h-10 sm:w-12 sm:h-12 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl sm:rounded-2xl flex items-center justify-center text-slate-400 disabled:opacity-30 hover:border-ubuxa-blue active:scale-90 transition-all shadow-sm"><ChevronRight size={18} /></button>
            </div>
          </div>
        )}
      </div>

      {/* --- Sales Request Bottom Sheet (Multi-Step) --- */}
      <BottomSheetModal
        isOpen={showRequestSheet}
        onClose={resetRequestFlow}
        title={editingRequestId ? "Edit Request" : "Create Sales Request"}
      >
        <div className="space-y-6 pb-20">
            {/* Progress Bar */}
            <div className="flex items-center space-x-2 mb-4">
                {[...Array(9)].map((_, i) => (
                    <div key={i} className={`h-1 flex-1 rounded-full ${i + 1 <= requestStep ? 'bg-ubuxa-blue' : 'bg-slate-200 dark:bg-slate-700'}`} />
                ))}
            </div>

            {requestStep === 1 && (
                <div className="space-y-4 animate-in slide-in-from-right-4">
                    <h4 className="font-bold text-lg text-slate-900 dark:text-white">Customer Registration</h4>
                    <div className="grid grid-cols-2 gap-4">
                        <Input label="First Name" value={reqData.firstName} onChange={e => setReqData({...reqData, firstName: e.target.value})} placeholder="Jane" />
                        <Input label="Last Name" value={reqData.lastName} onChange={e => setReqData({...reqData, lastName: e.target.value})} placeholder="Doe" />
                    </div>
                    <Input label="Phone Number" value={reqData.phone} onChange={e => setReqData({...reqData, phone: e.target.value})} placeholder="+234..." type="tel" icon={<Smartphone size={18} />} />
                    <Input label="Email (Optional)" value={reqData.email} onChange={e => setReqData({...reqData, email: e.target.value})} placeholder="email@example.com" type="email" />
                    <div className="space-y-4">
                        <Input label="Street Address" value={reqData.address} onChange={e => setReqData({...reqData, address: e.target.value})} icon={<MapPin size={18} />} />
                        <div className="grid grid-cols-2 gap-4">
                            <Select label="State" value={reqData.addressState} onChange={e => setReqData({...reqData, addressState: e.target.value})}>
                                <option value="">Select State</option>
                                <option value="Lagos">Lagos</option>
                                <option value="Abuja">Abuja</option>
                                <option value="Rivers">Rivers</option>
                            </Select>
                            <Input label="LGA" value={reqData.addressLGA} onChange={e => setReqData({...reqData, addressLGA: e.target.value})} placeholder="Local Govt." />
                        </div>
                        <Select label="Address Type" value={reqData.addressType} onChange={e => setReqData({...reqData, addressType: e.target.value})}>
                            <option value="Home">Home</option>
                            <option value="Work">Work</option>
                        </Select>
                    </div>
                </div>
            )}

            {requestStep === 2 && (
                <div className="space-y-4 animate-in slide-in-from-right-4">
                    <h4 className="font-bold text-lg text-slate-900 dark:text-white">Package Selection</h4>
                    <div className="relative group mb-4">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input type="text" placeholder="Search packages..." className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm" onChange={(e) => setPkgSearch(e.target.value)} />
                    </div>
                    <div className="space-y-3">
                        {filteredPackages.map(pkg => (
                            <div key={pkg.id} onClick={() => setReqData({...reqData, packageId: pkg.id, packageName: pkg.name, packagePrice: pkg.price})} 
                                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${reqData.packageId === pkg.id ? 'border-ubuxa-blue bg-blue-50 dark:bg-blue-900/30' : 'border-slate-100 dark:border-slate-800'}`}>
                                <div className="flex justify-between">
                                    <span className="font-bold text-slate-900 dark:text-white">{pkg.name}</span>
                                    <span className="font-bold text-ubuxa-blue">₦{pkg.price.toLocaleString()}</span>
                                </div>
                                <p className="text-xs text-slate-500 mt-1">{pkg.items.slice(0, 3).join(', ')}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {requestStep === 3 && (
                <div className="space-y-4 animate-in slide-in-from-right-4">
                    <h4 className="font-bold text-lg text-slate-900 dark:text-white">Parameters</h4>
                    <Select label="Payment Plan" value={reqData.paymentType} onChange={e => setReqData({...reqData, paymentType: e.target.value})}>
                        <option value="OUTRIGHT">Outright Purchase</option>
                        <option value="FINANCED">Financed (Installments)</option>
                    </Select>
                    {reqData.paymentType === 'FINANCED' && (
                        <>
                            <Input label="Down Payment (₦)" type="number" value={reqData.downPayment} onChange={e => setReqData({...reqData, downPayment: e.target.value})} icon={<CreditCard size={18} />} />
                            <Select label="Repayment Tenor" value={reqData.tenor} onChange={e => setReqData({...reqData, tenor: e.target.value})}>
                                <option value="3">3 Months</option>
                                <option value="6">6 Months</option>
                                <option value="12">12 Months</option>
                                <option value="24">24 Months</option>
                            </Select>
                        </>
                    )}
                </div>
            )}

            {requestStep === 4 && (
                <div className="space-y-4 animate-in slide-in-from-right-4">
                    <h4 className="font-bold text-lg text-slate-900 dark:text-white">Customer Identification</h4>
                    <div className="grid grid-cols-2 gap-4">
                        <Select label="ID Type" value={reqData.idType} onChange={e => setReqData({...reqData, idType: e.target.value})}>
                            <option value="NIN">National Identity Number</option>
                            <option value="VOTERS">Voter's Card</option>
                            <option value="DL">Driver's License</option>
                            <option value="PASSPORT">Intl. Passport</option>
                        </Select>
                        <Input label="ID Expiration" type="date" value={reqData.idExpiry} onChange={e => setReqData({...reqData, idExpiry: e.target.value})} />
                    </div>
                    <Input label="ID Number" value={reqData.idNumber} onChange={e => setReqData({...reqData, idNumber: e.target.value})} icon={<Hash size={18} />} />
                    <FileUpload 
                        label="Upload ID Image" 
                        onChange={(files) => setReqData({...reqData, idImage: files[0]})} 
                    />
                </div>
            )}

            {requestStep === 5 && (
                <div className="space-y-4 animate-in slide-in-from-right-4">
                    <h4 className="font-bold text-lg text-slate-900 dark:text-white">Guarantor Information</h4>
                    <Input label="Full Name" value={reqData.guarantorName} onChange={e => setReqData({...reqData, guarantorName: e.target.value})} icon={<User size={18} />} />
                    <div className="grid grid-cols-2 gap-4">
                        <Input label="Phone Number" value={reqData.guarantorPhone} onChange={e => setReqData({...reqData, guarantorPhone: e.target.value})} type="tel" icon={<Smartphone size={18} />} />
                        <Select label="Relationship" value={reqData.guarantorRel} onChange={e => setReqData({...reqData, guarantorRel: e.target.value})}>
                            <option value="Family">Family Member</option>
                            <option value="Colleague">Colleague</option>
                            <option value="Friend">Friend</option>
                            <option value="Community_Leader">Community Leader</option>
                        </Select>
                    </div>
                    <Input label="Email Address (Optional)" type="email" value={reqData.guarantorEmail} onChange={e => setReqData({...reqData, guarantorEmail: e.target.value})} />
                    <Input label="Full Address" value={reqData.guarantorAddress} onChange={e => setReqData({...reqData, guarantorAddress: e.target.value})} icon={<MapPin size={18} />} />
                    
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                        <p className="text-xs font-bold text-slate-400 uppercase mb-2">Guarantor Verification</p>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <Select label="ID Type" value={reqData.guarantorIdType} onChange={e => setReqData({...reqData, guarantorIdType: e.target.value})}>
                                <option value="NIN">NIN</option>
                                <option value="DL">Driver's License</option>
                            </Select>
                            <Input label="ID Number" value={reqData.guarantorIdNumber} onChange={e => setReqData({...reqData, guarantorIdNumber: e.target.value})} />
                        </div>
                        <SignaturePad label="Guarantor Signature" onChange={(sig) => setReqData({...reqData, guarantorSignature: sig})} />
                    </div>
                </div>
            )}

            {requestStep === 6 && (
                <div className="space-y-4 animate-in slide-in-from-right-4">
                    <h4 className="font-bold text-lg text-slate-900 dark:text-white">Link Devices (Optional)</h4>
                    <div className="relative group mb-4">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input type="text" placeholder="Scan or search serial..." className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm" onChange={(e) => setDevSearch(e.target.value)} />
                    </div>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                        {filteredDevices.map(dev => (
                            <div key={dev.sn} onClick={() => {
                                const newSns = reqData.deviceSns.includes(dev.sn) ? reqData.deviceSns.filter(s => s !== dev.sn) : [...reqData.deviceSns, dev.sn];
                                setReqData({...reqData, deviceSns: newSns});
                            }} className={`flex items-center justify-between p-3 rounded-xl border-2 cursor-pointer ${reqData.deviceSns.includes(dev.sn) ? 'border-ubuxa-blue bg-blue-50 dark:bg-blue-900/20' : 'border-slate-100 dark:border-slate-800'}`}>
                                <span className="font-mono text-sm font-bold text-slate-700 dark:text-slate-300">{dev.sn}</span>
                                {reqData.deviceSns.includes(dev.sn) && <CheckCircle2 size={16} className="text-ubuxa-blue" />}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {requestStep === 7 && (
                <div className="space-y-4 animate-in slide-in-from-right-4">
                    <h4 className="font-bold text-lg text-slate-900 dark:text-white">Next of Kin (Optional)</h4>
                    <Input label="Name" value={reqData.nokName} onChange={e => setReqData({...reqData, nokName: e.target.value})} icon={<User size={18} />} />
                    <Input label="Phone" value={reqData.nokPhone} onChange={e => setReqData({...reqData, nokPhone: e.target.value})} type="tel" icon={<Smartphone size={18} />} />
                </div>
            )}

            {requestStep === 8 && (
                <div className="space-y-4 animate-in slide-in-from-right-4">
                    <h4 className="font-bold text-lg text-slate-900 dark:text-white">Miscellaneous Costs (Optional)</h4>
                    <Input label="Installation Fee (₦)" type="number" value={reqData.installFee} onChange={e => setReqData({...reqData, installFee: e.target.value})} icon={<Truck size={18} />} />
                    <Input label="Accessories Cost (₦)" type="number" value={reqData.accessoriesCost} onChange={e => setReqData({...reqData, accessoriesCost: e.target.value})} icon={<Package size={18} />} />
                </div>
            )}

            {requestStep === 9 && (
                <div className="space-y-6 animate-in slide-in-from-right-4">
                    <h4 className="font-bold text-lg text-slate-900 dark:text-white">Preview Request</h4>
                    <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-2xl space-y-3 text-sm border border-slate-200 dark:border-slate-700">
                        <div className="flex justify-between"><span className="text-slate-500">Customer</span><span className="font-bold">{reqData.firstName} {reqData.lastName}</span></div>
                        <div className="flex justify-between"><span className="text-slate-500">Package</span><span className="font-bold">{reqData.packageName}</span></div>
                        <div className="flex justify-between"><span className="text-slate-500">Plan</span><span className="font-bold">{reqData.paymentType}</span></div>
                        <div className="flex justify-between"><span className="text-slate-500">Total Value</span><span className="font-bold text-ubuxa-blue">₦{(reqData.packagePrice + Number(reqData.installFee) + Number(reqData.accessoriesCost)).toLocaleString()}</span
                        ></div>
                        <div className="border-t border-slate-200 dark:border-slate-700 pt-2 mt-2">
                             <div className="flex justify-between"><span className="text-slate-500">Guarantor</span><span className="font-bold">{reqData.guarantorName}</span></div>
                             <div className="flex justify-between"><span className="text-slate-500">Guarantor ID</span><span className="font-bold">{reqData.guarantorIdNumber}</span></div>
                             <div className="flex justify-between"><span className="text-slate-500">Devices</span><span className="font-bold">{reqData.deviceSns.length} linked</span></div>
                        </div>
                    </div>
                    {AGENT_IS_VERIFIED && (
                        <div className="p-4 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-xl flex items-start space-x-3 border border-green-200 dark:border-green-800">
                            <Shield size={18} className="mt-0.5" />
                            <div className="text-xs">
                                <p className="font-bold">Verified Agent Status</p>
                                <p className="mt-1">This request will be auto-approved and a payment account generated immediately.</p>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-3 pt-4">
                {requestStep > 1 && <SecondaryButton onClick={() => setRequestStep(p => p - 1)} className="flex-1">Back</SecondaryButton>}
                <PrimaryButton 
                    onClick={() => {
                        if (requestStep < 9) setRequestStep(p => p + 1);
                        else completeRequest();
                    }} 
                    className="flex-1"
                >
                    {requestStep === 9 ? (editingRequestId ? 'Save Changes' : 'Submit Request') : 'Next'}
                </PrimaryButton>
            </div>
        </div>
      </BottomSheetModal>

      {/* --- Existing Sales Wizard Side Drawer --- */}
      <div className={`fixed inset-0 z-[100] transition-visibility duration-300 ${showDrawer ? 'visible' : 'invisible'}`}>
        <div className={`absolute inset-0 bg-slate-900/70 backdrop-blur-md transition-opacity duration-300 ${showDrawer ? 'opacity-100' : 'opacity-0'}`} onClick={resetWizard}/>
        <div className={`absolute top-0 right-0 h-full w-full max-w-lg bg-white dark:bg-slate-900 shadow-2xl transition-transform duration-500 transform flex flex-col ${showDrawer ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="bg-slate-900 dark:bg-slate-950 text-white p-6 sm:p-10 shrink-0">
            <div className="flex items-center justify-between mb-6 sm:mb-8">
              <div className="flex items-center space-x-3 sm:space-x-5">
                {!isSuccess && wizardStep > 1 && (
                  <button onClick={handleBack} className="p-2 hover:bg-white/10 rounded-full transition-colors"><ChevronLeft size={24} /></button>
                )}
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight uppercase italic">
                  {isSuccess ? 'Confirmed' : `Step ${wizardStep} of 6`}
                </h3>
              </div>
              <button onClick={resetWizard} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X size={24} /></button>
            </div>
            {!isSuccess && (
              <div className="flex items-center space-x-1.5 px-1">
                {[1, 2, 3, 4, 5, 6].map(s => (
                  <div key={s} className={`h-1.5 rounded-full transition-all duration-500 ${
                    wizardStep >= s 
                      ? 'bg-ubuxa-blue shadow-ubuxa-blue/50 shadow-lg' 
                      : 'bg-slate-700'
                  } ${wizardStep === s ? 'w-8 sm:w-10' : 'w-2 sm:w-3'}`}></div>
                ))}
              </div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-5 sm:p-10 space-y-6 sm:space-y-8 bg-slate-50/40 dark:bg-slate-950/20 no-scrollbar">
            {isSuccess ? (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-6 sm:space-y-8 animate-in zoom-in-95 duration-500">
                <div className="w-20 h-20 sm:w-28 sm:h-28 bg-blue-50 dark:bg-blue-900/30 text-ubuxa-blue rounded-3xl flex items-center justify-center shadow-xl shadow-blue-100 dark:shadow-blue-900/20"><CheckCircle2 size={40} /></div>
                <div>
                   <h4 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Success</h4>
                   <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-medium mt-2 sm:mt-3 px-4">
                     {navigator.onLine ? 'Transaction validated and archived successfully.' : 'Transaction saved offline. It will sync when connection restores.'}
                   </p>
                </div>
                <div className="w-full space-y-3 sm:space-y-4 pt-6 sm:pt-10">
                   <button onClick={resetWizard} className="w-full bg-slate-900 dark:bg-slate-800 text-white py-4 sm:py-5 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg shadow-xl active:scale-95 transition-all">Done</button>
                </div>
              </div>
            ) : (
              <>
                {/* Step 1: Customer Selection */}
                {wizardStep === 1 && (
                  <div className="space-y-6 sm:space-y-8 animate-in slide-in-from-right-4 duration-300">
                    <div className="text-center mb-2">
                      <h4 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">Select Customer</h4>
                      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">Link this transaction to a verified client</p>
                    </div>
                    <div className="relative group">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-ubuxa-blue transition-colors" size={18} />
                      <input 
                        type="text" 
                        placeholder="Search by name..." 
                        className="w-full pl-12 pr-6 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl sm:rounded-[1.5rem] focus:ring-2 focus:ring-ubuxa-blue focus:outline-none shadow-sm transition-all text-sm text-slate-900 dark:text-white"
                        value={custSearch}
                        onChange={(e) => setCustSearch(e.target.value)}
                      />
                    </div>
                    <div className="space-y-3 sm:space-y-4">
                      {filteredCustomers.map(customer => (
                        <button 
                          key={customer.id}
                          onClick={() => { setSelectedCustomer(customer); setInstallAddress(customer.address); setWizardStep(2); }}
                          className={`w-full p-4 sm:p-6 rounded-[1.5rem] sm:rounded-[2rem] border-2 transition-all flex items-center justify-between group text-left active:scale-[0.98] ${selectedCustomer?.id === customer.id ? 'border-ubuxa-blue bg-blue-50 dark:bg-blue-900/30 shadow-xl' : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800 hover:border-ubuxa-blue/50'}`}
                        >
                          <div className="flex items-center space-x-3 sm:space-x-5 min-w-0">
                            <div className={`w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all shrink-0 ${selectedCustomer?.id === customer.id ? 'bg-ubuxa-blue text-white shadow-lg' : 'bg-slate-100 dark:bg-slate-700 text-slate-400 group-hover:bg-slate-900 dark:group-hover:bg-slate-900 group-hover:text-white'}`}><User size={20} /></div>
                            <div className="min-w-0">
                               <p className={`font-bold text-base sm:text-lg truncate ${selectedCustomer?.id === customer.id ? 'text-ubuxa-blue' : 'text-slate-900 dark:text-white'}`}>{customer.name}</p>
                               <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest mt-0.5 sm:mt-1 truncate">{customer.phone}</p>
                            </div>
                          </div>
                          {selectedCustomer?.id === customer.id && <div className="w-6 h-6 sm:w-8 sm:h-8 bg-ubuxa-blue rounded-full flex items-center justify-center text-white shrink-0"><Check size={14} strokeWidth={4} /></div>}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 2: Inventory Selection */}
                {wizardStep === 2 && (
                  <div className="space-y-6 sm:space-y-8 animate-in slide-in-from-right-4 duration-300">
                    <div className="text-center">
                      <h4 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">Inventory Items</h4>
                      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">Build a custom set or choose a bundle</p>
                    </div>

                    <div className="bg-slate-200/50 dark:bg-slate-800 p-1 rounded-xl sm:rounded-[1.5rem] flex border border-slate-200 dark:border-slate-700">
                       <button onClick={() => setSelectionMode('PACKAGE')} className={`flex-1 flex items-center justify-center space-x-2 py-3 sm:py-4 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all ${selectionMode === 'PACKAGE' ? 'bg-white dark:bg-slate-700 text-ubuxa-blue dark:text-white shadow-lg' : 'text-slate-500 dark:text-slate-400'}`}><LayoutGrid size={16} /><span>Packages</span></button>
                       <button onClick={() => setSelectionMode('ITEMS')} className={`flex-1 flex items-center justify-center space-x-2 py-3 sm:py-4 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all ${selectionMode === 'ITEMS' ? 'bg-white dark:bg-slate-700 text-ubuxa-blue dark:text-white shadow-lg' : 'text-slate-500 dark:text-slate-400'}`}><List size={16} /><span>Custom</span></button>
                    </div>

                    {selectionMode === 'PACKAGE' ? (
                      <div className="space-y-4">
                        {filteredPackages.map(pkg => (
                          <button 
                            key={pkg.id} 
                            onClick={() => setSelectedPackage(pkg)} 
                            className={`p-6 sm:p-8 rounded-[1.5rem] sm:rounded-[2rem] border-2 text-left transition-all relative overflow-hidden w-full active:scale-[0.98] ${selectedPackage?.id === pkg.id ? 'border-ubuxa-blue bg-blue-50 dark:bg-blue-900/30 shadow-xl' : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800 hover:border-ubuxa-blue/50'}`}
                          >
                            <div className="flex justify-between items-start mb-3 sm:mb-4">
                               <div className="min-w-0">
                                  <p className={`font-bold text-base sm:text-lg truncate ${selectedPackage?.id === pkg.id ? 'text-ubuxa-blue' : 'text-slate-900 dark:text-white'}`}>{pkg.name}</p>
                                  <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1 italic">Bundle</p>
                                </div>
                               <p className="text-ubuxa-blue font-black text-lg sm:text-xl italic shrink-0">₦{pkg.price.toLocaleString()}</p>
                            </div>
                            <div className="space-y-1.5 sm:space-y-2">
                               {pkg.items.slice(0, 3).map((item: string, i: number) => (
                                 <p key={i} className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-bold flex items-center truncate">
                                   <span className={`w-1.5 h-1.5 rounded-full mr-2 sm:mr-3 shrink-0 ${selectedPackage?.id === pkg.id ? 'bg-ubuxa-blue' : 'bg-slate-300 dark:bg-slate-600'}`}></span>
                                   {item}
                                 </p>
                               ))}
                            </div>
                            {selectedPackage?.id === pkg.id && (
                               <div className="absolute top-3 right-3 sm:top-4 sm:right-4 animate-in zoom-in">
                                  <div className="w-5 h-5 sm:w-6 sm:h-6 bg-ubuxa-blue rounded-full flex items-center justify-center text-white"><Check size={12} strokeWidth={4} /></div>
                               </div>
                            )}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {filteredInventory.map(item => {
                          const cartItem = cart.find(c => c.id === item.id);
                          const isActive = (cartItem?.quantity || 0) > 0;
                          return (
                            <div key={item.id} className={`p-4 sm:p-6 border-2 rounded-[1.5rem] sm:rounded-[2rem] flex items-center justify-between transition-all ${isActive ? 'bg-blue-50 dark:bg-blue-900/30 border-ubuxa-blue shadow-lg' : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-800'}`}>
                              <div className="flex items-center space-x-3 sm:space-x-5 min-w-0">
                                <div className={`w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-inner transition-colors shrink-0 ${isActive ? 'bg-ubuxa-blue text-white' : 'bg-slate-50 dark:bg-slate-700 text-slate-400'}`}><Package size={20} /></div>
                                <div className="min-w-0">
                                   <p className="font-bold text-slate-900 dark:text-white text-sm truncate">{item.name}</p>
                                   <p className="text-[10px] sm:text-[11px] text-ubuxa-blue font-black tracking-tight mt-0.5">₦{item.price.toLocaleString()}</p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2 sm:space-x-3 bg-white dark:bg-slate-900 p-1.5 sm:p-2 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                                <button onClick={() => updateCart(item, -1)} className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-slate-400 hover:text-red-500 active:scale-90 transition-colors"><Minus size={16} /></button>
                                <span className="text-xs sm:text-sm font-black w-4 sm:w-6 text-center text-slate-900 dark:text-white">{cartItem?.quantity || 0}</span>
                                <button onClick={() => updateCart(item, 1)} className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-ubuxa-blue active:scale-125 transition-all"><Plus size={16} strokeWidth={3} /></button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* Step 3: Installation Logistics */}
                {wizardStep === 3 && (
                  <div className="space-y-6 sm:space-y-8 animate-in slide-in-from-right-4 duration-300">
                    <div className="text-center">
                      <h4 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">Installation Logistics</h4>
                      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">Schedule the deployment details</p>
                    </div>

                    <div className="space-y-6">
                        <Input 
                            label="Installation Address" 
                            icon={<MapPin size={18} />} 
                            value={installAddress}
                            onChange={(e) => setInstallAddress(e.target.value)}
                        />
                        <Input 
                            label="Installation Date" 
                            type="date"
                            icon={<Calendar size={18} />} 
                            value={installDate}
                            onChange={(e) => setInstallDate(e.target.value)}
                        />
                    </div>
                  </div>
                )}

                {/* Step 4: Device Linking */}
                {wizardStep === 4 && (
                  <div className="space-y-6 sm:space-y-8 animate-in slide-in-from-right-4 duration-300">
                     <div className="text-center">
                      <h4 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">Link Devices</h4>
                      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">Scan or select hardware serial numbers</p>
                    </div>
                    
                    <div className="relative group">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                        type="text" 
                        placeholder="Scan or type serial..." 
                        className="w-full pl-12 pr-6 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl sm:rounded-[1.5rem] focus:ring-2 focus:ring-ubuxa-blue focus:outline-none shadow-sm transition-all text-sm text-slate-900 dark:text-white"
                        value={devSearch}
                        onChange={(e) => setDevSearch(e.target.value)}
                      />
                    </div>

                    <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                        {filteredDevices.map(device => {
                            const isSelected = assignedDevices.includes(device.sn);
                            return (
                                <div 
                                    key={device.id} 
                                    onClick={() => {
                                        if (isSelected) setAssignedDevices(prev => prev.filter(sn => sn !== device.sn));
                                        else setAssignedDevices(prev => [...prev, device.sn]);
                                    }}
                                    className={`p-4 rounded-xl border-2 cursor-pointer flex items-center justify-between transition-all ${isSelected ? 'border-ubuxa-blue bg-blue-50 dark:bg-blue-900/30' : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800'}`}
                                >
                                    <div className="flex items-center space-x-3">
                                        <Smartphone size={20} className={isSelected ? 'text-ubuxa-blue' : 'text-slate-400'} />
                                        <div>
                                            <p className="font-bold text-sm text-slate-900 dark:text-white">{device.sn}</p>
                                            <p className="text-[10px] text-slate-500">{device.model}</p>
                                        </div>
                                    </div>
                                    {isSelected && <CheckCircle2 size={18} className="text-ubuxa-blue" />}
                                </div>
                            );
                        })}
                    </div>
                  </div>
                )}

                {/* Step 5: Contract & Signature */}
                {wizardStep === 5 && (
                  <div className="space-y-6 sm:space-y-8 animate-in slide-in-from-right-4 duration-300">
                     <div className="text-center">
                      <h4 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">Customer Agreement</h4>
                      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">Sign to authorize this transaction</p>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl text-xs text-slate-600 dark:text-slate-300 leading-relaxed border border-slate-200 dark:border-slate-700">
                        I, <span className="font-bold">{selectedCustomer?.name}</span>, acknowledge receipt of the items listed and agree to the payment terms defined. I understand that failure to remit payments may result in remote deactivation of the solar assets.
                    </div>

                    <SignaturePad label="Customer Signature" onChange={setSignature} />
                  </div>
                )}

                {/* Step 6: Confirmation */}
                {wizardStep === 6 && (
                  <div className="space-y-6 sm:space-y-8 animate-in slide-in-from-right-4 duration-300">
                     <div className="text-center">
                      <h4 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">Review & Confirm</h4>
                      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">Please verify all details before submitting</p>
                    </div>

                    <div className="bg-white dark:bg-slate-800 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-sm space-y-4">
                        <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-700">
                            <span className="text-slate-500 text-sm">Customer</span>
                            <span className="font-bold text-slate-900 dark:text-white">{selectedCustomer?.name}</span>
                        </div>
                        <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-700">
                            <span className="text-slate-500 text-sm">Product</span>
                            <span className="font-bold text-slate-900 dark:text-white">{selectionMode === 'PACKAGE' ? selectedPackage?.name : 'Custom Bundle'}</span>
                        </div>
                        <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-700">
                            <span className="text-slate-500 text-sm">Total Amount</span>
                            <span className="font-bold text-ubuxa-blue text-lg">₦{totalPrice.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-700">
                            <span className="text-slate-500 text-sm">Payment Plan</span>
                            <span className="font-bold text-slate-900 dark:text-white">{paymentPlan}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-slate-500 text-sm">Installation</span>
                            <div className="text-right">
                                <p className="font-bold text-slate-900 dark:text-white text-sm">{installDate}</p>
                                <p className="text-xs text-slate-500 truncate max-w-[150px]">{installAddress}</p>
                            </div>
                        </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {!isSuccess && (
            <div className="p-5 sm:p-10 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 shrink-0">
               <PrimaryButton 
                 onClick={handleNext} 
                 disabled={!isStepValid()} 
                 className="w-full shadow-xl"
                 icon={wizardStep === 6 ? <CheckCircle2 /> : <ChevronRight />}
               >
                 {wizardStep === 6 ? 'Complete Transaction' : 'Continue'}
               </PrimaryButton>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sales;

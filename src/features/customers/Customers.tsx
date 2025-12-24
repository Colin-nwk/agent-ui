import React, { useState } from 'react';
import {
   Search, UserPlus, Phone, MapPin, Mail, User, ChevronRight,
   CreditCard, ChevronLeft, Loader2, AlertCircle, Users
} from 'lucide-react';
import {
   PrimaryButton, SecondaryButton, BottomSheetModal, Input, Select, StatCard
} from '../../components/common';
import { useCustomers, useCreateCustomer, useCustomerStats } from '../../hooks/useCustomers';
import { useToast } from '../../context';
import type { Customer, CreateCustomerDto, AddressType } from '../../types/customer';

const ITEMS_PER_PAGE = 10;

const Customers: React.FC = () => {
   // Pagination & Search State
   const [page, setPage] = useState(1);
   const [search, setSearch] = useState('');
   const [debouncedSearch, setDebouncedSearch] = useState('');

   // Modal State
   const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
   const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);
   const [showPaymentModal, setShowPaymentModal] = useState(false);

   // Form State
   const [formData, setFormData] = useState<Partial<CreateCustomerDto>>({
      firstname: '',
      lastname: '',
      phone: '',
      email: '',
      location: '',
      addressType: 'HOME',
   });

   // Hooks
   const { showToast } = useToast();
   const { data, isLoading, error, refetch } = useCustomers({
      page,
      limit: ITEMS_PER_PAGE,
      search: debouncedSearch
   });
   const { data: stats } = useCustomerStats();
   const createMutation = useCreateCustomer();

   // Debounce search
   React.useEffect(() => {
      const timer = setTimeout(() => {
         setDebouncedSearch(search);
         setPage(1); // Reset to first page on new search
      }, 500);
      return () => clearTimeout(timer);
   }, [search]);

   const handleCreateCustomer = async () => {
      try {
         await createMutation.mutateAsync({ dto: formData as CreateCustomerDto });
         showToast('Success', 'Customer created successfully', 'success');
         setIsAddCustomerOpen(false);
         setFormData({ firstname: '', lastname: '', phone: '', email: '', location: '', addressType: 'HOME' });
      } catch (err: any) {
         showToast('Error', err?.response?.data?.message || 'Failed to create customer', 'error');
      }
   };

   const customers = data?.data || [];
   const meta = data?.meta;
   const totalPages = meta?.totalPages || 1;

   const getStatusColor = (status: string) => {
      switch (status) {
         case 'active': return 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400';
         case 'barred': return 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400';
         default: return 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400';
      }
   };

   return (
      <div className="space-y-6 pb-20 lg:pb-0 animate-in fade-in duration-500">
         {/* Header */}
         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
               <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Customers</h1>
               <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage your customer registry</p>
            </div>
            <PrimaryButton icon={<UserPlus size={18} />} onClick={() => setIsAddCustomerOpen(true)}>
               Add Customer
            </PrimaryButton>
         </div>

         {/* Stats */}
         {stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
               <StatCard title="Total" value={stats.totalCustomerCount} icon={<Users size={20} className="text-primary" />} />
               <StatCard title="Active" value={stats.activeCustomerCount} icon={<Users size={20} className="text-green-500" />} />
               <StatCard title="New" value={stats.newCustomerCount} icon={<Users size={20} className="text-blue-500" />} />
               <StatCard title="Barred" value={stats.barredCustomerCount} icon={<Users size={20} className="text-red-500" />} />
            </div>
         )}

         {/* Search */}
         <div className="bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center space-x-2 group focus-within:border-primary transition-colors">
            <Search className="text-slate-400 ml-2 group-focus-within:text-primary" size={20} />
            <input
               type="text"
               placeholder="Search by name, phone or email..."
               className="flex-1 py-2 outline-none text-sm text-slate-900 dark:text-white bg-transparent placeholder:text-slate-400"
               value={search}
               onChange={(e) => setSearch(e.target.value)}
            />
            {isLoading && <Loader2 size={18} className="animate-spin text-primary mr-2" />}
         </div>

         {/* Error State */}
         {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-4 flex items-center space-x-3">
               <AlertCircle className="text-red-500" size={20} />
               <p className="text-red-700 dark:text-red-400 text-sm font-medium">Failed to load customers. Please try again.</p>
               <SecondaryButton onClick={() => refetch()} className="ml-auto">Retry</SecondaryButton>
            </div>
         )}

         {/* Loading Skeleton */}
         {isLoading && !data && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {[1, 2, 3, 4].map(i => (
                  <div key={i} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 animate-pulse">
                     <div className="flex items-center space-x-3 mb-3">
                        <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-full" />
                        <div className="flex-1">
                           <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-32 mb-2" />
                           <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-24" />
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         )}

         {/* Empty State */}
         {!isLoading && customers.length === 0 && (
            <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
               <Users size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-4" />
               <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No Customers Found</h3>
               <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">
                  {search ? 'Try adjusting your search terms' : 'Start by adding your first customer'}
               </p>
               {/* {!search && (
                  <PrimaryButton icon={<UserPlus size={18} />} onClick={() => setIsAddCustomerOpen(true)}>
                     Add Customer
                  </PrimaryButton>
               )} */}
            </div>
         )}

         {/* Customer Grid */}
         {!isLoading && customers.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {customers.map(customer => (
                  <div
                     key={customer.id}
                     onClick={() => setSelectedCustomer(customer)}
                     className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:border-primary dark:hover:border-primary transition-colors cursor-pointer active:scale-[0.98]"
                  >
                     <div className="flex justify-between items-start mb-3">
                        <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold text-lg">
                           {customer.firstname?.charAt(0) || 'C'}
                        </div>
                        <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase ${getStatusColor(customer.status)}`}>
                           {customer.status}
                        </span>
                     </div>
                     <h3 className="font-bold text-slate-900 dark:text-white text-lg">
                        {customer.firstname} {customer.lastname}
                     </h3>
                     <div className="flex items-center text-slate-500 dark:text-slate-400 text-sm mt-1">
                        <Phone size={14} className="mr-1" />
                        <span>{customer.phone}</span>
                     </div>
                     {customer.location && (
                        <div className="flex items-center text-slate-500 dark:text-slate-400 text-sm mt-1">
                           <MapPin size={14} className="mr-1" />
                           <span>{customer.location}</span>
                        </div>
                     )}
                  </div>
               ))}
            </div>
         )}

         {/* Pagination */}
         {meta && totalPages > 1 && (
            <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
               <p className="text-sm text-slate-500 dark:text-slate-400">
                  Showing <span className="font-bold text-slate-900 dark:text-white">{((page - 1) * ITEMS_PER_PAGE) + 1}</span> to{' '}
                  <span className="font-bold text-slate-900 dark:text-white">{Math.min(page * ITEMS_PER_PAGE, meta.total)}</span> of{' '}
                  <span className="font-bold text-slate-900 dark:text-white">{meta.total}</span> customers
               </p>
               <div className="flex items-center space-x-2">
                  <button
                     onClick={() => setPage(p => Math.max(1, p - 1))}
                     disabled={page === 1}
                     className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                     <ChevronLeft size={18} />
                  </button>
                  <span className="text-sm font-bold text-slate-900 dark:text-white px-3">
                     {page} / {totalPages}
                  </span>
                  <button
                     onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                     disabled={page === totalPages}
                     className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                     <ChevronRight size={18} />
                  </button>
               </div>
            </div>
         )}

         {/* Customer Details Modal */}
         <BottomSheetModal
            isOpen={!!selectedCustomer}
            onClose={() => setSelectedCustomer(null)}
            title="Customer Profile"
         >
            {selectedCustomer && (
               <div className="space-y-6">
                  <div className="text-center">
                     <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-[2rem] flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold text-3xl mx-auto mb-4 border-4 border-white dark:border-slate-700 shadow-lg">
                        {selectedCustomer.firstname?.charAt(0) || 'C'}
                     </div>
                     <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                        {selectedCustomer.firstname} {selectedCustomer.lastname}
                     </h3>
                     {selectedCustomer.location && (
                        <p className="text-slate-500 dark:text-slate-400 font-medium flex items-center justify-center mt-1">
                           <MapPin size={14} className="mr-1" />
                           {selectedCustomer.location}
                        </p>
                     )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     <div className="p-5 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 text-center">
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 font-black uppercase tracking-widest">Type</p>
                        <p className="text-xl font-bold text-slate-900 dark:text-white mt-1 capitalize">{selectedCustomer.type}</p>
                     </div>
                     <div className="p-5 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 text-center">
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 font-black uppercase tracking-widest">Status</p>
                        <p className={`text-xl font-bold mt-1 capitalize ${selectedCustomer.status === 'active' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                           {selectedCustomer.status}
                        </p>
                     </div>
                  </div>

                  <div className="space-y-4">
                     <div className="flex items-center space-x-4 p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm">
                        <div className="p-2.5 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-primary"><Phone size={20} /></div>
                        <div>
                           <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Phone Number</p>
                           <p className="font-bold text-slate-900 dark:text-white">{selectedCustomer.phone}</p>
                        </div>
                     </div>
                     {selectedCustomer.email && (
                        <div className="flex items-center space-x-4 p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm">
                           <div className="p-2.5 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-primary"><Mail size={20} /></div>
                           <div>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Email Address</p>
                              <p className="font-bold text-slate-900 dark:text-white">{selectedCustomer.email}</p>
                           </div>
                        </div>
                     )}
                  </div>

                  <div className="flex space-x-3 pt-2">
                     <button className="flex-1 py-4 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                        History
                     </button>
                     <button className="flex-1 py-4 bg-slate-900 dark:bg-slate-800 text-white rounded-2xl font-bold shadow-lg hover:scale-[1.02] transition-transform">
                        New Sale
                     </button>
                  </div>
               </div>
            )}
         </BottomSheetModal>

         {/* Create Customer Modal */}
         <BottomSheetModal
            isOpen={isAddCustomerOpen}
            onClose={() => setIsAddCustomerOpen(false)}
            title="Register Customer"
         >
            <div className="space-y-6">
               <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-2xl mb-2">
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                     Enter client details to create a new profile in the registry.
                  </p>
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <Input
                     label="First Name"
                     placeholder="e.g. John"
                     icon={<User size={18} />}
                     value={formData.firstname}
                     onChange={(e) => setFormData(prev => ({ ...prev, firstname: e.target.value }))}
                  />
                  <Input
                     label="Last Name"
                     placeholder="e.g. Doe"
                     value={formData.lastname}
                     onChange={(e) => setFormData(prev => ({ ...prev, lastname: e.target.value }))}
                  />
               </div>

               <Input
                  label="Phone Number"
                  placeholder="+234..."
                  type="tel"
                  icon={<Phone size={18} />}
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
               />
               <Input
                  label="Email Address"
                  placeholder="client@email.com"
                  type="email"
                  icon={<Mail size={18} />}
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
               />
               <Input
                  label="Location"
                  placeholder="Street, City, State"
                  icon={<MapPin size={18} />}
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
               />

               <Select
                  label="Address Type"
                  value={formData.addressType}
                  onChange={(e) => setFormData(prev => ({ ...prev, addressType: e.target.value as AddressType }))}
               >
                  <option value="HOME">Home</option>
                  <option value="WORK">Work</option>
                  <option value="OTHER">Other</option>
               </Select>

               <div className="pt-4">
                  <PrimaryButton
                     className="w-full"
                     onClick={handleCreateCustomer}
                     disabled={createMutation.isPending || !formData.firstname || !formData.lastname || !formData.phone || !formData.email || !formData.location}
                  >
                     {createMutation.isPending ? (
                        <><Loader2 size={18} className="animate-spin mr-2" /> Creating...</>
                     ) : (
                        <>Create Profile <ChevronRight size={20} className="ml-1" /></>
                     )}
                  </PrimaryButton>
               </div>
            </div>
         </BottomSheetModal>
      </div>
   );
};

export default Customers;

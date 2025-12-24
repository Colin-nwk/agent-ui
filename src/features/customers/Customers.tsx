import React, { useState } from 'react';
import {
   Search, UserPlus, Users, AlertCircle, Loader2, ChevronLeft, ChevronRight
} from 'lucide-react';
import {
   PrimaryButton, SecondaryButton, IconButton, BottomSheetModal, StatCard
} from '../../components/common';
import { useCustomers, useCreateCustomer, useUpdateCustomer, useCustomerStats } from '../../hooks/useCustomers';
import { useToast } from '../../context';
import type { Customer, CreateCustomerDto } from '../../types/customer';

// New Component Imports
import { CustomerCard } from './components/CustomerCard';
import { CustomerDetails } from './components/CustomerDetails';
import { CustomerForm } from './components/CustomerForm';

const ITEMS_PER_PAGE = 10;

const Customers: React.FC = () => {
   // State
   const [page, setPage] = useState(1);
   const [search, setSearch] = useState('');
   const [debouncedSearch, setDebouncedSearch] = useState('');

   // Modals
   const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
   const [isFormOpen, setIsFormOpen] = useState(false);
   const [isEditMode, setIsEditMode] = useState(false);
   const [editingCustomer, setEditingCustomer] = useState<Customer | undefined>(undefined);

   // Hooks
   const { showToast } = useToast();
   const { data, isLoading, error, refetch } = useCustomers({
      page,
      limit: ITEMS_PER_PAGE,
      search: debouncedSearch
   });
   const { data: stats } = useCustomerStats();
   const createMutation = useCreateCustomer();
   const updateMutation = useUpdateCustomer();

   // Debounce search
   React.useEffect(() => {
      const timer = setTimeout(() => {
         setDebouncedSearch(search);
         setPage(1);
      }, 500);
      return () => clearTimeout(timer);
   }, [search]);

   // Handlers
   const handleCreate = () => {
      setIsEditMode(false);
      setEditingCustomer(undefined);
      setIsFormOpen(true);
   };

   const handleEdit = (customer: Customer) => {
      setEditingCustomer(customer);
      setIsEditMode(true);
      setSelectedCustomer(null); // Close details modal
      setIsFormOpen(true);
   };

   const handleFormSubmit = async (dto: CreateCustomerDto, file?: File) => {
      try {
         if (isEditMode && editingCustomer) {
            await updateMutation.mutateAsync({
               id: editingCustomer.id,
               dto,
               file
            });
            showToast('Success', 'Customer updated successfully', 'success');
         } else {
            await createMutation.mutateAsync({
               dto,
               file
            });
            showToast('Success', 'Customer created successfully', 'success');
         }
         setIsFormOpen(false);
      } catch (err: any) {
         showToast('Error', err?.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'create'} customer`, 'error');
      }
   };

   const customers = data?.customers || [];
   const totalPages = data?.totalPages || 1;
   const total = data?.total || 0;

   // Render Helpers
   const renderPagination = () => {
      if (!data || totalPages <= 1) return null;
      return (
         <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
            <p className="text-sm text-slate-500 dark:text-slate-400">
               Showing <span className="font-bold text-slate-900 dark:text-white">{((page - 1) * ITEMS_PER_PAGE) + 1}</span> to{' '}
               <span className="font-bold text-slate-900 dark:text-white">{Math.min(page * ITEMS_PER_PAGE, total)}</span> of{' '}
               <span className="font-bold text-slate-900 dark:text-white">{total}</span> customers
            </p>
            <div className="flex items-center space-x-2">
               <IconButton
                  variant="outline"
                  icon={<ChevronLeft size={18} />}
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="rounded-xl w-10 h-10"
               />
               <span className="text-sm font-bold text-slate-900 dark:text-white px-3">
                  {page} / {totalPages}
               </span>
               <IconButton
                  variant="outline"
                  icon={<ChevronRight size={18} />}
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="rounded-xl w-10 h-10"
               />
            </div>
         </div>
      );
   };

   return (
      <div className="space-y-6 pb-20 lg:pb-0 animate-in fade-in duration-500">
         {/* Header */}
         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
               <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Customers</h1>
               <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage your customer registry</p>
            </div>
            <PrimaryButton icon={<UserPlus size={18} />} onClick={handleCreate}>
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
            </div>
         )}

         {/* Customer Grid */}
         {!isLoading && customers.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {customers.map(customer => (
                  <CustomerCard
                     key={customer.id}
                     customer={customer}
                     onClick={setSelectedCustomer}
                  />
               ))}
            </div>
         )}

         {/* Pagination */}
         {renderPagination()}

         {/* Details Modal */}
         <BottomSheetModal
            isOpen={!!selectedCustomer}
            onClose={() => setSelectedCustomer(null)}
            title="Customer Profile"
         >
            {selectedCustomer && (
               <CustomerDetails
                  customer={selectedCustomer}
                  onEdit={handleEdit}
                  onNewSale={() => { }} // Placeholder for now
               />
            )}
         </BottomSheetModal>

         {/* Create/Edit Form Modal */}
         <BottomSheetModal
            isOpen={isFormOpen}
            onClose={() => setIsFormOpen(false)}
            title={isEditMode ? 'Edit Customer' : 'Register Customer'}
         >
            <CustomerForm
               initialData={editingCustomer}
               onSubmit={handleFormSubmit}
               isLoading={isEditMode ? updateMutation.isPending : createMutation.isPending}
               submitLabel={isEditMode ? 'Update Customer' : 'Create Customer'}
            />
         </BottomSheetModal>
      </div>
   );
};

export default Customers;

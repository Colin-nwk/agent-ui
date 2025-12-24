
import React, { useState } from 'react';
import { Search, UserPlus, Phone, MapPin, Mail, User, ChevronRight, CreditCard, RefreshCw } from 'lucide-react';
import { PrimaryButton, BottomSheetModal, Input, SecondaryButton } from './Shared';

const MOCK_CUSTOMERS = [
  { id: '1', name: 'Kathleen Pfeffer', email: 'angela98@gmail.com', phone: '+234 801 234 5678', location: 'Lekki, Lagos', status: 'ACTIVE', balance: 0 },
  { id: '2', name: 'Ericka Considine', email: 'carlo34@yahoo.com', phone: '+234 702 345 6789', location: 'Abuja', status: 'DEFAULTING', balance: 45000 },
];

const Customers: React.FC = () => {
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <div className="flex justify-between items-center">
         <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Customers</h1>
         <PrimaryButton icon={<UserPlus size={18} />} onClick={() => setIsAddCustomerOpen(true)}>Add New</PrimaryButton>
      </div>

      <div className="bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center space-x-2 group focus-within:border-primary transition-colors">
         <Search className="text-slate-400 ml-2 group-focus-within:text-primary" size={20} />
         <input type="text" placeholder="Search name or phone..." className="flex-1 py-2 outline-none text-sm text-slate-900 dark:text-white bg-transparent placeholder:text-slate-400" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         {MOCK_CUSTOMERS.map(customer => (
            <div 
               key={customer.id} 
               onClick={() => setSelectedCustomer(customer)}
               className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:border-primary dark:hover:border-primary transition-colors cursor-pointer active:scale-[0.98]"
            >
               <div className="flex justify-between items-start mb-3">
                  <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold text-lg">
                     {customer.name.charAt(0)}
                  </div>
                  <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase ${
                     customer.status === 'ACTIVE' ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                  }`}>
                     {customer.status}
                  </span>
               </div>
               <h3 className="font-bold text-slate-900 dark:text-white text-lg">{customer.name}</h3>
               <div className="flex items-center text-slate-500 dark:text-slate-400 text-sm mt-1">
                  <Phone size={14} className="mr-1" />
                  <span>{customer.phone}</span>
               </div>
               <div className="flex items-center text-slate-500 dark:text-slate-400 text-sm mt-1">
                  <MapPin size={14} className="mr-1" />
                  <span>{customer.location}</span>
               </div>
            </div>
         ))}
      </div>

      {/* Customer Details Bottom Sheet */}
      <BottomSheetModal
         isOpen={!!selectedCustomer}
         onClose={() => setSelectedCustomer(null)}
         title="Customer Profile"
      >
         {selectedCustomer && (
            <div className="space-y-6">
               <div className="text-center">
                  <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-[2rem] flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold text-3xl mx-auto mb-4 border-4 border-white dark:border-slate-700 shadow-lg">
                     {selectedCustomer.name.charAt(0)}
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{selectedCustomer.name}</h3>
                  <p className="text-slate-500 dark:text-slate-400 font-medium flex items-center justify-center mt-1">
                     <MapPin size={14} className="mr-1" />
                     {selectedCustomer.location}
                  </p>
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div className="p-5 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 text-center">
                     <p className="text-[10px] text-slate-500 dark:text-slate-400 font-black uppercase tracking-widest">Balance</p>
                     <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">₦{selectedCustomer.balance.toLocaleString()}</p>
                  </div>
                  <div className="p-5 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 text-center">
                     <p className="text-[10px] text-slate-500 dark:text-slate-400 font-black uppercase tracking-widest">Status</p>
                     <p className={`text-xl font-bold mt-1 ${selectedCustomer.status === 'ACTIVE' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>{selectedCustomer.status}</p>
                  </div>
               </div>

               {selectedCustomer.balance > 0 && (
                   <button 
                     onClick={() => setShowPaymentModal(true)}
                     className="w-full py-4 bg-ubuxa-gradient text-white rounded-2xl font-bold shadow-lg shadow-primary/20 flex items-center justify-center space-x-2 animate-pulse"
                   >
                       <CreditCard size={20} />
                       <span>Collect Payment (₦{selectedCustomer.balance.toLocaleString()})</span>
                   </button>
               )}

               <div className="space-y-4">
                  <div className="flex items-center space-x-4 p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm">
                     <div className="p-2.5 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-primary"><Phone size={20} /></div>
                     <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Phone Number</p>
                        <p className="font-bold text-slate-900 dark:text-white">{selectedCustomer.phone}</p>
                     </div>
                  </div>
                  <div className="flex items-center space-x-4 p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm">
                     <div className="p-2.5 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-primary"><Mail size={20} /></div>
                     <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Email Address</p>
                        <p className="font-bold text-slate-900 dark:text-white">{selectedCustomer.email}</p>
                     </div>
                  </div>
               </div>

               <div className="bg-slate-50 dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700">
                  <h4 className="font-bold text-slate-900 dark:text-white mb-3 text-sm uppercase tracking-widest">Active Products</h4>
                  <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl flex items-center justify-between shadow-sm">
                     <div>
                        <p className="font-bold text-sm text-slate-900 dark:text-white">Solar Home System</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Installed Oct 2023</p>
                     </div>
                     <span className="text-[10px] font-bold bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded">Active</span>
                  </div>
               </div>

               <div className="flex space-x-3 pt-2">
                   <button className="flex-1 py-4 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">History</button>
                   <button className="flex-1 py-4 bg-slate-900 dark:bg-slate-800 text-white rounded-2xl font-bold shadow-lg hover:scale-[1.02] transition-transform">New Sale</button>
               </div>
            </div>
         )}
      </BottomSheetModal>

      {/* Collect Payment Modal */}
      <BottomSheetModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        title="Collect Payment"
      >
          <div className="space-y-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl text-center">
                  <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold">Amount Due</p>
                  <p className="text-3xl font-bold text-ubuxa-blue mt-1">₦{selectedCustomer?.balance.toLocaleString()}</p>
              </div>
              
              <Input label="Payment Amount" type="number" placeholder="Enter amount" defaultValue={selectedCustomer?.balance} />
              
              <div className="space-y-3">
                  <p className="text-xs font-bold text-slate-400 uppercase pl-1">Payment Method</p>
                  <div className="grid grid-cols-2 gap-3">
                      <button className="p-3 border-2 border-ubuxa-blue bg-blue-50 dark:bg-blue-900/30 rounded-xl font-bold text-ubuxa-blue text-sm">Cash / Transfer</button>
                      <button className="p-3 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-600 dark:text-slate-300 text-sm hover:bg-slate-50">POS / Card</button>
                  </div>
              </div>

              <PrimaryButton onClick={() => setShowPaymentModal(false)} className="w-full">Confirm Payment</PrimaryButton>
          </div>
      </BottomSheetModal>

      {/* Create Customer Bottom Sheet */}
      <BottomSheetModal
         isOpen={isAddCustomerOpen}
         onClose={() => setIsAddCustomerOpen(false)}
         title="Register Customer"
      >
         <div className="space-y-6">
            <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-2xl mb-2">
               <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Enter client details to create a new profile in the registry. 
                  <span className="font-bold text-primary block mt-1">Verification may be required.</span>
               </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
               <Input label="First Name" placeholder="e.g. John" icon={<User size={18} />} />
               <Input label="Last Name" placeholder="e.g. Doe" />
            </div>
            
            <Input label="Phone Number" placeholder="+234..." type="tel" icon={<Phone size={18} />} />
            <Input label="Email Address" placeholder="client@email.com" type="email" icon={<Mail size={18} />} />
            <Input label="Residential Address" placeholder="Street, City, State" icon={<MapPin size={18} />} />

            <div className="pt-4">
               <PrimaryButton className="w-full flex justify-between items-center" onClick={() => setIsAddCustomerOpen(false)}>
                  <span>Create Profile</span>
                  <ChevronRight size={20} className="text-white/80" />
               </PrimaryButton>
            </div>
         </div>
      </BottomSheetModal>
    </div>
  );
};

export default Customers;

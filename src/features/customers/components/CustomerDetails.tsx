import React from 'react';
import { Phone, MapPin, Mail } from 'lucide-react';
import { Customer } from '../../types/customer';

interface CustomerDetailsProps {
    customer: Customer;
    onEdit: (customer: Customer) => void;
    onNewSale: (customer: Customer) => void;
}

export const CustomerDetails: React.FC<CustomerDetailsProps> = ({ customer, onEdit, onNewSale }) => {
    return (
        <div className="space-y-6">
            <div className="text-center">
                {customer.image ? (
                    <img
                        src={customer.image}
                        alt={`${customer.firstname} ${customer.lastname}`}
                        className="w-24 h-24 rounded-[2rem] object-cover mx-auto mb-4 border-4 border-white dark:border-slate-700 shadow-xl"
                    />
                ) : (
                    <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-primary/5 dark:from-primary/30 dark:to-primary/10 rounded-[2rem] flex items-center justify-center text-primary font-bold text-3xl mx-auto mb-4 border-4 border-white dark:border-slate-700 shadow-xl">
                        {customer.firstname?.charAt(0) || 'C'}
                    </div>
                )}
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                    {customer.firstname} {customer.lastname}
                </h3>
                {customer.location && (
                    <p className="text-slate-500 dark:text-slate-400 font-medium flex items-center justify-center mt-1">
                        <MapPin size={14} className="mr-1" />
                        {customer.location}
                    </p>
                )}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 text-center">
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 font-black uppercase tracking-widest">Type</p>
                    <p className="text-lg font-bold text-slate-900 dark:text-white mt-1 capitalize">{customer.type}</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 text-center">
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 font-black uppercase tracking-widest">Status</p>
                    <p className={`text-lg font-bold mt-1 capitalize ${customer.status === 'active' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {customer.status}
                    </p>
                </div>
            </div>

            <div className="space-y-3">
                <div className="flex items-center space-x-4 p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm">
                    <div className="p-2.5 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-primary"><Phone size={20} /></div>
                    <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Phone Number</p>
                        <p className="font-bold text-slate-900 dark:text-white">{customer.phone}</p>
                        {customer.alternatePhone && (
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{customer.alternatePhone}</p>
                        )}
                    </div>
                </div>
                {customer.email && (
                    <div className="flex items-center space-x-4 p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm">
                        <div className="p-2.5 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-primary"><Mail size={20} /></div>
                        <div>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Email Address</p>
                            <p className="font-bold text-slate-900 dark:text-white">{customer.email}</p>
                        </div>
                    </div>
                )}
            </div>

            <div className="flex space-x-3 pt-2">
                <button
                    onClick={() => onEdit(customer)}
                    className="flex-1 py-4 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                    Edit Profile
                </button>
                <button
                    onClick={() => onNewSale(customer)}
                    className="flex-1 py-4 bg-slate-900 dark:bg-slate-800 text-white rounded-2xl font-bold shadow-lg hover:scale-[1.02] active:scale-95 transition-all"
                >
                    New Sale
                </button>
            </div>
        </div>
    );
};

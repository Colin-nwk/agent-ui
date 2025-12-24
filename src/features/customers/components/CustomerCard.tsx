import React from 'react';
import { Phone, MapPin } from 'lucide-react';
import { Customer } from '../../../types/customer';

interface CustomerCardProps {
    customer: Customer;
    onClick: (customer: Customer) => void;
}

const getStatusColor = (status: string) => {
    switch (status) {
        case 'active': return 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400';
        case 'barred': return 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400';
        default: return 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400';
    }
};

export const CustomerCard: React.FC<CustomerCardProps> = ({ customer, onClick }) => {
    return (
        <div
            onClick={() => onClick(customer)}
            className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:border-primary dark:hover:border-primary transition-all cursor-pointer active:scale-[0.98] group"
        >
            <div className="flex justify-between items-start mb-3">
                {/* Customer Avatar/Image */}
                {customer.image ? (
                    <img
                        src={customer.image}
                        alt={`${customer.firstname} ${customer.lastname}`}
                        className="w-12 h-12 rounded-full object-cover border-2 border-slate-100 dark:border-slate-700"
                    />
                ) : (
                    <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/5 dark:from-primary/30 dark:to-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-lg">
                        {customer.firstname?.charAt(0) || 'C'}
                    </div>
                )}
                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase ${getStatusColor(customer.status)}`}>
                    {customer.status}
                </span>
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg group-hover:text-primary transition-colors">
                {customer.firstname} {customer.lastname}
            </h3>
            <div className="flex items-center text-slate-500 dark:text-slate-400 text-sm mt-1">
                <Phone size={14} className="mr-1.5" />
                <span>{customer.phone}</span>
            </div>
            {customer.location && (
                <div className="flex items-center text-slate-500 dark:text-slate-400 text-sm mt-1">
                    <MapPin size={14} className="mr-1.5" />
                    <span className="truncate">{customer.location}</span>
                </div>
            )}
        </div>
    );
};

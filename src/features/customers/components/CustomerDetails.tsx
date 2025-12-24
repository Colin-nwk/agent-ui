import React from 'react';
import { Phone, MapPin, Mail } from 'lucide-react';
import { Customer } from '../../../types/customer';
import { OutlineButton, PrimaryButton, Input } from '../../../components/common';

interface CustomerDetailsProps {
    customer: Customer;
    onEdit: (customer: Customer) => void;
    onNewSale: (customer: Customer) => void;
}

export const CustomerDetails: React.FC<CustomerDetailsProps> = ({ customer, onEdit, onNewSale }) => {
    const [isImageExpanded, setIsImageExpanded] = React.useState(false);

    return (
        <div className="space-y-6">
            <div className="text-center">
                {customer.image ? (
                    <div className="relative group mx-auto mb-4 w-fit">
                        <img
                            src={customer.image}
                            alt={`${customer.firstname} ${customer.lastname}`}
                            onClick={() => setIsImageExpanded(!isImageExpanded)}
                            className={`
                                rounded-[2rem] object-cover transition-all duration-300 cursor-zoom-in border-4 border-white dark:border-slate-700 shadow-xl
                                ${isImageExpanded
                                    ? 'w-64 h-64 rounded-2xl md:w-80 md:h-80'
                                    : 'w-28 h-28 hover:scale-105'}
                            `}
                        />
                        {!isImageExpanded && (
                            <div className="absolute inset-0 bg-black/20 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                                <span className="text-white text-xs font-bold bg-black/50 px-2 py-1 rounded-full">View</span>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="w-28 h-28 bg-gradient-to-br from-primary/20 to-primary/5 dark:from-primary/30 dark:to-primary/10 rounded-[2rem] flex items-center justify-center text-primary font-bold text-4xl mx-auto mb-4 border-4 border-white dark:border-slate-700 shadow-xl">
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

            <div className="space-y-4">
                <Input
                    value={customer.phone}
                    label="Phone Number"
                    icon={<Phone size={18} />}
                    disabled
                    readOnly
                    className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                />

                {customer.alternatePhone && (
                    <Input
                        value={customer.alternatePhone}
                        label="Alternate Phone"
                        icon={<Phone size={18} />}
                        disabled
                        readOnly
                        className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                    />
                )}

                {customer.email && (
                    <Input
                        value={customer.email}
                        label="Email Address"
                        icon={<Mail size={18} />}
                        disabled
                        readOnly
                        className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                    />
                )}
            </div>

            <div className="flex space-x-3 pt-2">
                <OutlineButton
                    onClick={() => onEdit(customer)}
                    className="flex-1"
                >
                    Edit Profile
                </OutlineButton>
                <PrimaryButton
                    onClick={() => onNewSale(customer)}
                    className="flex-1"
                >
                    New Sale
                </PrimaryButton>
            </div>
        </div>
    );
};

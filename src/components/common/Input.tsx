import { InputHTMLAttributes, SelectHTMLAttributes, ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    icon?: ReactNode;
}

export const Input = ({ label, icon, className, ...props }: InputProps) => (
    <div className="space-y-2">
        {label && <label className="text-[10px] sm:text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">{label}</label>}
        <div className="relative group">
            {icon && <div className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">{icon}</div>}
            <input
                {...props}
                className={`w-full ${icon ? 'pl-11 sm:pl-14' : 'px-5 sm:px-6'} pr-5 sm:px-6 py-3 sm:py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl sm:rounded-[1.25rem] text-sm sm:text-base text-slate-900 dark:text-white font-bold focus:ring-2 focus:ring-primary focus:outline-none transition-all shadow-sm group-hover:border-blue-300 ${className}`}
            />
        </div>
    </div>
);

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
}

export const Select = ({ label, children, className, ...props }: SelectProps) => (
    <div className="space-y-2">
        {label && <label className="text-[10px] sm:text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">{label}</label>}
        <div className="relative group">
            <select
                {...props}
                className={`w-full px-5 sm:px-6 py-3 sm:py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl sm:rounded-[1.25rem] text-sm sm:text-base text-slate-900 dark:text-white font-bold focus:ring-2 focus:ring-primary focus:outline-none appearance-none transition-all cursor-pointer shadow-sm group-hover:border-blue-300 ${className}`}
            >
                {children}
            </select>
            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-primary transition-colors">
                <ChevronDown size={18} />
            </div>
        </div>
    </div>
);

import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    icon?: ReactNode;
}

export const PrimaryButton = ({ children, className, icon, ...props }: ButtonProps) => (
    <button
        className={`bg-ubuxa-gradient text-white px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl font-bold shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center space-x-2 sm:space-x-3 text-sm sm:text-base ${className}`}
        {...props}
    >
        {icon && <span className="flex-shrink-0 inline-flex">{icon}</span>}
        <span>{children}</span>
    </button>
);

export const SecondaryButton = ({ children, className, icon, ...props }: ButtonProps) => (
    <button
        className={`bg-slate-900 dark:bg-slate-800 text-white px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl font-bold hover:bg-slate-800 dark:hover:bg-slate-700 shadow-lg active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center space-x-2 sm:space-x-3 text-sm sm:text-base ${className}`}
        {...props}
    >
        {icon && <span className="flex-shrink-0 inline-flex">{icon}</span>}
        <span>{children}</span>
    </button>
);

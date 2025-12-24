import { ButtonHTMLAttributes, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    icon?: ReactNode;
    isLoading?: boolean;
}

const BaseButton = ({ children, className, icon, isLoading, ...props }: ButtonProps) => {
    return (
        <button
            className={`
                relative px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl font-bold 
                flex items-center justify-center space-x-2 sm:space-x-3 text-sm sm:text-base
                transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100
                ${className}
            `}
            disabled={isLoading || props.disabled}
            {...props}
        >
            {isLoading && <Loader2 size={18} className="animate-spin absolute" />}
            <span className={`flex items-center space-x-2 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
                {icon && <span className="flex-shrink-0 inline-flex">{icon}</span>}
                <span>{children}</span>
            </span>
        </button>
    );
};

export const PrimaryButton = ({ className, ...props }: ButtonProps) => (
    <BaseButton
        className={`bg-ubuxa-gradient text-white shadow-xl shadow-primary/20 hover:scale-[1.02] ${className}`}
        {...props}
    />
);

export const SecondaryButton = ({ className, ...props }: ButtonProps) => (
    <BaseButton
        className={`bg-slate-900 dark:bg-slate-800 text-white shadow-lg hover:bg-slate-800 dark:hover:bg-slate-700 ${className}`}
        {...props}
    />
);

export const OutlineButton = ({ className, ...props }: ButtonProps) => (
    <BaseButton
        className={`bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-primary hover:text-primary dark:hover:border-primary dark:hover:text-primary ${className}`}
        {...props}
    />
);

export const DangerButton = ({ className, ...props }: ButtonProps) => (
    <BaseButton
        className={`bg-red-500 text-white shadow-xl shadow-red-500/20 hover:bg-red-600 ${className}`}
        {...props}
    />
);

export const GhostButton = ({ className, ...props }: ButtonProps) => (
    <BaseButton
        className={`bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 ${className}`}
        {...props}
    />
);

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    icon: ReactNode;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
}

export const IconButton = ({ icon, className, variant = 'primary', ...props }: IconButtonProps) => {
    const variants = {
        primary: 'bg-ubuxa-gradient text-white shadow-lg shadow-primary/20 hover:scale-110',
        secondary: 'bg-slate-900 dark:bg-slate-800 text-white shadow-lg hover:scale-110',
        outline: 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-400 hover:border-primary hover:text-primary',
        ghost: 'bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500',
        danger: 'bg-red-100 dark:bg-red-900/20 text-red-500 hover:bg-red-200 dark:hover:bg-red-900/40',
    };

    return (
        <button
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all active:scale-95 disabled:opacity-50 ${variants[variant]} ${className}`}
            {...props}
        >
            {icon}
        </button>
    );
};

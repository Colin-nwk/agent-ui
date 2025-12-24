import { useEffect } from 'react';
import { X, Check, Info, AlertTriangle } from 'lucide-react';

interface ToastProps {
    title: string;
    message: string;
    type?: 'info' | 'success' | 'warning' | 'error';
    onClose: () => void;
}

export const Toast = ({ title, message, type = 'info', onClose }: ToastProps) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 4000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const icons = {
        info: <Info className="text-primary" />,
        success: <Check className="text-green-500" />,
        warning: <AlertTriangle className="text-orange-500" />,
        error: <X className="text-red-500" />
    };

    return (
        <div className="fixed top-4 right-4 left-4 sm:left-auto sm:right-8 z-[9999] sm:w-full sm:max-w-sm bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl sm:rounded-[2rem] shadow-2xl p-4 sm:p-6 flex items-start space-x-4 animate-in slide-in-from-top-4 sm:slide-in-from-right-6 border-l-4 border-l-primary">
            <div className="p-2 sm:p-3 bg-slate-50 dark:bg-slate-800 rounded-xl sm:rounded-2xl shadow-sm shrink-0">
                {icons[type]}
            </div>
            <div className="flex-1 min-w-0">
                <h4 className="font-bold text-slate-900 dark:text-white text-sm sm:text-[15px] truncate">{title}</h4>
                <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1 leading-relaxed font-medium line-clamp-2">{message}</p>
            </div>
            <button onClick={onClose} className="p-1.5 text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors bg-slate-50 dark:bg-slate-800 rounded-lg shrink-0">
                <X size={16} />
            </button>
        </div>
    );
};

import { ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';

interface SideDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    subtitle?: string;
    children: ReactNode;
    footer?: ReactNode;
    maxWidth?: string;
}

export const SideDrawer = ({
    isOpen,
    onClose,
    title,
    subtitle,
    children,
    footer,
    maxWidth = 'max-w-lg'
}: SideDrawerProps) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    return (
        <div className={`fixed inset-0 z-[100] transition-visibility duration-300 ${isOpen ? 'visible' : 'invisible'}`}>
            <div
                className={`absolute inset-0 bg-slate-900/70 backdrop-blur-md transition-opacity duration-300 h-screen   ${isOpen ? 'opacity-100' : 'opacity-0'}`}
                onClick={onClose}
            />
            <div className={`absolute top-0 right-0 h-full w-full ${maxWidth} bg-white dark:bg-slate-900 shadow-2xl transition-transform duration-500 transform flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="bg-slate-900 dark:bg-slate-950 text-white p-6 sm:p-10 shrink-0">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl sm:text-2xl font-bold tracking-tight uppercase italic">{title}</h3>
                        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                            <X size={24} />
                        </button>
                    </div>
                    {subtitle && <p className="text-slate-400 text-xs sm:text-sm font-medium leading-relaxed">{subtitle}</p>}
                </div>
                <div className="flex-1 overflow-y-auto p-6 sm:p-10 no-scrollbar text-slate-900 dark:text-slate-100">
                    {children}
                </div>
                {footer && (
                    <div className="p-6 sm:p-10 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 shadow-inner flex flex-col sm:flex-row gap-3 shrink-0">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
};

interface BottomSheetModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
    title?: string;
}

export const BottomSheetModal = ({ isOpen, onClose, children, title }: BottomSheetModalProps) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    return (
        <div className={`fixed inset-0 z-[200] flex justify-center items-end sm:items-center transition-visibility duration-300 ${isOpen ? 'visible' : 'invisible'}`}>
            <div
                className={`absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300 h-screen ${isOpen ? 'opacity-100' : 'opacity-0'}`}
                onClick={onClose}
            />
            <div
                className={`relative w-full sm:max-w-lg bg-white dark:bg-slate-900 rounded-t-[2.5rem] sm:rounded-[2.5rem] shadow-2xl transform transition-transform duration-500 cubic-bezier(0.32, 0.72, 0, 1) ${isOpen ? 'translate-y-0' : 'translate-y-full sm:translate-y-10 sm:opacity-0 sm:scale-95'}`}
                style={{ maxHeight: '85vh' }}
            >
                <div className="flex flex-col h-full max-h-[85vh]">
                    <div className="w-full flex justify-center pt-4 pb-2 sm:hidden cursor-pointer" onClick={onClose}>
                        <div className="w-12 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full" />
                    </div>

                    <div className="px-6 py-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 shrink-0">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">{title || 'Details'}</h3>
                        <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-400">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="p-6 overflow-y-auto no-scrollbar">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
    footer?: ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
    type?: 'default' | 'success' | 'danger' | 'warning' | 'info';
    subtitle?: string;
}

export const Modal = ({
    isOpen, onClose, title, children, footer, size = 'md', type = 'default', subtitle
}: ModalProps) => {
    if (!isOpen) return null;

    const sizeClasses = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl',
        full: 'max-w-[95vw] h-[90vh]'
    };

    const typeHeaderColors = {
        default: 'bg-slate-900 dark:bg-slate-950',
        success: 'bg-green-600',
        danger: 'bg-red-600',
        warning: 'bg-orange-500',
        info: 'bg-primary'
    };

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose} />
            <div className={`relative w-full ${sizeClasses[size]} bg-white dark:bg-slate-900 rounded-[2rem] sm:rounded-[3rem] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-500 max-h-[90vh]`}>
                <div className={`${typeHeaderColors[type]} p-6 sm:p-10 text-white shrink-0`}>
                    <div className="flex items-center justify-between">
                        <div className="min-w-0 pr-8">
                            <h3 className="text-xl sm:text-2xl font-bold tracking-tight leading-tight truncate">{title}</h3>
                            {subtitle && <p className="text-white/70 text-xs sm:text-sm mt-1 sm:mt-2 font-medium line-clamp-2">{subtitle}</p>}
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors shrink-0">
                            <X size={24} />
                        </button>
                    </div>
                </div>
                <div className="p-6 sm:p-10 overflow-y-auto no-scrollbar text-slate-600 dark:text-slate-300">{children}</div>
                {footer && <div className="p-6 sm:p-10 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 flex flex-col sm:flex-row items-center justify-end gap-3 shrink-0">{footer}</div>}
            </div>
        </div>
    );
};

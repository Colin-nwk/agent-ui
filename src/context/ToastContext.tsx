import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { Toast } from '../components/common';

export type ToastType = 'info' | 'success' | 'warning' | 'error';

interface ToastData {
    title: string;
    message: string;
    type?: ToastType;
}

interface ToastContextType {
    showToast: (title: string, message: string, type?: ToastType) => void;
    hideToast: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

interface ToastProviderProps {
    children: ReactNode;
}

export const ToastProvider = ({ children }: ToastProviderProps) => {
    const [toast, setToast] = useState<ToastData | null>(null);

    const showToast = useCallback((title: string, message: string, type: ToastType = 'info') => {
        setToast({ title, message, type });
    }, []);

    const hideToast = useCallback(() => {
        setToast(null);
    }, []);

    return (
        <ToastContext.Provider value={{ showToast, hideToast }}>
            {children}
            {toast && (
                <Toast
                    title={toast.title}
                    message={toast.message}
                    type={toast.type}
                    onClose={hideToast}
                />
            )}
        </ToastContext.Provider>
    );
};

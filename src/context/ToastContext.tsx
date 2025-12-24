import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { Toast } from '../components/common';

export type ToastType = 'info' | 'success' | 'warning' | 'error';

interface ToastData {
    id: string;
    title: string;
    message: string;
    type?: ToastType;
    duration?: number;
}

interface ToastContextType {
    showToast: (title: string, message: string, type?: ToastType, duration?: number) => void;
    hideToast: (id: string) => void;
    hideAll: () => void;
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
    maxToasts?: number;
}

export const ToastProvider = ({ children, maxToasts = 5 }: ToastProviderProps) => {
    const [toasts, setToasts] = useState<ToastData[]>([]);

    const showToast = useCallback((title: string, message: string, type: ToastType = 'info', duration: number = 4000) => {
        const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        setToasts(prev => {
            const newToasts = [...prev, { id, title, message, type, duration }];
            // Limit number of visible toasts
            if (newToasts.length > maxToasts) {
                return newToasts.slice(-maxToasts);
            }
            return newToasts;
        });
    }, [maxToasts]);

    const hideToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    const hideAll = useCallback(() => {
        setToasts([]);
    }, []);

    return (
        <ToastContext.Provider value={{ showToast, hideToast, hideAll }}>
            {children}

            {/* Toast Container */}
            <div className="fixed top-4 right-4 left-4 sm:left-auto sm:right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
                {toasts.map((toast, index) => (
                    <div
                        key={toast.id}
                        className="pointer-events-auto"
                        style={{
                            zIndex: 9999 - index,
                            transform: `scale(${1 - index * 0.02})`,
                        }}
                    >
                        <Toast
                            id={toast.id}
                            title={toast.title}
                            message={toast.message}
                            type={toast.type}
                            duration={toast.duration}
                            onClose={hideToast}
                        />
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};

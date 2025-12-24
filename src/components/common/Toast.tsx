import { useEffect, useState, useRef } from 'react';
import { X, Check, Info, AlertTriangle, AlertCircle } from 'lucide-react';

interface ToastProps {
    id: string;
    title: string;
    message: string;
    type?: 'info' | 'success' | 'warning' | 'error';
    duration?: number;
    onClose: (id: string) => void;
}

export const Toast = ({ id, title, message, type = 'info', duration = 4000, onClose }: ToastProps) => {
    const [isExiting, setIsExiting] = useState(false);
    const [progress, setProgress] = useState(100);
    const [isPaused, setIsPaused] = useState(false);
    const [swipeX, setSwipeX] = useState(0);
    const startX = useRef(0);
    const currentX = useRef(0);

    useEffect(() => {
        if (isPaused) return;

        const startTime = Date.now();
        const interval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
            setProgress(remaining);

            if (remaining <= 0) {
                handleClose();
            }
        }, 50);

        return () => clearInterval(interval);
    }, [duration, isPaused]);

    const handleClose = () => {
        setIsExiting(true);
        setTimeout(() => onClose(id), 300);
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        startX.current = e.touches[0].clientX;
        currentX.current = startX.current;
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        currentX.current = e.touches[0].clientX;
        const deltaX = currentX.current - startX.current;
        setSwipeX(deltaX);
    };

    const handleTouchEnd = () => {
        const deltaX = currentX.current - startX.current;
        if (Math.abs(deltaX) > 100) {
            handleClose();
        } else {
            setSwipeX(0);
        }
    };

    const icons = {
        info: <Info className="text-blue-500" size={20} />,
        success: <Check className="text-green-500" size={20} />,
        warning: <AlertTriangle className="text-amber-500" size={20} />,
        error: <AlertCircle className="text-red-500" size={20} />
    };

    const borderColors = {
        info: 'border-l-blue-500',
        success: 'border-l-green-500',
        warning: 'border-l-amber-500',
        error: 'border-l-red-500'
    };

    const progressColors = {
        info: 'bg-blue-500',
        success: 'bg-green-500',
        warning: 'bg-amber-500',
        error: 'bg-red-500'
    };

    return (
        <div
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{ transform: `translateX(${swipeX}px)`, opacity: Math.max(0, 1 - Math.abs(swipeX) / 200) }}
            className={`
                relative w-full sm:max-w-sm bg-white dark:bg-slate-900 
                border border-slate-100 dark:border-slate-800 
                rounded-2xl shadow-2xl overflow-hidden
                transition-all duration-300 ease-out
                border-l-4 ${borderColors[type]}
                ${isExiting ? 'animate-out slide-out-to-right fade-out' : 'animate-in slide-in-from-top-2 sm:slide-in-from-right-4'}
            `}
        >
            <div className="p-4 flex items-start gap-3">
                <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-xl shrink-0">
                    {icons[type]}
                </div>
                <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm truncate">{title}</h4>
                    <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5 leading-relaxed line-clamp-2">{message}</p>
                </div>
                <button
                    onClick={handleClose}
                    className="p-1.5 text-slate-300 hover:text-slate-600 dark:hover:text-white transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 shrink-0"
                >
                    <X size={14} />
                </button>
            </div>

            {/* Progress bar */}
            <div className="h-1 bg-slate-100 dark:bg-slate-800">
                <div
                    className={`h-full ${progressColors[type]} transition-all duration-100 ease-linear`}
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    );
};

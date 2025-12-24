import { type ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';

interface AccordionProps {
    title: string;
    children: ReactNode;
    isOpen: boolean;
    onToggle: () => void;
}

export const Accordion = ({ title, children, isOpen, onToggle }: AccordionProps) => {
    return (
        <div className="border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden bg-white dark:bg-slate-900 shadow-sm transition-all hover:border-primary/50">
            <button
                onClick={onToggle}
                className="w-full px-6 py-4 flex items-center justify-between bg-slate-50 dark:bg-slate-800 hover:bg-white dark:hover:bg-slate-900 transition-colors"
            >
                <span className="font-bold text-slate-900 dark:text-white text-sm">{title}</span>
                <ChevronDown size={18} className={`text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}
            >
                <div className="p-6 text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800">
                    {children}
                </div>
            </div>
        </div>
    );
};

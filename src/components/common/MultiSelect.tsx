import { useState, useRef, useEffect } from 'react';
import { X, ChevronDown, Check } from 'lucide-react';

interface MultiSelectProps {
    label: string;
    options: string[];
    selected: string[];
    onChange: (selected: string[]) => void;
}

export const MultiSelect = ({ label, options, selected, onChange }: MultiSelectProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleOption = (option: string) => {
        if (selected.includes(option)) {
            onChange(selected.filter(s => s !== option));
        } else {
            onChange([...selected, option]);
        }
    };

    return (
        <div className="space-y-2" ref={containerRef}>
            {label && <label className="text-[10px] sm:text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">{label}</label>}
            <div className="relative">
                <div
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full px-5 py-3 min-h-[56px] bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl sm:rounded-[1.25rem] cursor-pointer hover:border-blue-300 transition-all flex flex-wrap gap-2 items-center"
                >
                    {selected.length === 0 && <span className="text-slate-400 font-bold text-sm">Select options...</span>}
                    {selected.map(s => (
                        <span key={s} className="bg-primary text-white text-xs font-bold px-2 py-1 rounded-lg flex items-center">
                            {s}
                            <X size={12} className="ml-1 cursor-pointer" onClick={(e) => { e.stopPropagation(); toggleOption(s); }} />
                        </span>
                    ))}
                    <div className="ml-auto text-slate-400"><ChevronDown size={18} /></div>
                </div>

                {isOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-xl z-50 max-h-60 overflow-y-auto no-scrollbar p-2">
                        {options.map(option => (
                            <div
                                key={option}
                                onClick={() => toggleOption(option)}
                                className={`px-4 py-3 rounded-lg text-sm font-bold cursor-pointer flex items-center justify-between transition-colors ${selected.includes(option) ? 'bg-blue-50 dark:bg-blue-900/30 text-primary' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                                    }`}
                            >
                                <span>{option}</span>
                                {selected.includes(option) && <Check size={16} />}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

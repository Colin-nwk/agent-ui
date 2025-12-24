import { InputHTMLAttributes, SelectHTMLAttributes, ReactNode, useState, useRef, useEffect, Children, isValidElement, ReactElement } from 'react';
import { ChevronDown, Search, Loader2, Check } from 'lucide-react';

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

export const Select = ({ label, children, className, value, onChange, ...props }: SelectProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Parse options from children
    const options = Children.toArray(children).map((child) => {
        if (isValidElement(child) && child.type === 'option') {
            const element = child as ReactElement<{ value: string | number | undefined, children: ReactNode }>;
            return {
                value: element.props.value,
                label: element.props.children
            };
        }
        return null;
    }).filter(Boolean) as { value: string | number | undefined, label: ReactNode }[];

    const selectedOption = options.find(opt => String(opt.value) === String(value));

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (optionValue: string | number | undefined) => {
        if (onChange) {
            // Mimic standard event object
            const event = {
                target: { value: optionValue, name: props.name },
                currentTarget: { value: optionValue, name: props.name }
            } as any;
            onChange(event);
        }
        setIsOpen(false);
    };

    return (
        <div className="space-y-2" ref={containerRef}>
            {label && <label className="text-[10px] sm:text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">{label}</label>}
            <div className="relative">
                <div
                    onClick={() => !props.disabled && setIsOpen(!isOpen)}
                    className={`w-full px-5 sm:px-6 py-3 sm:py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl sm:rounded-[1.25rem] text-sm sm:text-base text-slate-900 dark:text-white font-bold flex items-center justify-between cursor-pointer transition-all shadow-sm hover:border-blue-300 ${isOpen ? 'ring-2 ring-primary border-transparent' : ''} ${props.disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
                >
                    <span className={!selectedOption ? 'text-slate-400' : ''}>
                        {selectedOption ? selectedOption.label : 'Select an option...'}
                    </span>
                    <ChevronDown size={18} className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180 text-primary' : ''}`} />
                </div>

                {isOpen && !props.disabled && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-xl z-50 max-h-60 overflow-y-auto no-scrollbar p-2 animate-in fade-in zoom-in-95 duration-200">
                        {options.map((option, idx) => (
                            <div
                                key={`${option.value}-${idx}`}
                                onClick={() => handleSelect(option.value)}
                                className={`px-3 
                                    mt-1 py-2 rounded-lg text-sm font-bold cursor-pointer flex items-center justify-between transition-colors ${String(option.value) === String(value)
                                        ? 'bg-blue-50 dark:bg-blue-900/30 text-primary'
                                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                                    }`}
                            >
                                <span>{option.label}</span>
                                {String(option.value) === String(value) && <Check size={16} />}
                            </div>
                        ))}
                    </div>
                )}

                {/* Hidden select for form submission/accessibility if needed, though mostly visual replacement */}
                <select className="hidden" value={value} onChange={onChange} {...props}>
                    {children}
                </select>
            </div>
        </div>
    );
};

interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
    isLoading?: boolean;
}

export const SearchInput = ({ isLoading, className, ...props }: SearchInputProps) => {
    return (
        <div className={`bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center space-x-2 group focus-within:border-primary transition-colors ${className}`}>
            <Search className="text-slate-400 ml-2 group-focus-within:text-primary transition-colors" size={20} />
            <input
                type="text"
                className="flex-1 py-2 outline-none text-sm text-slate-900 dark:text-white bg-transparent placeholder:text-slate-400"
                {...props}
            />
            {isLoading && <Loader2 size={18} className="animate-spin text-primary mr-2" />}
        </div>
    );
};

import { Check } from 'lucide-react';

interface CheckboxProps {
    label: string;
    checked?: boolean;
    onChange?: (val: boolean) => void;
}

export const Checkbox = ({ label, checked, onChange }: CheckboxProps) => (
    <label className="flex items-center space-x-3 cursor-pointer group">
        <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all shrink-0 ${checked ? 'bg-primary border-primary shadow-md' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 group-hover:border-blue-400'}`}>
            {checked && <Check size={14} className="text-white" strokeWidth={4} />}
            <input type="checkbox" className="hidden" checked={checked} onChange={(e) => onChange?.(e.target.checked)} />
        </div>
        <span className="text-sm font-bold text-slate-700 dark:text-slate-300 select-none truncate">{label}</span>
    </label>
);

interface SwitchProps {
    label: string;
    enabled?: boolean;
    onChange?: (val: boolean) => void;
}

export const Switch = ({ label, enabled, onChange }: SwitchProps) => (
    <div className="flex items-center justify-between py-1 gap-4">
        <span className="text-sm font-bold text-slate-700 dark:text-slate-300 truncate">{label}</span>
        <button
            type="button"
            onClick={() => onChange?.(!enabled)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out focus:outline-none ${enabled ? 'bg-ubuxa-gradient shadow-sm' : 'bg-slate-200 dark:bg-slate-700'}`}
        >
            <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-300 ease-in-out ${enabled ? 'translate-x-5' : 'translate-x-0'}`} />
        </button>
    </div>
);

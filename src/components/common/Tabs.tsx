import { ReactNode } from 'react';

interface Tab {
    id: string;
    label: string;
    icon?: ReactNode;
}

interface TabsProps {
    tabs: Tab[];
    activeTab: string;
    onChange: (id: string) => void;
}

export const Tabs = ({ tabs, activeTab, onChange }: TabsProps) => (
    <div className="flex space-x-1.5 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-inner overflow-x-auto no-scrollbar">
        {tabs.map((tab) => (
            <button
                key={tab.id}
                onClick={() => onChange(tab.id)}
                className={`flex-1 flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab.id
                        ? 'bg-white dark:bg-slate-700 text-primary dark:text-white shadow-sm border border-slate-100 dark:border-slate-600'
                        : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                    }`}
            >
                {tab.icon && <span className={activeTab === tab.id ? 'text-primary dark:text-white' : ''}>{tab.icon}</span>}
                <span>{tab.label}</span>
            </button>
        ))}
    </div>
);

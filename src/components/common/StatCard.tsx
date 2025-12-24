import { type ReactNode } from 'react';
import { MoreVertical, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: ReactNode;
    trend?: string;
    positive?: boolean;
}

export const StatCard = ({ title, value, icon, trend, positive }: StatCardProps) => (
    <div className="bg-white dark:bg-slate-900 p-5 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800 group hover:border-primary hover:shadow-lg transition-all active:scale-[0.98]">
        <div className="flex justify-between items-start mb-4 sm:mb-6">
            <div className="p-3 sm:p-4 bg-slate-50 dark:bg-slate-800 rounded-xl sm:rounded-2xl group-hover:bg-ubuxa-gradient group-hover:text-white transition-all duration-500 shadow-sm shrink-0">
                {icon}
            </div>
            <button className="text-slate-300 dark:text-slate-600 hover:text-slate-600 dark:hover:text-slate-400 transition-colors">
                <MoreVertical size={18} />
            </button>
        </div>
        <div className="min-w-0">
            <p className="text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-widest truncate">{title}</p>
            <div className="flex items-baseline space-x-2 mt-1.5 flex-wrap">
                <h3 className="text-xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight italic truncate">{value}</h3>
                {trend && (
                    <span className={`text-[10px] font-black flex items-center px-1.5 py-0.5 rounded-lg shrink-0 ${positive ? 'text-green-600 bg-green-50 dark:bg-green-900/30 dark:text-green-400' : 'text-red-600 bg-red-50 dark:bg-red-900/30 dark:text-red-400'}`}>
                        {positive ? <ArrowUpRight size={12} className="mr-0.5" /> : <ArrowDownRight size={12} className="mr-0.5" />}
                        {trend}
                    </span>
                )}
            </div>
        </div>
    </div>
);

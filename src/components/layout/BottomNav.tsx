import { type ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';

interface BottomNavItemProps {
    to: string;
    icon: ReactNode;
    label: string;
}

export const BottomNavItem = ({ to, icon, label }: BottomNavItemProps) => {
    const location = useLocation();
    const isActive = location.pathname === to;
    return (
        <Link to={to} className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive ? 'text-primary' : 'text-slate-400 dark:text-slate-500'}`}>
            {icon}
            <span className="text-[10px] font-black uppercase tracking-wide">{label}</span>
        </Link>
    );
};

interface BottomNavProps {
    items: BottomNavItemProps[];
    centerAction?: { to: string; icon?: ReactNode };
}

export const BottomNav = ({ items, centerAction }: BottomNavProps) => {
    const centerIndex = Math.floor(items.length / 2);

    return (
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 pb-safe z-30 transition-colors duration-300">
            <div className="flex justify-around items-center h-16">
                {items.slice(0, centerIndex).map(item => (
                    <BottomNavItem key={item.to} {...item} />
                ))}

                {centerAction && (
                    <div className="relative -top-5">
                        <Link to={centerAction.to} className="w-14 h-14 bg-slate-900 dark:bg-slate-800 rounded-full flex items-center justify-center text-white shadow-lg shadow-slate-900/30 dark:shadow-slate-950/50 active:scale-95 transition-transform border border-slate-800 dark:border-slate-700">
                            {centerAction.icon || <ShoppingCart size={24} />}
                        </Link>
                    </div>
                )}

                {items.slice(centerIndex).map(item => (
                    <BottomNavItem key={item.to} {...item} />
                ))}
            </div>
        </nav>
    );
};

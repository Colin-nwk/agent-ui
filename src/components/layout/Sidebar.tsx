import { type ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LogOut } from 'lucide-react';

interface NavItemProps {
    to: string;
    icon: ReactNode;
    label: string;
}

export const NavItem = ({ to, icon, label }: NavItemProps) => {
    const location = useLocation();
    const isActive = location.pathname === to;
    return (
        <Link
            to={to}
            className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${isActive
                ? 'bg-ubuxa-gradient text-white font-bold shadow-lg shadow-ubuxa-blue/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
        >
            {icon}
            <span className="text-sm font-medium">{label}</span>
        </Link>
    );
};

import { User } from '../../types/auth';

interface SidebarProps {
    navItems: NavItemProps[];
    user: User | null;
    onLogout: () => void;
}

export const Sidebar = ({ navItems, user, onLogout }: SidebarProps) => {
    const displayName = user ? `${user.firstname} ${user.lastname}` : 'Agent';
    const initials = user ? `${user.firstname[0]}${user.lastname[0]}` : 'A';

    return (
        <aside className="hidden lg:flex flex-col w-64 bg-slate-900 dark:bg-slate-950 text-white border-r border-slate-800">
            <div className="p-6 flex items-center space-x-3 border-b border-slate-800">
                <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-icon-DNZnSknUp8lLLR2MbsmC5X4Nf2rXnN.png" alt="UBUXA" className="h-8 w-auto object-contain" />
            </div>

            <nav className="flex-1 p-4 space-y-2">
                {navItems.map(item => (
                    <NavItem key={item.to} {...item} />
                ))}
            </nav>

            <div className="p-4 border-t border-slate-800">
                <Link
                    to="/settings"
                    className="flex items-center p-3 mb-3 bg-slate-800 dark:bg-slate-900 rounded-xl hover:bg-slate-700 transition-colors cursor-pointer group"
                >
                    <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center mr-3 group-hover:bg-slate-600 transition-colors">
                        <span className="font-bold text-xs">{initials}</span>
                    </div>
                    <div>
                        <p className="text-sm font-bold group-hover:text-ubuxa-blue transition-colors">{displayName}</p>
                        <p className="text-xs text-slate-400">ID: {user?.agentId || '---'}</p>
                    </div>
                </Link>
                <button
                    onClick={onLogout}
                    className="flex items-center space-x-2 text-slate-400 hover:text-white w-full px-3 py-2 text-sm font-medium transition-colors"
                >
                    <LogOut size={16} />
                    <span>Sign Out</span>
                </button>
            </div>
        </aside>
    );
};

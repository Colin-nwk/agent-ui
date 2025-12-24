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

interface SidebarProps {
    navItems: NavItemProps[];
    user: { name: string; id: string };
    onLogout: () => void;
}

export const Sidebar = ({ navItems, user, onLogout }: SidebarProps) => {
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
                <div className="flex items-center p-3 mb-3 bg-slate-800 dark:bg-slate-900 rounded-xl">
                    <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center mr-3">
                        <span className="font-bold text-xs">{user.name.split(' ').map(n => n[0]).join('')}</span>
                    </div>
                    <div>
                        <p className="text-sm font-bold">{user.name}</p>
                        <p className="text-xs text-slate-400">Agent ID: {user.id}</p>
                    </div>
                </div>
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

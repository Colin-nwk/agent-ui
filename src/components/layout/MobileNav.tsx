import { type ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LogOut, Menu, X } from 'lucide-react';

interface MobileNavItemProps {
    to: string;
    icon: ReactNode;
    label: string;
    onClick: () => void;
}

export const MobileNavItem = ({ to, icon, label, onClick }: MobileNavItemProps) => {
    const location = useLocation();
    const isActive = location.pathname === to;
    return (
        <Link
            to={to}
            onClick={onClick}
            className={`flex items-center space-x-4 px-4 py-4 rounded-2xl transition-all ${isActive ? 'bg-ubuxa-gradient text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800'
                }`}
        >
            {icon}
            <span className="text-lg font-bold">{label}</span>
        </Link>
    );
};

interface MobileHeaderProps {
    isMenuOpen: boolean;
    onToggleMenu: () => void;
}

export const MobileHeader = ({ isMenuOpen, onToggleMenu }: MobileHeaderProps) => {
    return (
        <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 z-30 transition-colors duration-300">
            <div className="flex items-center space-x-2">
                <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-icon-DNZnSknUp8lLLR2MbsmC5X4Nf2rXnN.png" alt="UBUXA" className="h-8 w-auto object-contain" />
            </div>
            <button onClick={onToggleMenu} className="p-2 text-slate-600 dark:text-slate-300">
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
        </div>
    );
};

interface MobileMenuOverlayProps {
    isOpen: boolean;
    navItems: { to: string; icon: ReactNode; label: string }[];
    onClose: () => void;
    onLogout: () => void;
}

export const MobileMenuOverlay = ({ isOpen, navItems, onClose, onLogout }: MobileMenuOverlayProps) => {
    if (!isOpen) return null;

    return (
        <div className="lg:hidden fixed inset-0 z-20 bg-slate-900/95 backdrop-blur-sm pt-20 px-6 overflow-y-auto">
            <nav className="space-y-4 pb-10">
                {navItems.map(item => (
                    <MobileNavItem key={item.to} {...item} onClick={onClose} />
                ))}
                <button
                    onClick={() => { onLogout(); onClose(); }}
                    className="flex items-center space-x-4 text-slate-400 w-full px-4 py-4 text-lg font-bold border-t border-slate-800 mt-8"
                >
                    <LogOut size={24} />
                    <span>Sign Out</span>
                </button>
            </nav>
        </div>
    );
};

import { useState, ReactNode } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Sidebar, MobileHeader, MobileMenuOverlay, BottomNav, Header } from './index';
import OfflineIndicator from '../../features/OfflineIndicator';
import {
    LayoutDashboard,
    Users,
    ShoppingCart,
    Layers,
    Map,
    Smartphone,
    Settings,
    Wallet,
} from 'lucide-react';

const NAV_ITEMS = [
    { to: '/', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { to: '/navigation', icon: <Map size={20} />, label: 'Navigation' },
    { to: '/customers', icon: <Users size={20} />, label: 'Customers' },
    { to: '/sales', icon: <ShoppingCart size={20} />, label: 'Sales' },
    { to: '/packages', icon: <Layers size={20} />, label: 'Packages' },
    { to: '/devices', icon: <Smartphone size={20} />, label: 'Devices' },
];

const BOTTOM_NAV_ITEMS = [
    { to: '/', icon: <LayoutDashboard size={20} />, label: 'Home' },
    { to: '/customers', icon: <Users size={20} />, label: 'Clients' },
    { to: '/transactions', icon: <Wallet size={20} />, label: 'Wallet' },
    { to: '/settings', icon: <Settings size={20} />, label: 'More' },
];

interface ProtectedLayoutProps {
    children?: ReactNode;
}

export const ProtectedLayout = ({ children }: ProtectedLayoutProps) => {
    const { isAuthenticated, user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="flex h-screen bg-background-light dark:bg-background-dark font-sans text-text-primary dark:text-slate-100 transition-colors duration-300">
            <OfflineIndicator />

            <Sidebar
                navItems={NAV_ITEMS}
                user={user || { name: 'User', id: '0000' }}
                onLogout={logout}
            />

            <MobileHeader
                isMenuOpen={isMobileMenuOpen}
                onToggleMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />

            <MobileMenuOverlay
                isOpen={isMobileMenuOpen}
                navItems={NAV_ITEMS}
                onClose={() => setIsMobileMenuOpen(false)}
                onLogout={logout}
            />

            <main className="flex-1 overflow-auto flex flex-col pt-16 lg:pt-0">
                <Header theme={theme} onToggleTheme={toggleTheme} />

                <div className="max-w-6xl mx-auto p-4 lg:p-8 w-full flex-1">
                    {children || <Outlet />}
                </div>
            </main>

            <BottomNav
                items={BOTTOM_NAV_ITEMS}
                centerAction={{ to: '/sales', icon: <ShoppingCart size={24} /> }}
            />
        </div>
    );
};

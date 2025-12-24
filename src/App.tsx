import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  Package,
  Settings,
  Bell,
  Layers,
  Map,
  Wrench,
  BarChart3,
  Smartphone,
  Wallet,
  Palette,
} from 'lucide-react';

import { ThemeProvider, useTheme } from './context';
import { Sidebar, MobileHeader, MobileMenuOverlay, BottomNav, Header } from './components/layout';
import { initDB } from './services/db';

// Feature imports
import Dashboard from './features/dashboard/Dashboard';
import Login from './features/auth/Login';
import Sales from './features/sales/Sales';
import Customers from './features/customers/Customers';
import Inventory from './features/inventory/Inventory';
import Devices from './features/devices/Devices';
import Packages from './features/packages/Packages';
import Transactions from './features/transactions/Transactions';
import Reports from './features/reports/Reports';
import SettingsView from './features/settings/SettingsView';
import Notifications from './features/notifications/Notifications';
import Navigation from './features/navigation/Navigation';
import Installer from './features/installer/Installer';
import ComponentGallery from './features/gallery/ComponentGallery';
import OfflineIndicator from './features/OfflineIndicator';

const NAV_ITEMS = [
  { to: '/', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
  { to: '/navigation', icon: <Map size={20} />, label: 'Navigation' },
  // { to: '/notifications', icon: <Bell size={20} />, label: 'Notifications' },
  { to: '/customers', icon: <Users size={20} />, label: 'Customers' },
  { to: '/sales', icon: <ShoppingCart size={20} />, label: 'Sales' },
  // { to: '/installer', icon: <Wrench size={20} />, label: 'Installer' },
  // { to: '/transactions', icon: <Wallet size={20} />, label: 'Transactions' },
  // { to: '/inventory', icon: <Package size={20} />, label: 'Inventory' },
  { to: '/packages', icon: <Layers size={20} />, label: 'Packages' },
  { to: '/devices', icon: <Smartphone size={20} />, label: 'Devices' },
  // { to: '/reports', icon: <BarChart3 size={20} />, label: 'Reports' },
  // { to: '/gallery', icon: <Palette size={20} />, label: 'UI Gallery' },
  // { to: '/settings', icon: <Settings size={20} />, label: 'Settings' },
];

const BOTTOM_NAV_ITEMS = [
  { to: '/', icon: <LayoutDashboard size={20} />, label: 'Home' },
  { to: '/customers', icon: <Users size={20} />, label: 'Clients' },
  { to: '/transactions', icon: <Wallet size={20} />, label: 'Wallet' },
  { to: '/settings', icon: <Settings size={20} />, label: 'More' },
];

const CURRENT_USER = { name: 'Collins Nwoko', id: '8821' };

const AppContent = () => {
  const { theme, toggleTheme } = useTheme();
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('agent_auth') === 'true');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    initDB().catch(console.error);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('agent_auth');
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <Router>
      <div className="flex h-screen bg-background-light dark:bg-background-dark font-sans text-text-primary dark:text-slate-100 transition-colors duration-300">

        <OfflineIndicator />

        <Sidebar
          navItems={NAV_ITEMS}
          user={CURRENT_USER}
          onLogout={handleLogout}
        />

        <MobileHeader
          isMenuOpen={isMobileMenuOpen}
          onToggleMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />

        <MobileMenuOverlay
          isOpen={isMobileMenuOpen}
          navItems={NAV_ITEMS}
          onClose={() => setIsMobileMenuOpen(false)}
          onLogout={handleLogout}
        />

        <main className="flex-1 overflow-auto flex flex-col pt-16 lg:pt-0">
          <Header theme={theme} onToggleTheme={toggleTheme} />

          <div className="max-w-6xl mx-auto p-4 lg:p-8 w-full flex-1">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/navigation" element={<Navigation />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/sales" element={<Sales />} />
              <Route path="/installer" element={<Installer />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/packages" element={<Packages />} />
              <Route path="/devices" element={<Devices />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/gallery" element={<ComponentGallery />} />
              <Route path="/settings" element={<SettingsView />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </main>

        <BottomNav
          items={BOTTOM_NAV_ITEMS}
          centerAction={{ to: '/sales', icon: <ShoppingCart size={24} /> }}
        />
      </div>
    </Router>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

export default App;

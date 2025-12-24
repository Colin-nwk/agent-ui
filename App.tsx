
import React, { useState, useEffect, createContext, useContext } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  ShoppingCart, 
  Package, 
  Settings, 
  LogOut,
  Menu,
  X,
  Moon,
  Sun,
  Palette,
  BarChart3,
  Smartphone,
  Wallet,
  Bell,
  Layers,
  Map,
  Wrench
} from 'lucide-react';
import Dashboard from './components/Dashboard';
import Customers from './components/Customers';
import Sales from './components/Sales';
import Inventory from './components/Inventory';
import Packages from './components/Packages';
import Devices from './components/Devices';
import SettingsView from './components/SettingsView';
import Login from './components/Login';
import ComponentGallery from './components/ComponentGallery';
import Reports from './components/Reports';
import Transactions from './components/Transactions';
import Notifications from './components/Notifications';
import OfflineIndicator from './components/OfflineIndicator';
import Navigation from './components/Navigation';
import Installer from './components/Installer';
import { initDB } from './utils/db';

// Theme Context
export const ThemeContext = createContext({
  theme: 'light',
  toggleTheme: () => {}
});

export const useTheme = () => useContext(ThemeContext);

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('agent_auth') === 'true');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Theme State
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Initialize DB
  useEffect(() => {
    initDB().catch(console.error);
  }, []);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  if (!isLoggedIn) {
    return (
      <ThemeContext.Provider value={{ theme, toggleTheme }}>
        <Login onLogin={() => setIsLoggedIn(true)} />
      </ThemeContext.Provider>
    );
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <Router>
        <div className="flex h-screen bg-background-light dark:bg-background-dark font-sans text-text-primary dark:text-slate-100 transition-colors duration-300">
          
          <OfflineIndicator />

          {/* Desktop Sidebar */}
          <aside className="hidden lg:flex flex-col w-64 bg-slate-900 dark:bg-slate-950 text-white border-r border-slate-800">
            <div className="p-6 flex items-center space-x-3 border-b border-slate-800">
              <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-icon-DNZnSknUp8lLLR2MbsmC5X4Nf2rXnN.png" alt="UBUXA" className="h-8 w-auto object-contain" />
            </div>

            <nav className="flex-1 p-4 space-y-2">
               <NavItem to="/" icon={<LayoutDashboard size={20} />} label="Dashboard" />
               <NavItem to="/navigation" icon={<Map size={20} />} label="Navigation" />
               <NavItem to="/notifications" icon={<Bell size={20} />} label="Notifications" />
               <NavItem to="/customers" icon={<Users size={20} />} label="Customers" />
               <NavItem to="/sales" icon={<ShoppingCart size={20} />} label="Sales" />
               <NavItem to="/installer" icon={<Wrench size={20} />} label="Installer" />
               <NavItem to="/transactions" icon={<Wallet size={20} />} label="Transactions" />
               <NavItem to="/inventory" icon={<Package size={20} />} label="Inventory" />
               <NavItem to="/packages" icon={<Layers size={20} />} label="Packages" />
               <NavItem to="/devices" icon={<Smartphone size={20} />} label="Devices" />
               <NavItem to="/reports" icon={<BarChart3 size={20} />} label="Reports" />
               <NavItem to="/gallery" icon={<Palette size={20} />} label="UI Gallery" />
               <NavItem to="/settings" icon={<Settings size={20} />} label="Settings" />
            </nav>

            <div className="p-4 border-t border-slate-800">
               <div className="flex items-center p-3 mb-3 bg-slate-800 dark:bg-slate-900 rounded-xl">
                  <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center mr-3">
                     <span className="font-bold text-xs">CN</span>
                  </div>
                  <div>
                     <p className="text-sm font-bold">Collins Nwoko</p>
                     <p className="text-xs text-slate-400">Agent ID: 8821</p>
                  </div>
               </div>
               <button 
                 onClick={() => { localStorage.removeItem('agent_auth'); setIsLoggedIn(false); }}
                 className="flex items-center space-x-2 text-slate-400 hover:text-white w-full px-3 py-2 text-sm font-medium transition-colors"
               >
                 <LogOut size={16} />
                 <span>Sign Out</span>
               </button>
            </div>
          </aside>

          {/* Mobile Header */}
          <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 z-30 transition-colors duration-300">
             <div className="flex items-center space-x-2">
                <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-icon-DNZnSknUp8lLLR2MbsmC5X4Nf2rXnN.png" alt="UBUXA" className="h-8 w-auto object-contain" />
             </div>
             <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-600 dark:text-slate-300">
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
             </button>
          </div>

          {/* Mobile Menu Overlay */}
          {isMobileMenuOpen && (
             <div className="lg:hidden fixed inset-0 z-20 bg-slate-900/95 backdrop-blur-sm pt-20 px-6 overflow-y-auto">
                <nav className="space-y-4 pb-10">
                   <MobileNavItem to="/" icon={<LayoutDashboard size={24} />} label="Dashboard" onClick={() => setIsMobileMenuOpen(false)} />
                   <MobileNavItem to="/navigation" icon={<Map size={24} />} label="Navigation" onClick={() => setIsMobileMenuOpen(false)} />
                   <MobileNavItem to="/notifications" icon={<Bell size={24} />} label="Notifications" onClick={() => setIsMobileMenuOpen(false)} />
                   <MobileNavItem to="/customers" icon={<Users size={24} />} label="Customers" onClick={() => setIsMobileMenuOpen(false)} />
                   <MobileNavItem to="/sales" icon={<ShoppingCart size={24} />} label="Sales" onClick={() => setIsMobileMenuOpen(false)} />
                   <MobileNavItem to="/installer" icon={<Wrench size={24} />} label="Installer" onClick={() => setIsMobileMenuOpen(false)} />
                   <MobileNavItem to="/transactions" icon={<Wallet size={24} />} label="Transactions" onClick={() => setIsMobileMenuOpen(false)} />
                   <MobileNavItem to="/inventory" icon={<Package size={24} />} label="Inventory" onClick={() => setIsMobileMenuOpen(false)} />
                   <MobileNavItem to="/packages" icon={<Layers size={24} />} label="Packages" onClick={() => setIsMobileMenuOpen(false)} />
                   <MobileNavItem to="/devices" icon={<Smartphone size={24} />} label="Devices" onClick={() => setIsMobileMenuOpen(false)} />
                   <MobileNavItem to="/reports" icon={<BarChart3 size={24} />} label="Reports" onClick={() => setIsMobileMenuOpen(false)} />
                   <MobileNavItem to="/gallery" icon={<Palette size={24} />} label="UI Gallery" onClick={() => setIsMobileMenuOpen(false)} />
                   <MobileNavItem to="/settings" icon={<Settings size={24} />} label="Settings" onClick={() => setIsMobileMenuOpen(false)} />
                   <button 
                     onClick={() => { localStorage.removeItem('agent_auth'); setIsLoggedIn(false); }}
                     className="flex items-center space-x-4 text-slate-400 w-full px-4 py-4 text-lg font-bold border-t border-slate-800 mt-8"
                   >
                     <LogOut size={24} />
                     <span>Sign Out</span>
                   </button>
                </nav>
             </div>
          )}

          {/* Main Content */}
          <main className="flex-1 overflow-auto flex flex-col pt-16 lg:pt-0">
            {/* Desktop Top Bar */}
            <header className="hidden lg:flex justify-end items-center p-4 bg-transparent">
              <button 
                onClick={toggleTheme}
                className="p-2 rounded-full bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 shadow-sm border border-slate-200 dark:border-slate-700 hover:text-primary dark:hover:text-primary transition-colors"
                title="Toggle Theme"
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </header>

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

          {/* Mobile Bottom Navigation */}
          <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 pb-safe z-30 transition-colors duration-300">
            <div className="flex justify-around items-center h-16">
              <BottomNavItem to="/" icon={<LayoutDashboard size={20} />} label="Home" />
              <BottomNavItem to="/customers" icon={<Users size={20} />} label="Clients" />
              <div className="relative -top-5">
                 <Link to="/sales" className="w-14 h-14 bg-slate-900 dark:bg-slate-800 rounded-full flex items-center justify-center text-white shadow-lg shadow-slate-900/30 dark:shadow-slate-950/50 active:scale-95 transition-transform border border-slate-800 dark:border-slate-700">
                    <ShoppingCart size={24} />
                 </Link>
              </div>
              <BottomNavItem to="/transactions" icon={<Wallet size={20} />} label="Wallet" />
              <BottomNavItem to="/settings" icon={<Settings size={20} />} label="More" />
            </div>
          </nav>

        </div>
      </Router>
    </ThemeContext.Provider>
  );
};

const NavItem: React.FC<{ to: string, icon: React.ReactNode, label: string }> = ({ to, icon, label }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link 
      to={to} 
      className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
        isActive 
        ? 'bg-ubuxa-gradient text-white font-bold shadow-lg shadow-ubuxa-blue/20' 
        : 'text-slate-400 hover:text-white hover:bg-slate-800'
      }`}
    >
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </Link>
  );
};

const MobileNavItem: React.FC<{ to: string, icon: React.ReactNode, label: string, onClick: () => void }> = ({ to, icon, label, onClick }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link 
      to={to} 
      onClick={onClick}
      className={`flex items-center space-x-4 px-4 py-4 rounded-2xl transition-all ${
        isActive ? 'bg-ubuxa-gradient text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800'
      }`}
    >
      {icon}
      <span className="text-lg font-bold">{label}</span>
    </Link>
  );
};

const BottomNavItem: React.FC<{ to: string, icon: React.ReactNode, label: string }> = ({ to, icon, label }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link to={to} className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive ? 'text-primary' : 'text-slate-400 dark:text-slate-500'}`}>
      {icon}
      <span className="text-[10px] font-black uppercase tracking-wide">{label}</span>
    </Link>
  );
};

export default App;

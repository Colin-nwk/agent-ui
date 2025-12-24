
import React from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  Package,
  Settings,
  Palette,
  BarChart3,
  Smartphone,
  Wallet,
  Bell,
  Layers,
  Map,
  Wrench
} from 'lucide-react';

const PAGES = [
  { path: '/', label: 'Dashboard', icon: <LayoutDashboard size={24} />, description: 'Overview of performance and stats' },
  { path: '/notifications', label: 'Notifications', icon: <Bell size={24} />, description: 'System alerts and updates' },
  { path: '/customers', label: 'Customers', icon: <Users size={24} />, description: 'Manage client profiles' },
  { path: '/sales', label: 'Sales', icon: <ShoppingCart size={24} />, description: 'Process and view sales' },
  { path: '/installer', label: 'Installer Tasks', icon: <Wrench size={24} />, description: 'Manage installations and repairs' },
  { path: '/transactions', label: 'Transactions', icon: <Wallet size={24} />, description: 'Financial audit logs' },
  { path: '/inventory', label: 'Inventory', icon: <Package size={24} />, description: 'Stock management' },
  { path: '/packages', label: 'Packages', icon: <Layers size={24} />, description: 'Product bundles' },
  { path: '/devices', label: 'Devices', icon: <Smartphone size={24} />, description: 'Hardware management' },
  { path: '/reports', label: 'Reports', icon: <BarChart3 size={24} />, description: 'Analytics and exports' },
  { path: '/gallery', label: 'UI Gallery', icon: <Palette size={24} />, description: 'Component design system' },
  { path: '/settings', label: 'Settings', icon: <Settings size={24} />, description: 'App preferences' },
];

const Navigation: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20 lg:pb-0">
      <div>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Navigation</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Quick access to all application modules</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {PAGES.map((page) => (
          <Link
            key={page.path}
            to={page.path}
            className="flex items-start space-x-4 p-6 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 hover:border-ubuxa-blue hover:shadow-lg transition-all active:scale-[0.98] group"
          >
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl text-slate-500 dark:text-slate-400 group-hover:bg-ubuxa-gradient group-hover:text-white transition-colors">
              {page.icon}
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-ubuxa-blue dark:group-hover:text-ubuxa-blue transition-colors">{page.label}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{page.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Navigation;

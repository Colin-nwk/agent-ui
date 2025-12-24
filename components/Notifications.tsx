
import React, { useState, useMemo } from 'react';
import { 
  Bell, 
  Check, 
  ShoppingCart, 
  AlertTriangle, 
  Calendar, 
  DollarSign, 
  Search, 
  CheckCircle2, 
  Clock, 
  Filter,
  Trash2
} from 'lucide-react';
import { PrimaryButton, Tabs, Toast } from './Shared';
import { Notification } from '../types';

const MOCK_NOTIFICATIONS: Notification[] = [
  { id: '1', title: 'New Sale Confirmed', message: 'Transaction SL-2024-001 for Starter Home Bundle has been successfully processed.', type: 'SALE', read: false, time: '2 mins ago' },
  { id: '2', title: 'Payment Reminder', message: 'Upcoming installment due for Customer Kathleen P. in 2 days.', type: 'PAYMENT', read: false, time: '1 hour ago' },
  { id: '3', title: 'Default Alert', message: 'Customer Ericka Considine has missed 2 consecutive payments. Immediate action required.', type: 'ALERT', read: true, time: '1 day ago' },
  { id: '4', title: 'Installation Task', message: 'New installation scheduled for Plot 4, Admiralty Way, Lekki.', type: 'TASK', read: false, time: '5 hours ago' },
  { id: '5', title: 'Stock Low', message: 'Luminous 220Ah Battery stock is below 5 units. Please restock.', type: 'ALERT', read: false, time: '3 hours ago' },
  { id: '6', title: 'System Maintenance', message: 'Scheduled maintenance window tonight at 2:00 AM.', type: 'ALERT', read: true, time: '2 days ago' },
  { id: '7', title: 'Commission Payout', message: 'Your wallet has been credited with ₦45,000 commission.', type: 'PAYMENT', read: true, time: '3 days ago' },
  { id: '8', title: 'Task Completed', message: 'Installation at 12 Benson St marked as complete.', type: 'TASK', read: true, time: '3 days ago' },
];

const Notifications: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState<{ title: string; message: string; type: any } | null>(null);

  const filteredNotifications = useMemo(() => {
    return notifications.filter(n => {
      const matchesTab = 
        activeTab === 'all' ? true :
        activeTab === 'unread' ? !n.read :
        activeTab === 'alerts' ? n.type === 'ALERT' : true;
      
      const matchesSearch = 
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        n.message.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesTab && matchesSearch;
    });
  }, [notifications, activeTab, searchQuery]);

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setToast({ title: 'Success', message: 'All notifications marked as read', type: 'success' });
  };

  const deleteNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const tabs = [
    { id: 'all', label: 'All Updates', icon: <Bell size={14} /> },
    { id: 'unread', label: 'Unread', icon: <Clock size={14} /> },
    { id: 'alerts', label: 'Alerts', icon: <AlertTriangle size={14} /> }
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'SALE': return <ShoppingCart size={20} />;
      case 'PAYMENT': return <DollarSign size={20} />;
      case 'ALERT': return <AlertTriangle size={20} />;
      case 'TASK': return <Calendar size={20} />;
      default: return <Bell size={20} />;
    }
  };

  const getColors = (type: string) => {
    switch (type) {
      case 'SALE': return 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800';
      case 'PAYMENT': return 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800';
      case 'ALERT': return 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800';
      case 'TASK': return 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800';
      default: return 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700';
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in slide-in-from-right-4 duration-500 pb-24 lg:pb-0">
      {toast && (
        <Toast 
          title={toast.title} 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
           <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Notifications</h1>
           <p className="text-slate-500 dark:text-slate-400 font-medium text-xs sm:text-sm mt-1">Stay updated with sales, tasks, and system alerts</p>
        </div>
        <PrimaryButton icon={<CheckCircle2 size={18} />} onClick={markAllAsRead}>
           Mark All as Read
        </PrimaryButton>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filters & Search - Desktop: Left Sidebar Style, Mobile: Top Stack */}
        <div className="lg:w-72 space-y-6 shrink-0">
          <div className="bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
             <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-ubuxa-blue transition-colors" size={18} />
                <input 
                  type="text" 
                  placeholder="Search notifications..." 
                  className="w-full pl-10 pr-4 py-3 bg-transparent text-sm font-medium text-slate-900 dark:text-white focus:outline-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
             </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-4 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm space-y-2">
             <p className="px-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Filters</p>
             {tabs.map(tab => (
               <button
                 key={tab.id}
                 onClick={() => setActiveTab(tab.id)}
                 className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                   activeTab === tab.id 
                     ? 'bg-ubuxa-gradient text-white shadow-lg shadow-ubuxa-blue/20 font-bold' 
                     : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                 }`}
               >
                 {tab.icon}
                 <span className="text-sm">{tab.label}</span>
                 {tab.id === 'unread' && notifications.some(n => !n.read) && (
                   <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                     {notifications.filter(n => !n.read).length}
                   </span>
                 )}
               </button>
             ))}
          </div>

          <div className="hidden lg:block bg-ubuxa-gradient p-6 rounded-[2rem] text-white shadow-lg relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
             <Bell size={32} className="mb-4" />
             <h4 className="text-lg font-bold">Stay Connected</h4>
             <p className="text-sm opacity-80 mt-1 leading-relaxed">Turn on push notifications to get real-time updates on your device.</p>
             <button className="mt-4 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-xs font-bold transition-colors">Enable Push</button>
          </div>
        </div>

        {/* Notification List */}
        <div className="flex-1 space-y-4">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map(notification => (
              <div 
                key={notification.id} 
                onClick={() => markAsRead(notification.id)}
                className={`group relative p-5 sm:p-6 rounded-[1.5rem] border transition-all duration-300 hover:shadow-md cursor-pointer ${
                  !notification.read 
                    ? 'bg-white dark:bg-slate-900 border-l-4 border-l-ubuxa-blue border-y-slate-100 border-r-slate-100 dark:border-y-slate-800 dark:border-r-slate-800 shadow-sm' 
                    : 'bg-slate-50/50 dark:bg-slate-900/50 border-slate-100 dark:border-slate-800 opacity-80 hover:opacity-100'
                }`}
              >
                <div className="flex items-start gap-4 sm:gap-6">
                   <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center border shrink-0 transition-transform group-hover:scale-105 ${getColors(notification.type)}`}>
                      {getIcon(notification.type)}
                   </div>
                   
                   <div className="flex-1 min-w-0 pt-1">
                      <div className="flex justify-between items-start">
                         <h3 className={`text-base sm:text-lg font-bold truncate pr-4 ${!notification.read ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>
                           {notification.title}
                         </h3>
                         <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide shrink-0 whitespace-nowrap">
                           {notification.time}
                         </span>
                      </div>
                      <p className={`text-sm mt-1.5 leading-relaxed ${!notification.read ? 'text-slate-600 dark:text-slate-300 font-medium' : 'text-slate-500 dark:text-slate-500'}`}>
                        {notification.message}
                      </p>
                      
                      <div className="flex items-center justify-between mt-4">
                         <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md ${
                            notification.type === 'ALERT' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                         }`}>
                            {notification.type}
                         </span>
                         
                         <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            {!notification.read && (
                              <button 
                                onClick={(e) => { e.stopPropagation(); markAsRead(notification.id); }}
                                className="p-2 text-ubuxa-blue hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                title="Mark as Read"
                              >
                                <CheckCircle2 size={18} />
                              </button>
                            )}
                            <button 
                              onClick={(e) => deleteNotification(notification.id, e)}
                              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <Trash2 size={18} />
                            </button>
                         </div>
                      </div>
                   </div>
                </div>
                {!notification.read && (
                   <div className="absolute top-6 right-6 w-2 h-2 bg-red-500 rounded-full ring-4 ring-white dark:ring-slate-900 lg:hidden"></div>
                )}
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
               <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-300 dark:text-slate-600 mb-6">
                  <Bell size={40} />
               </div>
               <h3 className="text-xl font-bold text-slate-900 dark:text-white">All Caught Up!</h3>
               <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-xs">You have no notifications matching your current filters.</p>
               <button 
                 onClick={() => { setActiveTab('all'); setSearchQuery(''); }}
                 className="mt-6 text-ubuxa-blue font-bold text-sm hover:underline"
               >
                 Reset Filters
               </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;

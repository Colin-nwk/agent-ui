
import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { getSyncQueueCount, clearSyncQueue } from '../utils/db';

const OfflineIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [lastSynced, setLastSynced] = useState<Date>(new Date());
  const [pendingSyncs, setPendingSyncs] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
        setIsOnline(true);
        syncData();
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial check for pending items
    getSyncQueueCount().then(setPendingSyncs);

    const interval = setInterval(() => {
        if(navigator.onLine) {
            getSyncQueueCount().then(count => {
                if(count > 0 && !isSyncing) syncData();
            });
        }
    }, 10000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);

  const syncData = async () => {
      const count = await getSyncQueueCount();
      if (count === 0) return;

      setIsSyncing(true);
      setPendingSyncs(count);

      // Simulate network sync delay
      setTimeout(async () => {
          await clearSyncQueue();
          setLastSynced(new Date());
          setPendingSyncs(0);
          setIsSyncing(false);
      }, 2000);
  };

  return (
    <div className={`fixed top-3 left-1/2 -translate-x-1/2 z-[200] flex items-center space-x-2 sm:space-x-3 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full shadow-lg transition-all duration-300 ${
        !isOnline ? 'bg-slate-900 text-white' : 'bg-white/90 dark:bg-slate-800/90 backdrop-blur-md text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700'
    }`}>
      <div className={`p-1.5 rounded-full ${!isOnline ? 'bg-red-500/20 text-red-400' : isSyncing ? 'bg-blue-500/10 text-blue-500' : 'bg-green-500/10 text-green-600'}`}>
         {!isOnline ? <WifiOff size={14} /> : isSyncing ? <RefreshCw size={14} className="animate-spin" /> : <Wifi size={14} />}
      </div>
      <div className="flex flex-col items-start">
         <p className="text-[10px] font-bold uppercase tracking-wider leading-none">
             {!isOnline ? 'Offline' : isSyncing ? 'Syncing' : 'Online'}
         </p>
         {(!isOnline || isSyncing) ? (
            <p className="text-[9px] opacity-80 font-medium leading-tight mt-0.5">
                {!isOnline ? `${pendingSyncs} Queued` : 'Uploading...'}
            </p>
         ) : (
            <p className="text-[9px] opacity-60 font-medium leading-tight mt-0.5 hidden sm:block">
               System Active
            </p>
         )}
      </div>
    </div>
  );
};

export default OfflineIndicator;

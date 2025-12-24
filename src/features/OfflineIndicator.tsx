import { useState, useEffect, useCallback } from 'react';
import { Wifi, WifiOff, RefreshCw, Clock } from 'lucide-react';
import { getSyncQueueCount, clearSyncQueue } from '../services/db';

const OfflineIndicator = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [lastSynced, setLastSynced] = useState<Date | null>(null);
  const [pendingSyncs, setPendingSyncs] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);

  // Real connectivity check - ping a reliable endpoint
  const checkConnectivity = useCallback(async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      // Use a simple fetch to check connectivity
      const response = await fetch('https://httpbin.org/get', {
        method: 'HEAD',
        mode: 'no-cors',
        cache: 'no-store',
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      setIsOnline(true);
      return true;
    } catch {
      setIsOnline(false);
      return false;
    }
  }, []);

  const syncData = useCallback(async () => {
    const count = await getSyncQueueCount();
    if (count === 0) {
      setLastSynced(new Date());
      return;
    }

    setIsSyncing(true);
    setPendingSyncs(count);

    // Simulate network sync delay (replace with real API calls)
    setTimeout(async () => {
      await clearSyncQueue();
      setLastSynced(new Date());
      setPendingSyncs(0);
      setIsSyncing(false);
    }, 2000);
  }, []);

  const handleManualSync = async () => {
    const online = await checkConnectivity();
    if (online) {
      syncData();
    }
  };

  useEffect(() => {
    // Check connectivity on mount
    checkConnectivity();

    // Listen to browser online/offline events as a backup
    const handleOnline = () => {
      checkConnectivity();
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial sync queue check
    getSyncQueueCount().then(setPendingSyncs);

    // Periodic connectivity check every 10 seconds
    const connectivityInterval = setInterval(() => {
      checkConnectivity();
    }, 10000);

    // Periodic sync check
    const syncInterval = setInterval(() => {
      if (isOnline) {
        getSyncQueueCount().then(count => {
          setPendingSyncs(count);
          if (count > 0 && !isSyncing) syncData();
        });
      }
    }, 15000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(connectivityInterval);
      clearInterval(syncInterval);
    };
  }, [checkConnectivity, syncData, isOnline, isSyncing]);

  const formatLastSynced = () => {
    if (!lastSynced) return 'Never';
    const diff = Date.now() - lastSynced.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return lastSynced.toLocaleDateString();
  };

  return (
    <div className={`fixed top-3 left-1/2 -translate-x-1/2 z-[200] flex items-center space-x-2 sm:space-x-3 px-3 py-2 sm:px-4 sm:py-2.5 rounded-full shadow-lg transition-all duration-300 ${!isOnline
        ? 'bg-red-600 text-white'
        : isSyncing
          ? 'bg-blue-600 text-white'
          : 'bg-white/95 dark:bg-slate-800/95 backdrop-blur-md text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700'
      }`}>
      {/* Status Icon */}
      <div className={`p-1.5 rounded-full ${!isOnline
          ? 'bg-white/20'
          : isSyncing
            ? 'bg-white/20'
            : 'bg-green-500/10'
        }`}>
        {!isOnline ? (
          <WifiOff size={14} />
        ) : isSyncing ? (
          <RefreshCw size={14} className="animate-spin" />
        ) : (
          <Wifi size={14} className="text-green-600 dark:text-green-400" />
        )}
      </div>

      {/* Status Text */}
      <div className="flex flex-col items-start">
        <p className="text-[10px] font-bold uppercase tracking-wider leading-none">
          {!isOnline ? 'Offline' : isSyncing ? 'Syncing...' : 'Online'}
        </p>
        <p className="text-[9px] opacity-70 font-medium leading-tight mt-0.5 flex items-center">
          {!isOnline ? (
            `${pendingSyncs} items queued`
          ) : (
            <>
              <Clock size={9} className="mr-1" />
              {formatLastSynced()}
            </>
          )}
        </p>
      </div>

      {/* Sync Button */}
      {(pendingSyncs > 0 || !isOnline) && !isSyncing && (
        <button
          onClick={handleManualSync}
          className={`p-1.5 rounded-full transition-colors ${!isOnline
              ? 'bg-white/20 hover:bg-white/30'
              : 'bg-blue-500/10 hover:bg-blue-500/20 text-blue-600'
            }`}
          title="Sync now"
        >
          <RefreshCw size={12} />
        </button>
      )}
    </div>
  );
};

export default OfflineIndicator;

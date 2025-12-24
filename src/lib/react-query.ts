import { QueryClient } from '@tanstack/react-query';
import { PersistQueryClientProvider, Persister } from '@tanstack/react-query-persist-client';
import { get, set, del } from 'idb-keyval';

// Custom persister using idb-keyval for robust offline storage
// This bypasses the 5MB localStorage limit
export const createIDBPersister = (id: string = 'reactQuery'): Persister => {
  return {
    persistClient: async (client) => {
      await set(id, client);
    },
    restoreClient: async () => {
      return await get(id);
    },
    removeClient: async () => {
      await del(id);
    },
  };
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1, // Retry failed requests once
      networkMode: 'offlineFirst', // Serve from cache if offline
    },
  },
});

export const persister = createIDBPersister('agent-ui-cache');

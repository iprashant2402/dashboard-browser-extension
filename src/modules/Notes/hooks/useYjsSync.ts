import { useCallback, useEffect, useState } from 'react';
import { createYjsSyncService, SyncConfig } from '../services/YjsSyncService';
import { Page } from '../types/Page';

export const useYjsSync = (config: SyncConfig) => {
    const [syncService] = useState(() => createYjsSyncService(config));
    const [isSyncing, setIsSyncing] = useState(false);
    const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
    const [syncError, setSyncError] = useState<string | null>(null);

    const syncPage = useCallback(async (page: Page) => {
        if (isSyncing) return false;
        
        setIsSyncing(true);
        setSyncError(null);
        
        try {
            const success = await syncService.syncPage(page);
            if (success) {
                setLastSyncTime(new Date());
            }
            return success;
        } catch (error) {
            setSyncError(error instanceof Error ? error.message : 'Sync failed');
            return false;
        } finally {
            setIsSyncing(false);
        }
    }, [syncService, isSyncing]);

    const syncAllPages = useCallback(async () => {
        if (isSyncing) return;
        
        setIsSyncing(true);
        setSyncError(null);
        
        try {
            await syncService.syncAllPages();
            setLastSyncTime(new Date());
        } catch (error) {
            setSyncError(error instanceof Error ? error.message : 'Sync failed');
        } finally {
            setIsSyncing(false);
        }
    }, [syncService, isSyncing]);

    const updateSyncConfig = useCallback((newConfig: Partial<SyncConfig>) => {
        syncService.updateConfig(newConfig);
    }, [syncService]);

    const startPeriodicSync = useCallback(() => {
        if (config.syncInterval) {
            syncService.updateConfig({ syncInterval: config.syncInterval });
        }
    }, [syncService, config.syncInterval]);

    const stopPeriodicSync = useCallback(() => {
        syncService.stopPeriodicSync();
    }, [syncService]);

    useEffect(() => {
        return () => {
            syncService.destroy();
        };
    }, [syncService]);

    return {
        syncPage,
        syncAllPages,
        updateSyncConfig,
        startPeriodicSync,
        stopPeriodicSync,
        isSyncing,
        lastSyncTime,
        syncError
    };
};
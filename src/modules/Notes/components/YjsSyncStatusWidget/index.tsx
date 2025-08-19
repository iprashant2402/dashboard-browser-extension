import React from 'react';
import { useYjsSync } from '../../hooks/useYjsSync';
import './index.css';

interface YjsSyncStatusWidgetProps {
    syncConfig: {
        cloudEndpoint: string;
        syncInterval?: number;
        authToken?: string;
    };
    className?: string;
}

export const YjsSyncStatusWidget: React.FC<YjsSyncStatusWidgetProps> = ({ 
    syncConfig, 
    className = '' 
}) => {
    const { 
        syncAllPages, 
        isSyncing, 
        lastSyncTime, 
        syncError,
        startPeriodicSync,
        stopPeriodicSync
    } = useYjsSync(syncConfig);

    const handleManualSync = () => {
        if (!isSyncing) {
            syncAllPages();
        }
    };

    const formatLastSyncTime = (date: Date | null) => {
        if (!date) return 'Never';
        
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / (1000 * 60));
        
        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        
        const diffHours = Math.floor(diffMins / 60);
        if (diffHours < 24) return `${diffHours}h ago`;
        
        return date.toLocaleDateString();
    };

    const getSyncStatusIcon = () => {
        if (isSyncing) return '⟳';
        if (syncError) return '⚠';
        if (lastSyncTime) return '✓';
        return '○';
    };

    const getSyncStatusText = () => {
        if (isSyncing) return 'Syncing...';
        if (syncError) return `Error: ${syncError}`;
        return `Last sync: ${formatLastSyncTime(lastSyncTime)}`;
    };

    return (
        <div className={`yjs-sync-widget ${className}`}>
            <div className="sync-status">
                <span className={`sync-icon ${isSyncing ? 'spinning' : ''} ${syncError ? 'error' : ''}`}>
                    {getSyncStatusIcon()}
                </span>
                <span className="sync-text">{getSyncStatusText()}</span>
            </div>
            
            <div className="sync-controls">
                <button 
                    onClick={handleManualSync}
                    disabled={isSyncing}
                    className="sync-button"
                    title="Sync now"
                >
                    Sync
                </button>
                
                {syncConfig.syncInterval && (
                    <button 
                        onClick={startPeriodicSync}
                        className="auto-sync-button"
                        title="Enable automatic sync"
                    >
                        Auto
                    </button>
                )}
                
                <button 
                    onClick={stopPeriodicSync}
                    className="stop-sync-button"
                    title="Stop automatic sync"
                >
                    Stop
                </button>
            </div>
        </div>
    );
};
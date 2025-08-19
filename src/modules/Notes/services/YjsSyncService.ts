import { yjsPageService } from './YjsPageService';
import { Page } from '../types/Page';

export interface SyncConfig {
    cloudEndpoint: string;
    syncInterval?: number; // in milliseconds
    authToken?: string;
}

export interface CloudPageState {
    pageId: string;
    state: string; // base64 encoded Y.js state
    lastModified: string;
}

export class YjsSyncService {
    private config: SyncConfig;
    private syncInProgress = false;
    private syncInterval?: NodeJS.Timeout;

    constructor(config: SyncConfig) {
        this.config = config;
        
        if (config.syncInterval) {
            this.startPeriodicSync();
        }
    }

    private startPeriodicSync(): void {
        if (this.syncInterval) {
            clearInterval(this.syncInterval);
        }
        
        if (this.config.syncInterval) {
            this.syncInterval = setInterval(() => {
                this.syncAllPages().catch(console.error);
            }, this.config.syncInterval);
        }
    }

    async syncPage(page: Page): Promise<boolean> {
        if (this.syncInProgress) {
            console.log('Sync already in progress, skipping...');
            return false;
        }

        this.syncInProgress = true;

        try {
            const doc = yjsPageService.getPageDoc(page.id);
            const localState = yjsPageService.getDocumentState(page.id);
            const localStateBase64 = this.uint8ArrayToBase64(localState);

            const cloudState = await this.fetchCloudState(page.id);
            
            if (cloudState) {
                const cloudStateBytes = this.base64ToUint8Array(cloudState.state);
                yjsPageService.applyDocumentUpdate(page.id, cloudStateBytes);
            }

            const mergedState = yjsPageService.getDocumentState(page.id);
            const mergedStateBase64 = this.uint8ArrayToBase64(mergedState);

            if (mergedStateBase64 !== localStateBase64 || !cloudState) {
                await this.pushStateToCloud(page.id, mergedStateBase64);
            }

            return true;
        } catch (error) {
            console.error('Sync failed for page:', page.id, error);
            return false;
        } finally {
            this.syncInProgress = false;
        }
    }

    async syncAllPages(): Promise<void> {
        if (this.syncInProgress) {
            console.log('Sync already in progress, skipping bulk sync...');
            return;
        }

        console.log('Starting sync for all pages...');
        
        // This would typically get pages from your existing page repository
        // For now, we'll sync all active Yjs documents
        const pageIds = Array.from((yjsPageService as any).docs.keys());
        
        for (const pageId of pageIds) {
            try {
                const mockPage: Page = {
                    id: pageId,
                    title: '',
                    content: '',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    order: 0
                };
                await this.syncPage(mockPage);
            } catch (error) {
                console.error(`Failed to sync page ${pageId}:`, error);
            }
        }
        
        console.log('Completed sync for all pages');
    }

    private async fetchCloudState(pageId: string): Promise<CloudPageState | null> {
        try {
            const response = await fetch(`${this.config.cloudEndpoint}/pages/${pageId}/state`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    ...(this.config.authToken && { 'Authorization': `Bearer ${this.config.authToken}` })
                }
            });

            if (response.status === 404) {
                return null; // Page doesn't exist in cloud yet
            }

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Failed to fetch cloud state:', error);
            throw error;
        }
    }

    private async pushStateToCloud(pageId: string, stateBase64: string): Promise<void> {
        try {
            const cloudPageState: CloudPageState = {
                pageId,
                state: stateBase64,
                lastModified: new Date().toISOString()
            };

            const response = await fetch(`${this.config.cloudEndpoint}/pages/${pageId}/state`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    ...(this.config.authToken && { 'Authorization': `Bearer ${this.config.authToken}` })
                },
                body: JSON.stringify(cloudPageState)
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
        } catch (error) {
            console.error('Failed to push state to cloud:', error);
            throw error;
        }
    }

    private uint8ArrayToBase64(uint8Array: Uint8Array): string {
        return btoa(String.fromCharCode(...uint8Array));
    }

    private base64ToUint8Array(base64: string): Uint8Array {
        const binaryString = atob(base64);
        const uint8Array = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            uint8Array[i] = binaryString.charCodeAt(i);
        }
        return uint8Array;
    }

    updateConfig(newConfig: Partial<SyncConfig>): void {
        this.config = { ...this.config, ...newConfig };
        
        if (newConfig.syncInterval !== undefined) {
            this.startPeriodicSync();
        }
    }

    stopPeriodicSync(): void {
        if (this.syncInterval) {
            clearInterval(this.syncInterval);
            this.syncInterval = undefined;
        }
    }

    destroy(): void {
        this.stopPeriodicSync();
    }
}

// Export a configurable instance
export const createYjsSyncService = (config: SyncConfig) => new YjsSyncService(config);
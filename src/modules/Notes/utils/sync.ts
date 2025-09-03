import { localDB } from "../../../utils/LocalDBStorage";
import { SimpleDelta } from "../types/SyncDeltas";

interface SimpleDeltaWithId extends SimpleDelta {
    id: string;
}

export const SyncQueue = {
    add: async (delta: SimpleDelta) => {
        const deltaWithId = { ...delta, id: `${delta.pageId}_${delta.toVersion}_${delta.timestamp}` };
        try {
            await localDB.add<SimpleDeltaWithId>('syncQueue', deltaWithId);
        } catch (error) {
            // If add fails due to duplicate key, use update instead
            if (error instanceof Error && error.name === 'ConstraintError') {
                await localDB.update<SimpleDeltaWithId>('syncQueue', deltaWithId);
            } else {
                throw error;
            }
        }
    },
    get: async () => {
        try {
            const syncQueue = await localDB.getAll<SimpleDeltaWithId>('syncQueue');
            return syncQueue;
        } catch (error) {
            console.error('Error getting sync queue:', error);
            return [];
        }
    },
    remove: async (pageId: string, toVersion: number) => {
        // Get all sync queue items to find ones matching pageId and toVersion
        const allItems = await localDB.getAll<SimpleDeltaWithId>('syncQueue');
        const itemsToRemove = allItems.filter(item => 
            item.pageId === pageId && item.toVersion === toVersion
        );
        
        // Remove all matching items
        for (const item of itemsToRemove) {
            await localDB.delete('syncQueue', item.id);
        }
    }
}
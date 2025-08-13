import { localDB } from "../../../utils/LocalDBStorage";
import { SimpleDelta } from "../types/SyncDeltas";

interface SimpleDeltaWithId extends SimpleDelta {
    id: string;
}

export const SyncQueue = {
    add: async (delta: SimpleDelta) => {
        await localDB.add<SimpleDeltaWithId>('syncQueue', { ...delta, id: `${delta.pageId}_${delta.toVersion}` });
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
        await localDB.delete('syncQueue', `${pageId}_${toVersion}`);
    }
}
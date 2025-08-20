export type SimpleChangeOperation = 'insert' | 'update' | 'delete' | 'format';

export interface SimpleChange {
    nodeId: string,
    operation: SimpleChangeOperation,
    content?: unknown,
    position?: number,
    metadata?: unknown
}

export interface SimpleDelta {
    pageId: string,
    fromVersion: number,
    toVersion: number,
    changes: SimpleChange[],
    timestamp: number,
  }

export interface SyncDeltasRequest {
    deltas: SimpleDelta[],
}

export interface SyncResponse {
    success: boolean;
    processedVersions: number[];
    processed: number;
    failed: number;
    conflicts?: ConflictInfo[];
  }
  
  export interface ConflictInfo {
    pageId: string;
    clientVersion: number;
    serverVersion: number;
    conflictType: 'version' | 'content';
    resolution?: 'auto' | 'manual';
  }

  export interface DeltasResponse {
    deltas: SimpleDelta[];
    currentVersion: number;
    hasMore: boolean;
  }

export interface SyncStatus {
    lastSyncTime: string;
    totalPages: number;
    status: 'healthy'
}
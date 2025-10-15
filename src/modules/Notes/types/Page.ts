export interface Page {
    id: string;
    title: string;
    content?: string;
    version: number;
    updatedAt: Date;
    createdAt: Date;
    syncedAt?: string;
    isPublic?: boolean;
}

export interface PageCloudRef {
    id: string;
    title: string;
    content?: unknown;
    version: number;
    updatedAt: string;
    createdAt: string;
    syncedAt: string;
    isPublic: boolean;
  }

export interface PagesListResponse {
    pages: PageSummary[];
    lastSyncTime: string;
    total: number;
  }
  
  export interface PageSummary {
    id: string;
    title: string;
    version: number;
    updatedAt: string;
    isDeleted: boolean;
  }

  export interface CreatePageRequest {
    id: string;
    title: string;
    content?: unknown;
  }

  export interface UpdatePageRequest {
    title?: string;
    content?: unknown;
    lastModifiedAt?: string;
  }

  export interface BatchSyncRequest {
    pages: CreatePageRequest[];
  }

  export interface ProcessedPageInfo {
    id: string;
    version: number;
    updatedAt: string;
  }
  
  export interface BatchSyncResponse {
    success: boolean;
    processedPages: ProcessedPageInfo[];
    processed: number;
    failed: number;
  }

  export type PageSyncStatus = 'NOT_FOUND' | 'OUTDATED' | 'UP_TO_DATE' | 'UPDATE_AVAILABLE';

  export interface CheckPagesStatusRequest {
    pages: {
        id: string;
        updatedAt: string;
    }[];
  }

  export interface CheckPagesStatusResponse {
    pages: {
        id: string;
        status: PageSyncStatus;
        serverUpdatedAt?: string;
    }[];
  }
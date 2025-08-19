export interface Page {
    id: string;
    title: string;
    content?: string;
    version: number;
    updatedAt: Date;
    createdAt: Date;
    syncedAt?: string;
}

export interface PageCloudRef {
    id: string;
    title: string;
    content?: unknown;
    version: number;
    updatedAt: string;
    createdAt: string;
    syncedAt: string;
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
    title: string;
    content?: unknown;
  }

  export interface UpdatePageRequest {
    title?: string;
    content?: unknown;
    lastModifiedAt?: string;
  }
  
import { apiManager } from "../../../utils/ApiManager";
import { BatchSyncRequest, BatchSyncResponse, CheckPagesStatusRequest, CheckPagesStatusResponse, CreatePageRequest, PageCloudRef, PagesListResponse, UpdatePageRequest } from "../types/Page";
import { DeltasResponse, SimpleDelta, SyncResponse, SyncStatus } from "../types/SyncDeltas";

class PagesSyncRepository {

    async createPage(page: CreatePageRequest) {
        const response = await apiManager.post<PageCloudRef>('/pages', page);
        return response.data;
    }

    async getPages() {
        const response = await apiManager.get<PagesListResponse>('/pages');
        return response.data;
    }

    async getPage(id: string) {
        const response = await apiManager.get<PageCloudRef>('/pages/' + id);
        return response.data;
    }

    async updatePage(id: string, page: UpdatePageRequest) {
        const response = await apiManager.put<PageCloudRef>('/pages/' + id, page);
        return response.data;
    }

    async deletePage(id: string) {
        const response = await apiManager.delete<{success: boolean}>('/pages/' + id);
        return response.data;
    }

    async batchSync(pages: BatchSyncRequest) {
        const response = await apiManager.post<BatchSyncResponse>('/pages/batch-sync', pages);
        return response.data;
    }

    async checkPagesStatus(pages: CheckPagesStatusRequest) {
        const response = await apiManager.post<CheckPagesStatusResponse>('/pages/check-status', pages);
        return response.data;
    }

    async syncDeltas(deltas: SimpleDelta[]) {
        const response = await apiManager.post<SyncResponse>('/pages/sync/deltas', {deltas});
        return response.data;
    }

    async getPageDeltas(pageId: string, since: number) {
        const response = await apiManager.get<DeltasResponse>('/pages/sync/deltas/' + pageId + '?since=' + since);
        return response.data;
    }

    async getSyncStatus() {
        const response = await apiManager.get<SyncStatus>('/pages/sync/status');
        return response.data;
    }

    async makePagePublic(pageId: string) {
        const response = await apiManager.put<PageCloudRef>(`/pages/${pageId}/public`);
        return response.data;
    }

    async makePagePrivate(pageId: string) {
        const response = await apiManager.put<PageCloudRef>(`/pages/${pageId}/private`);
        return response.data;
    }

    async getPublicPageById(pageId: string) {
        const response = await apiManager.get<PageCloudRef>('/pages/public/' + pageId);
        return response.data;
    }
}

export const pagesSyncRepository = new PagesSyncRepository();
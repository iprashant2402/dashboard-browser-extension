import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BatchSyncRequest, CheckPagesStatusRequest, Page } from "../types/Page";
import { pagesSyncRepository } from "../api";
import { localPageRepository } from "../repository/PageRepository";
import { ACCESS_TOKEN_KEY, PAGES_QUERY_KEYS, UPDATE_AVAILABLE_PAGES_KEY, UPDATE_AVAILABLE_PAGES_KEYS_SEPARATOR } from "../utils/contants";

const checkPagesStatus = async (pages: Page[]) => {
    const pagesToCheck: CheckPagesStatusRequest = {
        pages: pages.map(page => ({
            id: page.id,
            updatedAt: page.updatedAt.toISOString(),
        })),
    }
    const response = await pagesSyncRepository.checkPagesStatus(pagesToCheck);
    return response.pages;
}

const batchSync = async () => {
    const isAuthenticated = !!localStorage.getItem(ACCESS_TOKEN_KEY);
    if (!isAuthenticated) return;
    const pages = await localPageRepository.getPages();
    if (pages.length === 0) return undefined;
    const pagesStatus = await checkPagesStatus(pages);
    const pagesToSync = pages.filter(page => pagesStatus.find((status) => status.id === page.id)?.status === 'UPDATE_AVAILABLE');

    // To be used later while fetching specific page when opened in editor
    if (pagesToSync.length > 0) {
        localStorage.setItem(UPDATE_AVAILABLE_PAGES_KEY, pagesToSync.map(page => page.id).join(UPDATE_AVAILABLE_PAGES_KEYS_SEPARATOR));
    }
    const pagesToUpdateOrCreate = pages.filter(page => ["NOT_FOUND", "OUTDATED"].includes(pagesStatus.find((status) => status.id === page.id)?.status ?? ''));

    if (pagesToUpdateOrCreate.length === 0) return undefined;

    const batchSyncRequest: BatchSyncRequest = {
        pages: pagesToUpdateOrCreate.map(page => ({
            id: page.id,
            title: page.title,
            content: page.content,
            version: page.version,
        })),
    }
    const response = await pagesSyncRepository.batchSync(batchSyncRequest);

    const processedPages = response.processedPages;

    processedPages.forEach(async (page) => {
        await localPageRepository.updatePage(page.id, {
            version: page.version,
            updatedAt: new Date(page.updatedAt),
        });
    });

    return response;
};

export const useBatchSync = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: batchSync,
        onSuccess: (data) => {
            if (!data) return;
            queryClient.invalidateQueries({ queryKey: PAGES_QUERY_KEYS.allPages });
        }
    });
}
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BatchSyncRequest } from "../types/Page";
import { pagesSyncRepository } from "../api";
import { localPageRepository } from "../repository/PageRepository";
import { PAGES_QUERY_KEYS } from "../utils/contants";

const batchSync = async () => {
    const pages = await localPageRepository.getPages();
    const batchSyncRequest: BatchSyncRequest = {
        pages: pages.map(page => ({
            id: page.id,
            title: page.title,
            content: page.content,
            version: page.version,
        })),
    }
    const response = await pagesSyncRepository.batchSync(batchSyncRequest);
    return response;
};

export const useBatchSync = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: batchSync,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: PAGES_QUERY_KEYS.allPages });
        }
    });
}
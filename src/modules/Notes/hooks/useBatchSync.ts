import { useMutation } from "@tanstack/react-query";
import { BatchSyncRequest } from "../types/Page";
import { pagesSyncRepository } from "../api";
import { localPageRepository } from "../repository/PageRepository";

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

    return useMutation({
        mutationFn: batchSync,
    });
}
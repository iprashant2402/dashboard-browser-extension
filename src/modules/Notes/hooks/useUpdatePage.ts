import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ACCESS_TOKEN_KEY, PAGES_QUERY_KEYS } from "../utils/contants";
import { localPageRepository } from "../repository/PageRepository";
import { Page } from "../types/Page";
import { pagesSyncRepository } from "../api";

const updatePage = async (args: { id: string, page: Partial<Page> , sync: boolean}) => {
    const isAuthenticated = !!localStorage.getItem(ACCESS_TOKEN_KEY);
    if (isAuthenticated && args.sync) {
        const remotePage = await pagesSyncRepository.updatePage(args.id, args.page);
        const localUpdatedPage = await localPageRepository.updatePage(args.id, {
            ...args.page,
            version: remotePage.version,
            updatedAt: new Date(remotePage.updatedAt),
        });
        return {
            updatedPage: localUpdatedPage,
            sync: args.sync,
        };
    }
    const updatedPage = await localPageRepository.updatePage(args.id, args.page);
    return {
        updatedPage,
        sync: args.sync,
    };
}

export const useUpdatePage = (options?: { onSuccess: () => void }) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updatePage,
        onSuccess: (data) => {
            if (data.sync) {
                queryClient.invalidateQueries({ queryKey: PAGES_QUERY_KEYS.allPages });
            }
            options?.onSuccess?.();
        },
    });
};  
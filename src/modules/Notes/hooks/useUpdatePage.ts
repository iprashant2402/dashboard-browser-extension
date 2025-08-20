import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PAGES_QUERY_KEYS } from "../utils/contants";
import { localPageRepository } from "../repository/PageRepository";
import { Page } from "../types/Page";
import { pagesSyncRepository } from "../api";

const updatePage = async (args: { id: string, page: Partial<Page> , sync: boolean}) => {
    const updatedPage = await localPageRepository.updatePage(args.id, args.page);
    const isAuthenticated = !!localStorage.getItem('access_token');
    if (isAuthenticated && args.sync) {
        const remotePage = await pagesSyncRepository.updatePage(args.id, args.page);
        return {
            updatedPage: remotePage,
            sync: args.sync,
        };
    }
    return {
        updatedPage,
        sync: args.sync,
    };
}

export const useUpdatePage = (options?: { onSuccess: () => void }) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (args: { id: string, page: Partial<Page> , sync: boolean}) => updatePage(args),
        onSuccess: (data) => {
            if (data.sync) {
                queryClient.invalidateQueries({ queryKey: PAGES_QUERY_KEYS.allPages });
            }
            options?.onSuccess?.();
        },
    });
};  
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Page } from "../types/Page";
import { localPageRepository } from "../repository/PageRepository";
import { pagesSyncRepository } from "../api";
import { PAGES_QUERY_KEYS } from "../utils/contants";

const fetchPage = async (id: string) => {
    const page = await localPageRepository.getPage(id);
    const isAuthenticated = !!localStorage.getItem('access_token');
    if (!page && isAuthenticated) {
        const remotePage = await pagesSyncRepository.getPage(id);
        if (remotePage) {
            const page = await localPageRepository.createPage({
                id: remotePage.id,
                title: remotePage.title,
                content: remotePage.content as string,
                createdAt: new Date(remotePage.createdAt),
                updatedAt: new Date(remotePage.updatedAt),
                version: remotePage.version,
            });
            return page;
        }
    }
    if (!page) throw new Error('PAGE_NOT_FOUND');
    return page;
}

export const useFetchPage = (id?: string) => {
    return useQuery({
        queryKey: ['page', id],
        queryFn: () => fetchPage(id!),
        enabled: !!id,
        staleTime: 0,
        gcTime: 0,
        refetchOnMount: true,
    });
};

export const useCreatePage = (options?: { onSuccess: () => void }) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (page: Page) => localPageRepository.createPage(page),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: PAGES_QUERY_KEYS.allPages });
            options?.onSuccess?.();
        },
    });
};

export const useUpdatePage = (options?: { onSuccess: () => void }) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (args: { id: string, page: Partial<Page> }) => localPageRepository.updatePage(args.id, args.page),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: PAGES_QUERY_KEYS.allPages });
            options?.onSuccess?.();
        },
    });
};

export const useDeletePage = (options?: { onSuccess: () => void }) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => localPageRepository.deletePage(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: PAGES_QUERY_KEYS.allPages });
            options?.onSuccess?.();
        },
    });
};
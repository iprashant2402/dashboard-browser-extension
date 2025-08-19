import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Page } from "../types/Page";
import { yjsPageRepository } from "../repository/YjsPageRepository";

export const useFetchPage = (id?: string) => {
    return useQuery({
        queryKey: ['page', id],
        queryFn: () => yjsPageRepository.getPage(id!),
        enabled: !!id,
        staleTime: 0,
        gcTime: 0,
        refetchOnMount: true,
    });
};

export const useCreatePage = (options?: { onSuccess: () => void }) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (page: Page) => yjsPageRepository.createPage(page),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['pages'] });
            options?.onSuccess?.();
        },
    });
};

export const useUpdatePage = (options?: { onSuccess: () => void }) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (args: { id: string, page: Partial<Page> }) => yjsPageRepository.updatePage(args.id, args.page),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['pages'] });
            options?.onSuccess?.();
        },
    });
};

export const useDeletePage = (options?: { onSuccess: () => void }) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => yjsPageRepository.deletePage(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['pages'] });
            options?.onSuccess?.();
        },
    });
};
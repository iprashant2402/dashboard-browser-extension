import { useMutation, useQueryClient } from "@tanstack/react-query";
import { localPageRepository } from "../repository/PageRepository";
import { PAGES_QUERY_KEYS } from "../utils/contants";
import { pagesSyncRepository } from "../api";

const deletePage = async (id: string) => {
    const isAuthenticated = !!localStorage.getItem('access_token');
    if (isAuthenticated) {
        await pagesSyncRepository.deletePage(id);
    }
    await localPageRepository.deletePage(id);
}

export const useDeletePage = (options?: { onSuccess: () => void }) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deletePage(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: PAGES_QUERY_KEYS.allPages });
            options?.onSuccess?.();
        },
    });
};
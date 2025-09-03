import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ACCESS_TOKEN_KEY, PAGES_QUERY_KEYS } from "../utils/contants";
import { localPageRepository } from "../repository/PageRepository";
import { Page } from "../types/Page";
import { pagesSyncRepository } from "../api";

const createPage = async (page: Page) => {
    const newPage = await localPageRepository.createPage(page);
    const isAuthenticated = !!localStorage.getItem(ACCESS_TOKEN_KEY);
    if (isAuthenticated) {
        try {
            const remotePage = await pagesSyncRepository.createPage(page);
            return remotePage;
        } catch (e) {
            console.error(e);
            return newPage;
        }
    }
    return newPage;
}

export const useCreatePage = (options?: { onSuccess: () => void }) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (page: Page) => createPage(page),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: PAGES_QUERY_KEYS.allPages });
            options?.onSuccess?.();
        },
    });
};
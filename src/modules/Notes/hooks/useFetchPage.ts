import { useQuery } from "@tanstack/react-query";
import { localPageRepository } from "../repository/PageRepository";
import { pagesSyncRepository } from "../api";
import { ACCESS_TOKEN_KEY } from "../utils/contants";

const fetchPage = async (id: string) => {
    const page = await localPageRepository.getPage(id);
    console.log('page', page);
    const isAuthenticated = !!localStorage.getItem(ACCESS_TOKEN_KEY);
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
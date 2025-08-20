import { useQuery } from "@tanstack/react-query";
import { localPageRepository } from "../repository/PageRepository";
import { pagesSyncRepository } from "../api";
import { PAGES_QUERY_KEYS } from "../utils/contants";

const fetchAllPages = async () => {
    const localPages = await localPageRepository.getPagesSummary();
    const isAuthenticated = !!localStorage.getItem('access_token');
    try {
        if (isAuthenticated) {
            const remotePages = await pagesSyncRepository.getPages();
            return remotePages.pages;
        }
        return localPages;
    }catch(e) {
        console.error(e);
        return localPages;
    }
};

export const useFetchAllPages = () => {
    return useQuery({
        queryKey: PAGES_QUERY_KEYS.allPages,
        queryFn: fetchAllPages,
        select: (data) => data.sort((a, b) => {
            return a.title.localeCompare(b.title);
        })
    });
};
import { useQuery } from "@tanstack/react-query";
import { localPageRepository } from "../repository/PageRepository";

export const useFetchAllPages = () => {
    return useQuery({
        queryKey: ['pages'],
        queryFn: () => localPageRepository.getPages(),
        select: (data) => data.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
    });
};
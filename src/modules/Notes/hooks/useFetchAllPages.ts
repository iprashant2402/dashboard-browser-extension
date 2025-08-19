import { useQuery } from "@tanstack/react-query";
import { yjsPageRepository } from "../repository/YjsPageRepository";

export const useFetchAllPages = () => {
    return useQuery({
        queryKey: ['pages'],
        queryFn: () => yjsPageRepository.getPages(),
        select: (data) => data.sort((a, b) => {
                return b.order - a.order;
        })
    });
};
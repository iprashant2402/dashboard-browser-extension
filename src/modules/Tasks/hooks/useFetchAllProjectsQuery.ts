import { useQuery } from "@tanstack/react-query"
import { localDB } from "../../../utils/LocalDBStorage";
import { Project } from "../types/Project";

export const useFetchAllProjectsQuery = () => {
    return useQuery({
        queryKey: ['projects'],
        queryFn: () => {
            return localDB.getAll<Project>('projects');
        },
        select: (data) => data.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
    });
}
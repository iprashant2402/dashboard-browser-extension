import { useQuery } from "@tanstack/react-query"
import { localProjectRepository } from "../repository/ProjectRepository";

export const useFetchAllProjectsQuery = () => {
    return useQuery({
        queryKey: ['projects'],
        queryFn: () => {
            return localProjectRepository.getProjects();
        },
        select: (data) => data.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
    });
}

export const useFetchProjectDetailsQuery = (projectId?: string) => {
    return useQuery({
        queryKey: ['project', projectId],
        queryFn: () => {
            return localProjectRepository.getProject(projectId!);
        },
        enabled: !!projectId
    });
}
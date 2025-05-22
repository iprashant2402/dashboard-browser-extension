import { useQuery } from "@tanstack/react-query";
import { localProjectRepository } from "../repository/ProjectRepository";

export const useFetchAllTasks = (projectId?: string) => {
    return useQuery({
        queryKey: ['tasks', projectId],
        queryFn: () => localProjectRepository.getTasks(projectId!),
        enabled: !!projectId
    });
}
import { useMutation } from "@tanstack/react-query";
import { Project } from "../types/Project";
import { localProjectRepository } from "../repository/ProjectRepository";

export const useCreateProject = (options?: { onSuccess: () => void }) => {
    return useMutation({
        mutationFn: (project: Project) => {
            return localProjectRepository.createProject(project);
        },
        onSuccess: options?.onSuccess
    });
};

export const useUpdateProject = (options?: { onSuccess: () => void }) => {
    return useMutation({
        mutationFn: (args: { id: string, project: Partial<Project> }) => {
            return localProjectRepository.updateProject(args.id, args.project);
        },
        onSuccess: options?.onSuccess
    });
};
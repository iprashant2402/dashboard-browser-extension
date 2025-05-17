import { Project } from "../types/Project";
import { useCallback } from "react";
import { useFetchAllProjectsQuery } from "./useFetchAllProjectsQuery";
import { useCreateProject, useUpdateProject } from "./useCreateProject";
import { useDeleteProject } from "./useDeleteProject";

export const useProjectList = () => {
    const { data: projects, isLoading: isFetchingProjects, error: fetchProjectsError, refetch } = useFetchAllProjectsQuery();
    const { mutate: createProject, isPending: isCreatingProject, isError: isCreatingProjectError } = useCreateProject(
        { onSuccess: () => refetch() }
    );
    const { mutate: updateProject, isPending: isUpdatingProject, isError: isUpdatingProjectError } = useUpdateProject(
        { onSuccess: () => refetch() }
    );

    const { mutate: deleteProject, isPending: isDeletingProject, isError: isDeletingProjectError } = useDeleteProject(
        { onSuccess: () => refetch() }
    );

    const handleCreateProjectSubmit = useCallback((project: Project) => {
        createProject(project);
    }, [createProject]);

    const handleUpdateProjectSubmit = useCallback((args: { id: string, project: Partial<Project> }) => {
        updateProject(args);
    }, [updateProject]);

    const handleDeleteProject = useCallback((id: string) => {
        deleteProject(id);
    }, [deleteProject]);

    const handleRenameProject = useCallback((id: string, name: string) => {
        updateProject({ id, project: { name } });
    }, [updateProject]);

    return {
        state: {
            projects,
            isFetchingProjects,
            fetchProjectsError,
            isCreatingProject,
            isCreatingProjectError,
            isUpdatingProject,
            isUpdatingProjectError,
            isDeletingProject,
            isDeletingProjectError
        },
        actions: {
            handleCreateProjectSubmit,
            handleUpdateProjectSubmit,
            handleDeleteProject,
            handleRenameProject
        }
    }
}
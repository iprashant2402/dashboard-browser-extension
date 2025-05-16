import { Project } from "../types/Project";
import { useCallback } from "react";
import { useFetchAllProjectsQuery } from "./useFetchAllProjectsQuery";
import { useCreateProject, useUpdateProject } from "./useCreateProject";

export const useProjectList = () => {
    const { data: projects, isLoading: isFetchingProjects, error: fetchProjectsError, refetch } = useFetchAllProjectsQuery();
    const { mutate: createProject, isPending: isCreatingProject, isError: isCreatingProjectError } = useCreateProject(
        { onSuccess: () => refetch() }
    );
    const { mutate: updateProject, isPending: isUpdatingProject, isError: isUpdatingProjectError } = useUpdateProject(
        { onSuccess: () => refetch() }
    );

    const handleCreateProjectSubmit = useCallback((project: Project) => {
        createProject(project);
    }, [createProject]);

    const handleUpdateProjectSubmit = useCallback((args: { id: string, project: Partial<Project> }) => {
        updateProject(args);
    }, [updateProject]);

    return {
        state: {
            projects,
            isFetchingProjects,
            fetchProjectsError,
            isCreatingProject,
            isCreatingProjectError,
            isUpdatingProject,
            isUpdatingProjectError
        },
        actions: {
            handleCreateProjectSubmit,
            handleUpdateProjectSubmit
        }
    }
}
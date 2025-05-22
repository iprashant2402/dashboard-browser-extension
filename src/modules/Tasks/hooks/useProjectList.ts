import { Project } from "../types/Project";
import { useCallback, useState } from "react";
import { useFetchAllProjectsQuery } from "./useFetchAllProjectsQuery";
import { useCreateProject, useUpdateProject } from "./useCreateProject";
import { useDeleteProject } from "./useDeleteProject";
import { useNavigate } from "react-router";

export const useProjectList = () => {
    const [isCreateProjectDialogOpen, setIsCreateProjectDialogOpen] = useState(false);
    const navigate = useNavigate();
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
        setIsCreateProjectDialogOpen(false);
    }, [createProject, setIsCreateProjectDialogOpen]);

    const handleUpdateProjectSubmit = useCallback((args: { id: string, project: Partial<Project> }) => {
        updateProject(args);
    }, [updateProject]);

    const handleDeleteProject = useCallback((id: string) => {
        deleteProject(id);
    }, [deleteProject]);

    const handleRenameProject = useCallback((id: string, name: string) => {
        updateProject({ id, project: { name } });
    }, [updateProject]);

    const handleProjectClick = useCallback((id: string) => {
            navigate(`/task-board/${id}`);
    }, [navigate]);

    const handleOpenCreateProjectDialog = useCallback(() => {
        setIsCreateProjectDialogOpen(true);
    }, [setIsCreateProjectDialogOpen]);

    const handleCloseCreateProjectDialog = useCallback(() => {
        setIsCreateProjectDialogOpen(false);
    }, [setIsCreateProjectDialogOpen]);

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
            isDeletingProjectError,
            isCreateProjectDialogOpen
        },
        actions: {
            handleCreateProjectSubmit,
            handleUpdateProjectSubmit,
            handleDeleteProject,
            handleRenameProject,
            handleProjectClick,
            handleOpenCreateProjectDialog,
            handleCloseCreateProjectDialog
        }
    }
}
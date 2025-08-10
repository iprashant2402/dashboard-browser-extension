import { useCallback, useMemo } from "react";
import { expandToFullscreen } from "../../../utils/helpers";
import { useNavigate, useParams } from "react-router";
import { useFetchProjectDetailsQuery } from "./useFetchAllProjectsQuery";
import { useFetchAllTasks } from "./useFetchAllTasks";

export const useTaskBoardView = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const { 
        data: project, 
        isLoading: isLoadingProject, 
        isError: isErrorProject
    } = useFetchProjectDetailsQuery(id);

    const { 
        data: tasks, 
        isLoading: isLoadingTasks, 
        isError: isErrorTasks 
    } = useFetchAllTasks(id);

    const { columns } = useMemo(() => {
        return {
            columns: project?.allowed_columns || []
        };
    }, [project]);

    const createNewTask = () => {
        console.log('create new task');
    };

    const handleViewFullBoard = useCallback(() => {

    }, []);

    const handleExpandToFullscreen = useCallback(() => {
        expandToFullscreen('.task-board-view');
    }, []);

    const handleClose = useCallback(() => {
        navigate(-1);
    }, [navigate]);

    return {
        state: {
            projectId: id,
            project,
            isLoadingProject,
            isErrorProject,
            columns,
            tasks: tasks || [],
            isLoadingTasks,
            isErrorTasks
        },
        actions: {
            handleViewFullBoard,
            handleExpandToFullscreen,
            handleClose,
            createNewTask,
        }
    }
}
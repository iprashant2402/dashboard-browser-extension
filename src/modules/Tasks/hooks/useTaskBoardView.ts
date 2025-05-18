import { useCallback } from "react";
import { expandToFullscreen } from "../../../utils/helpers";
import { useNavigate, useParams } from "react-router";

export const useTaskBoardView = () => {    
    const navigate = useNavigate();
    const { id } = useParams();
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
    }, []);

    return {
        state: {
            projectId: id,
        },
        actions: {
            handleViewFullBoard,
            handleExpandToFullscreen,
            handleClose,
            createNewTask,
        }
    }
}
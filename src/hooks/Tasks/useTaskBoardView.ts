import { useCallback, useState } from "react";
import { expandToFullscreen } from "../../utils/helpers";
import { useCreateTask } from "./useCreateTask";

export const useTaskBoardView = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    
    const createNewTask = useCreateTask();

    const handleViewFullBoard = useCallback(() => {
        setIsExpanded(true);
    }, []);

    const handleExpandToFullscreen = useCallback(() => {
            expandToFullscreen('.task-board-view');
    }, []);

    const handleClose = useCallback(() => {
        setIsExpanded(false);
    }, []);

    return {
        state: {
            isExpanded,
        },
        actions: {
            handleViewFullBoard,
            handleExpandToFullscreen,
            handleClose,
            createNewTask,
        }
    }
}
import { IoClose, IoExpand } from 'react-icons/io5';
import './index.css';
import { AnimatePresence, motion } from 'motion/react';
import { useTaskBoardView } from '../../hooks/Tasks/useTaskBoardView';
import { TaskStatusSection } from './TaskStatusSection';

export const TaskBoardView = () => {
    const { state, actions } = useTaskBoardView();

    return (
        <div className="task-board-container">
                <div
                    className="task-board-summary task-board-bg"
                    onClick={actions.handleViewFullBoard}
                >
                    <h3>Tasks</h3>
                    <p>View all your tasks here</p>
                </div>
            
            <AnimatePresence>
                {state.isExpanded && (
                    <motion.div
                        className="task-board-view task-board-bg"
                        initial={{
                            scale: 0.2,
                        }}
                        animate={{
                            scale: 1,
                        }}
                        exit={{
                            scale: 0.2,
                        }}
                        transition={{
                            duration: 0.1,
                            type: "spring",
                            damping: 24,
                            stiffness: 300
                        }}
                    >

                        <>
                            <div className="row jt-space-between ai-center">
                                <div className="row ai-center">
                                    <button title='Switch to fullscreen' className="btn btn-clear txt-underline expand-btn" onClick={actions.handleExpandToFullscreen}><IoExpand size={16} /></button>
                                    <button title='Close' className="btn btn-clear txt-underline close-btn" onClick={actions.handleClose}><IoClose size={20} /></button>
                                </div>
                            </div>
                            <div className="task-board-view-row">
                                <TaskStatusSection title="To do" />
                                <TaskStatusSection title="In progress" />
                                <TaskStatusSection title="Done" />
                            </div>
                        </>

                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
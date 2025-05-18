import { IoClose, IoExpand } from 'react-icons/io5';
import './index.css';
import { useTaskBoardView } from '../../modules/Tasks/hooks/useTaskBoardView';
import { TaskStatusSection } from './TaskStatusSection';

export const TaskBoardView = () => {
    const { state, actions } = useTaskBoardView();

    return (
        <div className="task-board-view-container">
            <div className="row jt-space-between ai-center">
                <h4 className="task-board-view-title"><i>Personal</i></h4>
                <div className="row ai-center jt-end">
                    <button title='Switch to fullscreen' className="btn btn-clear txt-underline expand-btn" onClick={actions.handleExpandToFullscreen}><IoExpand size={16} /></button>
                    <button title='Close' className="btn btn-clear txt-underline close-btn" onClick={actions.handleClose}><IoClose size={20} /></button>
                </div>
            </div>
            <div className="task-board-view">
                    <div className="task-board-view-row">
                        <TaskStatusSection title="To do" />
                        <TaskStatusSection title="In progress" />
                        <TaskStatusSection title="In review" />
                        <TaskStatusSection title="Done" />
                    </div>
            </div>
        </div>
    );
}
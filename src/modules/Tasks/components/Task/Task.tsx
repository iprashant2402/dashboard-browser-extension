import './Task.css';
import { Task as TaskType } from '../../types/Task';

export const Task = ({ task }: { task: TaskType }) => {
    return (
        <div className="taskContainer" draggable>
            <div className='row task-header'>
                <h5 contentEditable="true" data-placeholder="Enter your task">
                    {task.title}
                </h5>
            </div>
            <div className='row task-footer'>
                <p contentEditable="true" data-placeholder="Describe your task">
                    {task.description}
                </p>
            </div>
        </div>
    )
}

export default Task;
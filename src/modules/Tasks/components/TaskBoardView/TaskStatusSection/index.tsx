import "./index.css";
import { Task } from "../../Task/Task";
import { TaskStatusMetadata } from "../../../types/Task";
import { Task as TaskType } from "../../../types/Task";
export const TaskStatusSection = ({ 
    metadata,
    tasks
 }: { metadata: TaskStatusMetadata, tasks: TaskType[] }) => {
    return <div className="task-status-section">
        <h4 className="task-status-section-title">{metadata.name}</h4>
        <div className="task-status-section-tasks">
            {tasks.map((task) => (
                <Task key={task.id} task={task} />
            ))}
            {metadata.order === 0 && <button className="task-status-section-add-task">Add task</button>}
        </div>
    </div>;
}
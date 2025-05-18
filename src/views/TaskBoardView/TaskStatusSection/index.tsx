import "./index.css";
import { Task } from "../../../modules/Tasks/components/Task/Task";

export const TaskStatusSection = ({ title }: { title: string }) => {
    return <div className="task-status-section">
        <h4 className="task-status-section-title">{title}</h4>
        <div className="task-status-section-tasks">
            <Task />
        </div>
    </div>;
}
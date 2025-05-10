import { Task } from "../../../components/Task/Task";
import "./index.css";

export const TaskStatusSection = ({ title }: { title: string }) => {
    return <div className="task-status-section">
        <h3>{title}</h3>
        <div className="task-status-section-tasks">
            <Task />
            <Task />
            <Task />
            <Task />
            <Task />
            <Task />
            <Task />
            <Task />
        </div>
    </div>;
}
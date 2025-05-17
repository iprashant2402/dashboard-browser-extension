import { ProjectList } from "../../modules/Tasks/components/ProjectList/ProjectList";
import "./index.css";

export const ProjectListPanel = () => {
    return (
        <div className="project-list">
            <div className="project-list-header">
                <h1 className="project-list-title">Task <span>Boards</span></h1>
                <p className="project-list-description">List of all your projects</p>
            </div>
            <div className="project-list-container">
                <ProjectList />
            </div>
        </div>
    )
}
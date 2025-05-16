import { useProjectList } from "../../hooks/useProjectList";
import "./ProjectList.css";
import { CreateProjectForm } from "../CreateProjectForm/CreateProjectForm";
import { ProjectListItem } from "../ProjectListItem/ProjectListItem";

export const ProjectList = () => {
    const { state, actions } = useProjectList();
    
    return <div className="project-list-container">
        <div className="project-list-items">
            {state.projects?.map((project) => <ProjectListItem key={project.id} project={project} />)}
        </div>
        <div className="row jt-center project-list-footer">
            <CreateProjectForm onSubmit={actions.handleCreateProjectSubmit} />
        </div>
    </div>
}
import { useProjectList } from "../../hooks/useProjectList";
import "./ProjectList.css";
import { CreateProjectForm } from "../CreateProjectForm/CreateProjectForm";
import { ProjectListItem } from "../ProjectListItem/ProjectListItem";

export const ProjectList = () => {
    const { state, actions } = useProjectList();

    return <div className="project-list">
        <div className="project-list-header">
            <h1 className="project-list-title">Task <span>Boards</span></h1>
            <p className="project-list-description">List of all your projects</p>
        </div>
        <div className="project-list-container">
            <div className="project-list-items">
                {state.projects?.map((project) => <ProjectListItem 
                    key={project.id} 
                    project={project} 
                    handleRename={actions.handleRenameProject}
                    handleDelete={actions.handleDeleteProject}
                />)}
            </div>
        </div>
        <div className="row jt-center project-list-footer">
                <CreateProjectForm onSubmit={actions.handleCreateProjectSubmit} />
        </div>
    </div>
}
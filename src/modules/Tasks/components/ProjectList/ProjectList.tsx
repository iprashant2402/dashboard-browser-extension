import { useProjectList } from "../../hooks/useProjectList";
import "./ProjectList.css";
import { CreateProjectForm } from "../CreateProjectForm/CreateProjectForm";
import { ProjectListItem } from "../ProjectListItem/ProjectListItem";
import { getRandomTaskQuote } from "../../../../utils/quotes";
import { useMemo } from "react";
import { Dialog } from "../../../../components/Dialog";
import { IoAddCircle } from "react-icons/io5";
import { Button } from "../../../../components/Button";

export const ProjectList = () => {
    const { state, actions } = useProjectList();

    const quote = useMemo(() => getRandomTaskQuote(), []);

    return <>
    <div className="project-list">
        <div className="project-list-header">
            <div className="row jt-space-between ai-center">
                <div>
                    <h1 className="project-list-title">Task <span>Boards</span></h1>
                    <p className="project-list-description">{quote}</p>
                </div>
                <div>
                    <Button variant="clear" icon={<IoAddCircle size={24} />} onClick={actions.handleOpenCreateProjectDialog} />
                </div>
            </div>
        </div>
        <div className="project-list-container">
            <div className="project-list-items">
                {state.projects?.map((project) => <ProjectListItem 
                    key={project.id} 
                    project={project} 
                    handleClick={actions.handleProjectClick}
                    handleRename={actions.handleRenameProject}
                    handleDelete={actions.handleDeleteProject}
                />)}
            </div>
        </div>
    </div>
    <Dialog 
        isOpen={state.isCreateProjectDialogOpen} 
        onClose={actions.handleCloseCreateProjectDialog}
        title="Create a new board"
      >
         <CreateProjectForm onSubmit={actions.handleCreateProjectSubmit} />
      </Dialog>
    </>
}
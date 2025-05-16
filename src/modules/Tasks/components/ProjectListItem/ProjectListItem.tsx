import { IoEllipsisHorizontal } from "react-icons/io5";
import { Project } from "../../types/Project"
import "./ProjectListItem.css";
export const ProjectListItem = (props: { project: Project }) => {
    return <div className="project-list-item">
        <div className="row jt-space-between">
            <h4>{props.project.name}</h4>
            <IoEllipsisHorizontal className="project-list-item-settings-cta" />
        </div>
    </div>
}
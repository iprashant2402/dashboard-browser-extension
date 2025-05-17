import { IoEllipsisHorizontal, IoPencil, IoTrashBin } from "react-icons/io5";
import { Project } from "../../types/Project"
import "./ProjectListItem.css";
import { Button } from "../../../../components/Button";
import { useEffect, useState } from "react";

export const ProjectListItem = (props: { project: Project }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const openMenu = () => {
        setIsMenuOpen(true);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    return <div className="project-list-item">
        <div className="row jt-space-between">
            <h4>{props.project.name}</h4>
            <IoEllipsisHorizontal onClick={openMenu} className="project-list-item-settings-cta" />
            {isMenuOpen && <ProjectItemMenu handleClose={closeMenu} />}
        </div>
    </div>
}

const ProjectItemMenu = (props: { handleClose: () => void }) => {

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const menu = document.querySelector('.project-list-item-menu');
            if (menu && !menu.contains(event.target as Node)) {
                props.handleClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [props.handleClose]);

    return <div className="project-list-item-menu">
        <ul>
            <li>
                <Button variant="clear" label="Rename" icon={<IoPencil size={16} />} />
            </li>
            <li>
                <Button variant="clear" label="Delete" icon={<IoTrashBin size={16} />} />
            </li>
        </ul>
    </div>
}
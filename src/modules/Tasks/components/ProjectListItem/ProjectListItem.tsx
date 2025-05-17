import { IoEllipsisHorizontal, IoPencil, IoTrashBin } from "react-icons/io5";
import { Project } from "../../types/Project"
import "./ProjectListItem.css";
import { Button } from "../../../../components/Button";
import { useEffect, useRef, useState } from "react";

export const ProjectListItem = (props: { 
    project: Project,
    handleRename: (id: string, name: string) => void,
    handleDelete: (id: string) => void,
}) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isRenaming, setIsRenaming] = useState(false);
    const nameRef = useRef<HTMLHeadingElement>(null);

    useEffect(() => {
        if (isRenaming) {
            setIsMenuOpen(false);
            if(!nameRef.current) return;
            nameRef.current.focus();
            window.getSelection()?.selectAllChildren(nameRef.current);
        }
    }, [isRenaming]);

    useEffect(() => {
        if(!nameRef.current) return;
        const onBlur = () => {
            setIsRenaming(false);
            if (!nameRef.current) return;
            console.log('nameRef.current.innerText', nameRef.current.innerText);
            if (nameRef.current.innerText?.length > 0) props.handleRename(props.project.id, nameRef.current.innerText);
            else nameRef.current.innerText = props.project.name;
            nameRef.current?.removeEventListener('blur', onBlur);
        }

        nameRef.current.addEventListener('blur', onBlur);
        return () => {
            nameRef.current?.removeEventListener('blur', onBlur);
        }
    }, [])

    const handleDelete = () => {
        props.handleDelete(props.project.id);
    }

    const openMenu = () => {
        setIsMenuOpen(true);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    return <div className="project-list-item">
        <div className="row jt-space-between">
            <h4 contentEditable={isRenaming ? 'plaintext-only' : 'false'} ref={nameRef} id="project-list-item-name">{props.project.name}</h4>
            <IoEllipsisHorizontal onClick={openMenu} className="project-list-item-settings-cta" />
            {isMenuOpen && <ProjectItemMenu handleClose={closeMenu} handleRename={setIsRenaming.bind(null, true)} handleDelete={handleDelete} />}
        </div>
    </div>
}

const ProjectItemMenu = (props: { 
    handleClose: () => void,
    handleRename: () => void,
    handleDelete: () => void,
}) => {

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
                <Button variant="clear" label="Rename" onClick={props.handleRename} icon={<IoPencil size={16} />} />
            </li>
            <li>
                <Button variant="clear" label="Delete" onClick={props.handleDelete} icon={<IoTrashBin size={16} />} />
            </li>
        </ul>
    </div>
}
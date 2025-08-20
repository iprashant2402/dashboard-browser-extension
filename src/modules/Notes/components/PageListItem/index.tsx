import { IoEllipsisHorizontal, IoPencil, IoTrash } from "react-icons/io5";
import './index.css';
import { Page } from "../../types/Page";
import { Button } from "../../../../components/Button";
import { useCallback, useEffect, useRef, useState } from "react";
import { IoIosPaper } from "react-icons/io";

interface PageListItemProps { 
    page: Page, 
    order: number,
    handleClick: (id: string) => void, 
    handleRename: (id: string, pageTitle: string) => void, 
    handleDelete: (id: string) => void, isActive: boolean,
}

export const PageListItem = ({ 
    page, 
    order,
    handleClick, 
    handleRename, 
    handleDelete, 
    isActive,
}: PageListItemProps) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isRenaming, setIsRenaming] = useState(false);
    const nameRef = useRef<HTMLHeadingElement>(null);

    const onBlur = useCallback(() => {
        setIsRenaming(false);
        if (!nameRef.current) return;
        const textContent = nameRef.current.textContent;
        if (textContent && textContent.length > 0) handleRename(page.id, textContent);
        else nameRef.current.innerText = page.title;
        nameRef.current?.removeEventListener('blur', onBlur);
    }, [page.id, page.title, handleRename]);

    useEffect(() => {
        if (isRenaming) {
            setIsMenuOpen(false);
            if (!nameRef.current) return;
            nameRef.current.addEventListener('blur', onBlur);
            nameRef.current.focus();
            window.getSelection()?.selectAllChildren(nameRef.current);
        }
    }, [isRenaming, onBlur]);

    const handleDeletePage = () => {
        handleDelete(page.id);
    }

    const openMenu = () => {
        setIsMenuOpen(true);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    return <div title={page.title} id={`page-${order}`} className={`page-list-item ${isActive ? 'page-list-item-active' : ''}`} onDoubleClick={() => setIsRenaming(true)} onClick={() => handleClick(page.id)}>
        <div className="row jt-space-between">
            <div className="row item-title-container">
                <span><IoIosPaper size={14} color="var(--muted-text-color)" /></span>
                <div className="item-title">
                <h4 contentEditable={isRenaming ? 'plaintext-only' : 'false'} ref={nameRef} id="page-list-item-name">{page.title || "Untitled"}</h4>
                </div>
            </div>
            <IoEllipsisHorizontal onClick={openMenu} className="page-list-item-settings-cta" />
            {isMenuOpen && <PageItemMenu handleClose={closeMenu} handleRename={setIsRenaming.bind(null, true)} handleDelete={handleDeletePage} />}
        </div>
    </div>;
};

const PageItemMenu = (props: {
    handleClose: () => void,
    handleRename: () => void,
    handleDelete: () => void,
}) => {

    const { handleClose, handleRename, handleDelete } = props;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const menu = document.querySelector('.page-list-item-menu');
            if (menu && !menu.contains(event.target as Node)) {
                handleClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [handleClose]);

    return <div className="page-list-item-menu">
        <ul>
            <li>
                <Button variant="clear" label="Rename" onClick={handleRename} icon={<IoPencil size={16} />} />
            </li>
            <li>
                <Button variant="clear" label="Delete" onClick={handleDelete} icon={<IoTrash size={16} />} />
            </li>
        </ul>
    </div>;
};
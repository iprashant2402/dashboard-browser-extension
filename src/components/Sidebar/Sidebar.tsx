import React, { useState, useRef, useCallback, useEffect } from 'react';
import './Sidebar.css';
import { MdViewSidebar } from 'react-icons/md';

interface SidebarProps {
    children?: React.ReactNode;
    header?: React.ReactNode;
    defaultWidth?: number;
    minWidth?: number;
    maxWidth?: number;
    defaultCollapsed?: boolean;
    onWidthChange?: (width: number) => void;
    onPositionChange?: (position: 'left' | 'right') => void;
    onCollapseChange?: (collapsed: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
    children,
    defaultWidth = 220,
    minWidth = 200,
    maxWidth = 500,
    defaultCollapsed = false,
    onWidthChange,
    onCollapseChange,
    header,
}) => {
    const [width, setWidth] = useState(defaultWidth);
    const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
    const [isResizing, setIsResizing] = useState(false);
    
    const sidebarRef = useRef<HTMLDivElement>(null);
    const resizeHandleRef = useRef<HTMLDivElement>(null);

    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        setIsResizing(true);
    }, []);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!isResizing || !sidebarRef.current) return;

        const sidebarRect = sidebarRef.current.getBoundingClientRect();
        let newWidth;

        newWidth = e.clientX - sidebarRect.left;

        newWidth = Math.max(minWidth, Math.min(maxWidth, newWidth));
        setWidth(newWidth);
        onWidthChange?.(newWidth);
    }, [isResizing, minWidth, maxWidth, onWidthChange]);

    const handleMouseUp = useCallback(() => {
        setIsResizing(false);
    }, []);

    useEffect(() => {
        if (isResizing) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = 'col-resize';
            document.body.style.userSelect = 'none';
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        };
    }, [isResizing, handleMouseMove, handleMouseUp]);

    const toggleCollapse = () => {
        const newCollapsed = !isCollapsed;
        setIsCollapsed(newCollapsed);
        onCollapseChange?.(newCollapsed);
    };

    return (
        <div
            ref={sidebarRef}
            className={`sidebar sidebar--left ${isCollapsed ? 'sidebar--collapsed' : ''}`}
            style={{
                width: isCollapsed ? 'auto' : `${width}px`,
                flexShrink: 0
            }}
        >
            <div className="sidebar__header">
            {!isCollapsed && header}
                <button 
                    className="sidebar__toggle btn btn-clear"
                    onClick={toggleCollapse}
                    title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                >
                    <MdViewSidebar />
                </button>
            </div>
            
            {!isCollapsed && (
                <>
                    <div className="sidebar__content">
                        {children}
                    </div>
                    
                    <div
                        ref={resizeHandleRef}
                        className={`sidebar__resize-handle sidebar__resize-handle--left`}
                        onMouseDown={handleMouseDown}
                        title="Drag to resize"
                    />
                </>
            )}
        </div>
    );
};
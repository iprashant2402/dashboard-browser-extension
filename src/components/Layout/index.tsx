import React from 'react';
import './index.css';

interface LayoutProps {
    children?: React.ReactNode;
    className?: string;
    sidebar?: React.ReactNode;
    sidebarPosition?: 'left' | 'right';
    sidebarCollapsed?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ 
    children, 
    className, 
    sidebar, 
    sidebarPosition = 'left',
    sidebarCollapsed = false
}) => {
    const layoutClasses = [
        'layout',
        sidebar ? 'layout--with-sidebar' : '',
        sidebar && sidebarPosition === 'right' ? 'layout--sidebar-right' : '',
        sidebar && sidebarCollapsed ? 'layout--sidebar-collapsed' : '',
        className,
    ].filter(Boolean).join(' ');

    return (
        <div className={layoutClasses}>
            {sidebar && sidebarPosition === 'left' && sidebar}
            <div className="layout__content">
                {children}
            </div>
            {sidebar && sidebarPosition === 'right' && sidebar}
        </div>
    );
};
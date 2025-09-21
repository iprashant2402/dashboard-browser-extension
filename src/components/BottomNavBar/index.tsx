import React from 'react';
import './index.css';
import { useLocation, useNavigate } from 'react-router';

export interface TabItem {
  label: string;
  icon: React.ReactNode;
  path: string;
}

export interface BottomTabBarProps {
  tabs: TabItem[];
  className?: string;
}

export const BottomTabBar: React.FC<BottomTabBarProps> = ({ tabs, className }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleTabClick = (path: string) => {
    navigate(path);
  };

  return (
    <div className={`bottom-tab-bar ${className || ''}`}>
      <div className="tab-bar-content">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;
          
          return (
            <button
              key={tab.path}
              className={`tab-item ${isActive ? 'active' : ''}`}
              onClick={() => handleTabClick(tab.path)}
              aria-label={tab.label}
            >
              <div className="tab-icon-wrapper">
                <div className="tab-icon">
                  {tab.icon}
                </div>
                {isActive && <div className="tab-indicator" />}
              </div>
              <span className="tab-label">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
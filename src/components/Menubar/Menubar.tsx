import './Menubar.css';
import SettingsIcon from '../../assets/icons/settings-outline.svg?react';

export const Menubar = () => {
    return (
        <div className="menubar">
            <div className="menu-item">
                <SettingsIcon width={20} height={20} />
            </div>
        </div>
    )
}
import { useMemo } from "react";
import { User } from "../../Auth/types/User";
import './UserInfoCard.css';
import { IoSettingsOutline } from "react-icons/io5";

export const UserInfoCard = ({ user, onClick }: { user: User | undefined, onClick: () => void }) => {
    const userInitials = useMemo(() => {
        if (!user) return '';
        if (!user.firstName || !user.lastName) return `${user.email.charAt(0)}`;
        return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
      }, [user]);
      
    return (
        <div className="user-info-card" onClick={onClick}>
                {user ? (
                    <div className="user-info-card-header">
                        <div className="user-avatar">
                            {userInitials}
                        </div>
                            <h4 className="user-info-card-email">{user.email}</h4>
                    </div>
                ) : (
                    <div className="user-info-card-header">
                        <IoSettingsOutline size={16} />
                        <h4>Settings</h4>
                    </div>
            )}
        </div>
    );
}
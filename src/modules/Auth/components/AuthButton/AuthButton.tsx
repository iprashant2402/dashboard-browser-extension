import React, { useState } from 'react';
import { IoPersonCircleOutline } from 'react-icons/io5';
import { Button } from '../../../../components/Button';
import { AuthDialog } from '../AuthDialog/AuthDialog';
import { useAuth } from '../../hooks/useAuth';
import './AuthButton.css';

export const AuthButton: React.FC = () => {
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const { user, isAuthenticated, isLoadingUser } = useAuth();

  const handleAuthButtonClick = () => {
    setIsAuthDialogOpen(true);
  };

  const handleAuthDialogClose = () => {
    setIsAuthDialogOpen(false);
  };

  const getButtonContent = () => {
    if (isLoadingUser) {
      return (
        <div className="auth-button-loading">
          <div className="auth-button-loading-dot"></div>
          <div className="auth-button-loading-dot"></div>
          <div className="auth-button-loading-dot"></div>
        </div>
      );
    }

    return <IoPersonCircleOutline size={16} />;
  };

  const getTooltip = () => {
    if (isLoadingUser) return 'Loading...';
    if (isAuthenticated && user) return `${user.email}`;
    return 'Sign in to your account';
  };

  return (
    <>
      <Button 
        title={getTooltip()}
        variant="clear" 
        onClick={handleAuthButtonClick}
        label={getButtonContent()}
       />
      
      <AuthDialog 
        isOpen={isAuthDialogOpen} 
        onClose={handleAuthDialogClose} 
      />
    </>
  );
}; 
import React, { useMemo, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import './AuthDialog.css';
import { AuthSignup } from './AuthSignup';
import { AuthLogin } from './AuthLogin';
import { Button } from '../../../../components/Button';
import { AnalyticsTracker } from '../../../../analytics/AnalyticsTracker';

export type AuthFormMode = 'login' | 'signup';

export const AuthMenuContent: React.FC = () => {
  const { 
    user, 
    isAuthenticated, 
    login, 
    signup, 
    logout,
    isLoggingIn, 
    isSigningUp,
    isLoggingOut,
    loginError, 
    signupError,
    resetLoginError,
    resetSignupError,
  } = useAuth();

  const [authMode, setAuthMode] = useState<AuthFormMode>('login');
  const [formData, setFormData] = useState({
    firstName: undefined,
    lastName: undefined,
    email: '',
    password: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (authMode === 'login') {
        await login({
          email: formData.email,
          password: formData.password,
        });
      } else {
        await signup({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
        });
      }
      setFormData({ firstName: undefined, lastName: undefined, email: '', password: '' });
    } catch (error) {
      // Error handled by the hook
      console.error('Auth error:', error);
    }
  };

  const handleModeSwitch = (mode: AuthFormMode) => {
    const event = mode === 'login' ? 'Login - Click' : 'Signup - Click';
    AnalyticsTracker.track(event);
    setAuthMode(mode);
    resetLoginError();
    resetSignupError();
    setFormData({ firstName: undefined, lastName: undefined, email: '', password: '' });
  };

  const handleLogout = async () => {
    AnalyticsTracker.track('Logout - Click');
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getErrorMessage = useMemo(() => {
    const error = authMode === 'login' ? loginError : signupError;
    if (!error) return null;
    
    if (typeof error === 'object' && error !== null && 'message' in error) {
      if (error.message === 'EMAIL_ALREADY_EXISTS') return 'Email already exists';
      if (error.message === 'INVALID_CREDENTIALS') return 'Please check your email and password';
      if (error.message === 'USER_NOT_FOUND') return 'Please check your email and password';
      return 'Oops! Something went wrong.';
    }
    return 'Oops! Something went wrong.';
  }, [authMode, loginError, signupError]);

  const userInitials = useMemo(() => {
    if (!user) return '';
    if (!user.firstName || !user.lastName) return `${user.email.charAt(0)}`;
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
  }, [user]);

  const isLoading = isLoggingIn || isSigningUp || isLoggingOut;

  return (
      <div className="auth-dialog-content">
        {isAuthenticated && user ? (
          // User is logged in - show profile
          <div className="user-profile">
            <div className="user-profile-header">
              <div className="user-avatar">
                {userInitials}
              </div>
              <div className="user-info">
                {(user.firstName || user.lastName) && <h3>{user.firstName ?? ''} {user.lastName ?? ''}</h3>}
                <p>{user.email}</p>
              </div>
            </div>

            <div className="user-profile-actions">
              <Button
                variant='clear' 
                label={isLoggingOut ? 'Signing out...' : 'Sign Out'}
                onClick={handleLogout}
                className='logout-button'
                disabled={isLoading}
              />
            </div>
          </div>
        ) : (
          // User is not logged in - show auth forms
          <>
            {authMode === 'login' ? <AuthLogin 
              errorMessage={getErrorMessage}
              emailValue={formData.email}
              passwordValue={formData.password}
              handleSubmit={handleSubmit}
              isLoading={isLoading}
              handleInputChange={handleInputChange}
              handleModeSwitch={handleModeSwitch}
            /> : <AuthSignup 
              errorMessage={getErrorMessage}
              emailValue={formData.email}
              passwordValue={formData.password}
              handleSubmit={handleSubmit}
              isLoading={isLoading}
              handleInputChange={handleInputChange}
              handleModeSwitch={handleModeSwitch}
            />}
          </>
        )}
      </div>
  );
}; 
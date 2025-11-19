import React, { useMemo, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import './AuthDialog.css';
import { AuthSignup } from './AuthSignup';
import { AuthLogin } from './AuthLogin';
import { AnalyticsTracker } from '../../../../analytics/AnalyticsTracker';
import { GoogleSigninButton } from '../GoogleSigninButton';

export type AuthFormMode = 'login' | 'signup';

export const AuthMenuContent: React.FC = () => {
  const { 
    login, 
    googleAuth,
    signup,
    isLoggingIn, 
    isSigningUp,
    isLoggingOut,
    loginError, 
    loginWithGoogleError,
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

  const getErrorMessage = useMemo(() => {
    let error = authMode === 'login' ? loginError : signupError;
    if (loginWithGoogleError) error = loginWithGoogleError;
    if (!error) return null;
    
    if (typeof error === 'object' && error !== null && 'message' in error) {
      if (error.message === 'EMAIL_ALREADY_EXISTS') return 'Email already exists';
      if (error.message === 'INVALID_CREDENTIALS') return 'Please check your email and password';
      if (error.message === 'USER_NOT_FOUND') return 'Please check your email and password';
      return 'Oops! Something went wrong.';
    }
    return 'Oops! Something went wrong.';
  }, [authMode, loginError, signupError, loginWithGoogleError]);

  const isLoading = isLoggingIn || isSigningUp || isLoggingOut;

  return (
      <div className="auth-dialog-content">
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
            <hr />
            <p className='continue-with-text'>or continue with</p>
            <GoogleSigninButton
              onAuthResponse={googleAuth}
            />
      </div>
  );
}; 
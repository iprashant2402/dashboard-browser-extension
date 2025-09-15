import { Button } from "../../../../components/Button";
import { AuthFormMode } from "./AuthMenuContent";
import WelcomeHand from '../../../../assets/images/ImageWelcomeHand.svg?react';

export const AuthLogin = (props: {
    errorMessage: string | null,
    emailValue?: string,
    passwordValue?: string,
    handleSubmit: (e: React.FormEvent) => void,
    isLoading: boolean,
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    handleModeSwitch: (mode: AuthFormMode) => void,
}) => {
    const { errorMessage, emailValue, passwordValue, handleSubmit, isLoading, handleInputChange, handleModeSwitch } = props;

    return (<div className="auth-login">
        {errorMessage && (
              <div className="auth-error">
                {errorMessage}
              </div>
            )}

            <div className="auth-login-title">
                <WelcomeHand height={50} width={50} />
                <div className="auth-login-title-text">
                    <h3>Glad to have you back!</h3>
                    <p>Sign in to your account to continue.</p>
                </div>
            </div>

            <div className="auth-form-wrapper">
            <form onSubmit={handleSubmit} className="auth-form">
              <div className="auth-form-group">
                <label htmlFor="email" hidden>Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={emailValue}
                  onChange={handleInputChange}
                  className="auth-form-input"
                  placeholder="Enter your email"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="auth-form-group">
                <label htmlFor="password" hidden>Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={passwordValue}
                  onChange={handleInputChange}
                  className="auth-form-input"
                  placeholder="Enter your password"
                  required
                  disabled={isLoading}
                  autoComplete="current-password"
                />
              </div>

              <div className="auth-form-actions">
                <Button
                  variant="primary"
                  type="submit"
                  label={isLoading ? 'Signing in...' : 'Sign In'}
                  disabled={isLoading}
                />
              </div>
            </form>
            </div>
        <div className="auth-form-toggle">
              <p>
                Don't have an account?
                <button
                  type="button"
                  onClick={() => handleModeSwitch('signup')}
                  disabled={isLoading}
                >
                 Create your account
                </button>
              </p>
            </div>
    </div>)
}
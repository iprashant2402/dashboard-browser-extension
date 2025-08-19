import { Button } from "../../../../components/Button";
import { AuthFormMode } from "./AuthDialog";
import WelcomeCat from '../../../../assets/images/ImageWelcomeCat.svg?react';

export const AuthSignup = (props: {
    errorMessage: string | null,
    emailValue?: string,
    passwordValue?: string,
    handleSubmit: (e: React.FormEvent) => void,
    isLoading: boolean,
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    handleModeSwitch: (mode: AuthFormMode) => void,
}) => {
    const { errorMessage, emailValue, passwordValue, handleSubmit, isLoading, handleInputChange, handleModeSwitch } = props;

    return (<div className="auth-signup">
        {errorMessage && (
              <div className="auth-error">
                {errorMessage}
              </div>
            )}

            <div className="auth-login-title">
                <WelcomeCat height={150} width={150} color="var(--layout-text-color)" />
                <div className="auth-login-title-text">
                    <h3>Create your account</h3>
                    <p>to sync your data across all your devices.</p>
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
                />
              </div>

              <div className="auth-form-actions">
                <Button
                  variant="primary"
                  type="submit"
                  label={isLoading ? 'Creating account...' : 'Create account'}
                  disabled={isLoading}
                />
              </div>
            </form>
            </div>
        <div className="auth-form-toggle">
              <p>
                Already have an account?
                <button
                  type="button"
                  onClick={() => handleModeSwitch('login')}
                  disabled={isLoading}
                >
                 Sign in
                </button>
              </p>
            </div>
    </div>)
}
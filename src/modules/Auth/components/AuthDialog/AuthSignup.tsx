import { AuthFormMode } from "./AuthDialog";

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

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="auth-form-group">
                <label htmlFor="email">Email</label>
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
                <label htmlFor="password">Password</label>
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
                <button 
                  type="submit" 
                  className="auth-form-submit"
                  disabled={isLoading}
                >
                  {isLoading 
                    ? ('Creating account...') 
                    : ('Create Account')
                  }
                </button>
              </div>
            </form>
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
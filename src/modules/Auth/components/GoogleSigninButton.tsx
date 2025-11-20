import { useCallback, useEffect } from "react";
import { getCurrentPlatform } from "../../../utils/helpers";
import { Button } from "../../../components/Button";
import { IoLogoGoogle } from "react-icons/io5";

export const GoogleSigninButton = (props: {
    onAuthResponse: ({ token }: { token: string | chrome.identity.GetAuthTokenResult }) => void;
    isLoading: boolean;
}) => {
    const { onAuthResponse, isLoading } = props;

    const platform = getCurrentPlatform();

    const handleGoogleAuthResponse = useCallback((event: CustomEvent<{ token: string }>) => {
        onAuthResponse({ token: event.detail.token });
    }, [onAuthResponse]);

    useEffect(() => {
        const renderButton = () => {
            const googleAuthButtonExtension = document.getElementById("google-auth-button-extension");
            switch (platform) {
                case 'EXTENSION':
                    googleAuthButtonExtension?.addEventListener('click', function () {
                        chrome.identity.getAuthToken({ interactive: true }, async function (token) {
                            if (chrome.runtime.lastError || !token) {
                                console.error(chrome.runtime.lastError);
                                return;
                            }
                            onAuthResponse({ token: token });
                        });
                    });
                    break;
                default:
                    window.google?.accounts.id.renderButton(
                        document.getElementById("google-auth-button") as HTMLElement,
                        { theme: "filled_blue", size: "large", text: "continue_with", shape: "pill" }  // customization attributes
                    );
                    break;
            }
        };

        renderButton();

        document.addEventListener('GOOGLE_SCRIPT_INITIALIZE', renderButton);
        return () => {
            document.removeEventListener('GOOGLE_SCRIPT_INITIALIZE', renderButton);
        }
    }, [onAuthResponse, platform])


    useEffect(() => {
        document.addEventListener('GOOGLE_AUTH_RESPONSE', handleGoogleAuthResponse as EventListener);
        return () => {
            document.removeEventListener('GOOGLE_AUTH_RESPONSE', handleGoogleAuthResponse as EventListener);
        }
    }, [handleGoogleAuthResponse])

    return (
        <div id="google-auth-button">
            {platform === 'EXTENSION' && <Button disabled={isLoading} id="google-auth-button-extension" icon={<IoLogoGoogle />} variant="primary" label='Continue with Google' />}
        </div>
    )
}
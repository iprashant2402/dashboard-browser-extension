import { useEffect } from "react";

export const GoogleSigninButton = (props: {
    onAuthResponse: ({token}: {token: string}) => void;
}) => {
    const { onAuthResponse } = props;

    useEffect(() => {
        const renderButton = () => {
            window.google?.accounts.id.renderButton(
                document.getElementById("google-auth-button") as HTMLElement,
                { theme: "filled_blue", size: "large", text: "continue_with", shape: "pill" }  // customization attributes
              );
        };

        renderButton();

        document.addEventListener('GOOGLE_SCRIPT_INITIALIZE', renderButton);
        return () => {
          document.removeEventListener('GOOGLE_SCRIPT_INITIALIZE', renderButton);
        }
      }, [])


      useEffect(() => {
        const handleGoogleAuthResponse = (event: CustomEvent<{ token: string }>) => {
            onAuthResponse({ token: event.detail.token });
        }
        document.addEventListener('GOOGLE_AUTH_RESPONSE', handleGoogleAuthResponse as EventListener);
        return () => {
          document.removeEventListener('GOOGLE_AUTH_RESPONSE', handleGoogleAuthResponse as EventListener);
        }
      }, [onAuthResponse]);

    return (
        <div id="google-auth-button"></div>
    )
}
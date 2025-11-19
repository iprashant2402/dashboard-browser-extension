/* eslint-disable @typescript-eslint/no-explicit-any */
/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />


declare global {
  interface Document {
    startViewTransition?: (callback: () => void) => {
      ready: Promise<void>;
      updateCallbackDone: Promise<void>;
      finished: Promise<void>;
    };
  }

  interface Window {
    google?: {
      accounts: {
        id: {
          renderButton: (element: HTMLElement, options: any) => void;
          initialize: (options: any) => void;
        };
      };
    };
  }

  interface CSSStyleDeclaration {
    viewTransitionName: string;
  }
}

export { }; 
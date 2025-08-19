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

  interface CSSStyleDeclaration {
    viewTransitionName: string;
  }
}

export { }; 
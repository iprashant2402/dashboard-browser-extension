/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'ion-icon': any;
    }
  }
}

export {}; 
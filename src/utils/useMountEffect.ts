import { useEffect, useRef } from "react";

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export const useMountEffect = (callback: Function) => {
    const isFirstMount = useRef(true);

    return useEffect(() => {
        if (!isFirstMount.current) return;
        isFirstMount.current = false;
        const cleanupFunction = callback();
        if (typeof cleanupFunction === 'function') {
            return cleanupFunction;
        }
    }, [callback]);
}
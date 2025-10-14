import { useMutation } from "@tanstack/react-query";
import { pagesSyncRepository } from "../api";
import { ACCESS_TOKEN_KEY } from "../utils/contants";

const makePagePublic = async (pageId: string) => {
    const isAuthenticated = !!localStorage.getItem(ACCESS_TOKEN_KEY);
    if (!isAuthenticated) return;
    const response = await pagesSyncRepository.makePagePublic(pageId);
    return response;
}

export const useMakePagePublic = (options?: { onSuccess?: () => void, onError?: (error: Error) => void }) => {
    return useMutation({
        mutationFn: (pageId: string) => makePagePublic(pageId),
        onSuccess: () => {
            options?.onSuccess?.();
        },
        onError: (error) => {
            options?.onError?.(error);
        },
    });
}
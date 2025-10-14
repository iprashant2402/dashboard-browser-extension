import { useNavigate, useParams } from "react-router";
import { useCallback, useEffect } from "react";
import { useToast } from "../../../components/Toast/ToastContainer";
import { useFetchPage } from "./useFetchPage";
import { useUpdatePage } from "./useUpdatePage";
import { useDeletePage } from "./useDeletePage";
import { AnalyticsTracker } from "../../../analytics/AnalyticsTracker";
import { useMakePagePublic } from "./useMakePagePublic";
import { useAuth } from "../../Auth";

export const usePageEditor = () => {
    const { id } = useParams();
    const { data: page, isLoading: isFetchingPage, isError: isPageFetchError, status: pageFetchStatus } = useFetchPage(id);
    const navigate = useNavigate();
    const { showToast } = useToast();
    const { user } = useAuth();

    useEffect(() => {
        if (!page) return;
        AnalyticsTracker.track('Page Editor - PV', {
            page_id: id,
            page_title: page?.title,
        });
    }, [id, page])

    const { mutateAsync: updatePage, isPending: isUpdatingPage, isError: isUpdatingPageError } = useUpdatePage();

    const { mutateAsync: deletePage, isPending: isDeletingPage, isError: isDeletingPageError } = useDeletePage();

    const { mutateAsync: makePagePublic, isPending: isPagePublishInProgress } = useMakePagePublic({
        onError: () => {
            showToast({
                type: "error",
                message: "Oops! Something went wrong. Failed to share page."
            });
        }
    });

    const handleDeletePage = useCallback(async (id: string) => {
        AnalyticsTracker.track('Delete page', {
            page_id: id,
            page_title: page?.title,
        });
        await deletePage(id);
        navigate("/");
        showToast({
            type: "success",
            message: "Page deleted successfully"
        });
    }, [deletePage, navigate, page?.title, showToast]);

    const sharePage = useCallback(async (id: string) => {
        const response = await makePagePublic(id);
        if (response?.isPublic) {
            await navigator.clipboard.writeText(`${window.location.origin}/view/page/` + id);
            showToast({
                type: "success",
                message: "Link copied"
            });
        }
    }, [makePagePublic, showToast]);

    const handleOnSavePage = useCallback(async (content: string) => {
        await updatePage({ id: id!, page: { content }, sync: false });
    }, [updatePage, id]);

    const handleOnSavePageTitle = useCallback(async (title: string) => {
        await updatePage({ id: id!, page: { title }, sync: true });
        showToast({
            type: "success",
            message: "Page title updated successfully"
        });
    }, [updatePage, showToast, id]);

    return {
        state: {
            id,
            page,
            isFetchingPage,
            isUpdatingPage,
            isDeletingPage,
            isPageFetchError,
            isUpdatingPageError,
            isDeletingPageError,
            pageFetchStatus,
            isPagePublishInProgress,
            isShareEnabled: !!user?.id
        },
        actions: {
            handleDeletePage,
            handleOnSavePage,
            handleOnSavePageTitle,
            sharePage,
        }
    }
}
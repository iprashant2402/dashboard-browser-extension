import { useNavigate, useParams } from "react-router";
import { useCallback } from "react";
import { useToast } from "../../../components/Toast/ToastContainer";
import { useFetchPage } from "./useFetchPage";
import { useUpdatePage } from "./useUpdatePage";
import { useDeletePage } from "./useDeletePage";

export const usePageEditor = () => {
    const { id } = useParams();
    const { data: page, isLoading: isFetchingPage, isError: isPageFetchError, status: pageFetchStatus } = useFetchPage(id);
    const navigate = useNavigate();
    const { showToast } = useToast();

    const { mutateAsync: updatePage, isPending: isUpdatingPage, isError: isUpdatingPageError } = useUpdatePage();

    const { mutateAsync: deletePage, isPending: isDeletingPage, isError: isDeletingPageError } = useDeletePage();

    const handleDeletePage = useCallback(async (id: string) => {
        await deletePage(id);
        navigate("/");
        showToast({
            type: "success",
            message: "Page deleted successfully"
        });
    }, [deletePage, navigate, showToast]);


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
            pageFetchStatus
        },
        actions: {
            handleDeletePage,
            handleOnSavePage,
            handleOnSavePageTitle
        }
    }
}
import { useNavigate, useParams } from "react-router";
import { useDeletePage, useFetchPage, useUpdatePage } from "./pageCrud";
import { useCallback } from "react";
import { useToast } from "../../../components/Toast/ToastContainer";

export const usePageEditor = () => {
    const { id } = useParams();
    const { data: page, refetch, isLoading: isFetchingPage, isError: isPageFetchError, status: pageFetchStatus } = useFetchPage(id);
    const navigate = useNavigate();
    const { showToast } = useToast();

    const { mutateAsync: updatePage, isPending: isUpdatingPage, isError: isUpdatingPageError } = useUpdatePage(
        { onSuccess: () => refetch() }
    );

    const { mutateAsync: deletePage, isPending: isDeletingPage, isError: isDeletingPageError } = useDeletePage(
        { onSuccess: () => refetch() }
    );

    const handleDeletePage = useCallback(async (id: string) => {
        await deletePage(id);
        navigate("/");
        showToast({
            type: "success",
            message: "Page deleted successfully"
        });
    }, [deletePage, navigate, showToast]);


    const handleOnSavePage = useCallback(async (content: string) => {
        await updatePage({ id: id!, page: { content } });
    }, [updatePage, id]);

    const handleOnSavePageTitle = useCallback(async (title: string) => {
        await updatePage({ id: id!, page: { title } });
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
import { useNavigate } from "react-router";
import { useFetchAllPages } from "./useFetchAllPages";
import { useCreatePage, useDeletePage, useUpdatePage } from "./pageCrud";
import { useCallback, useState } from "react";
import { Page } from "../types/Page";
import { v4 as uuidv4 } from 'uuid';
import { useToast } from "../../../components/Toast";

export const usePageList = () => {
    const [isCreatePageDialogOpen, setIsCreatePageDialogOpen] = useState(false);
    const { showToast } = useToast();

    const navigate = useNavigate();
    const { data: pages, isLoading: isFetchingPages, error: fetchPagesError, refetch } = useFetchAllPages();
    const { mutateAsync: createPage, isPending: isCreatingPage, isError: isCreatingPageError } = useCreatePage(
        { onSuccess: () => refetch() }
    );
    const { mutateAsync: updatePage, isPending: isUpdatingPage, isError: isUpdatingPageError } = useUpdatePage(
        { onSuccess: () => refetch() }
    );

    const { mutateAsync: deletePage, isPending: isDeletingPage, isError: isDeletingPageError } = useDeletePage(
        { onSuccess: () => refetch() }
    );

    const handlePageClick = useCallback((id: string) => {
        navigate(`/editor/${id}`);
    }, [navigate]);

    const handleCreatePageSubmit = useCallback(async () => {
        try {
            const page = {
                id: uuidv4(),
                title: "",
                content: "",
                createdAt: new Date(),
                updatedAt: new Date()
            };
            await createPage(page);
            showToast({
                type: "success",
                message: "Page created successfully"
            });
            setIsCreatePageDialogOpen(false);
            handlePageClick(page.id);
        } catch (error) {
            console.error(error);
            showToast({
                type: "error",
                message: "Oops! Something went wrong. Failed to create page."
            });
        }
    }, [createPage, setIsCreatePageDialogOpen, handlePageClick, showToast]);

    const handleUpdatePageSubmit = useCallback(async (args: { id: string, page: Partial<Page> }) => {
        await updatePage(args);
    }, [updatePage]);

    const handleRenamePage = useCallback(async (id: string, pageTitle: string) => {
        await updatePage({ id, page: { title: pageTitle } });
    }, [updatePage]);

    const handleDeletePage = useCallback(async (id: string) => {
        await deletePage(id);
        navigate("/");
    }, [deletePage, navigate]);

    const handleOpenCreatePageDialog = useCallback(() => {
        setIsCreatePageDialogOpen(true);
    }, [setIsCreatePageDialogOpen]);

    const handleCloseCreatePageDialog = useCallback(() => {
        setIsCreatePageDialogOpen(false);
    }, [setIsCreatePageDialogOpen]);

    return {
        state: {
            isCreatePageDialogOpen,
            isFetchingPages,
            isCreatingPage,
            isUpdatingPage,
            isDeletingPage,
            pages,
            fetchPagesError,
            isCreatingPageError,
            isUpdatingPageError,
            isDeletingPageError,
        },
        actions: {
            handleCreatePageSubmit,
            handleUpdatePageSubmit,
            handleDeletePage,
            handleOpenCreatePageDialog,
            handleCloseCreatePageDialog,
            handlePageClick,
            handleRenamePage
        }
    }
};
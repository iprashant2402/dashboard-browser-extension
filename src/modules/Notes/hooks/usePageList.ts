import { useLocation, useNavigate } from "react-router";
import { useFetchAllPages } from "./useFetchAllPages";
import { useCreatePage, useDeletePage, useUpdatePage } from "./pageCrud";
import { useCallback, useEffect, useState } from "react";
import { Page } from "../types/Page";
import { v4 as uuidv4 } from 'uuid';
import { useToast } from "../../../components/Toast";

export const usePageList = () => {
    const {pathname} = useLocation();
    const [isCreatePageDialogOpen, setIsCreatePageDialogOpen] = useState(false);
    const [currentPageId, setCurrentPageId] = useState<string | null>(null);
    const { showToast } = useToast();

    useEffect(() => {
        const pageId = pathname.split("/").pop();
        if (pageId) {
            setCurrentPageId(pageId);
        }
    }, [pathname])

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
            const createdAt = new Date();
            const newPage = {
                id: uuidv4(),
                title: "",
                content: "",
                createdAt,
                updatedAt: createdAt,
                order: createdAt.getTime(),
            };
            await createPage(newPage);
            showToast({
                type: "success",
                message: "Page created successfully"
            });
            setIsCreatePageDialogOpen(false);
            handlePageClick(newPage.id);
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

    const handleUpdatePageOrder = useCallback(async (id: string, order: number) => {
        await updatePage({ id, page: { order } });
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
            currentPageId
        },
        actions: {
            handleCreatePageSubmit,
            handleUpdatePageSubmit,
            handleDeletePage,
            handleOpenCreatePageDialog,
            handleCloseCreatePageDialog,
            handlePageClick,
            handleRenamePage,
            handleUpdatePageOrder
        }
    }
};
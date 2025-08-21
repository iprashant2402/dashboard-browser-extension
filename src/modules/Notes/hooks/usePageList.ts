import { useLocation, useNavigate } from "react-router";
import { useFetchAllPages } from "./useFetchAllPages";
import { useCreatePage } from "./useCreatePage";
import { useUpdatePage } from "./useUpdatePage";
import { useDeletePage } from "./useDeletePage";
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
    const { data: pages, isLoading: isFetchingPages, error: fetchPagesError } = useFetchAllPages();
    const { mutateAsync: createPage, isPending: isCreatingPage, isError: isCreatingPageError } = useCreatePage();
    const { mutateAsync: updatePage, isPending: isUpdatingPage, isError: isUpdatingPageError } = useUpdatePage();

    const { mutateAsync: deletePage, isPending: isDeletingPage, isError: isDeletingPageError } = useDeletePage();

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
                version: 0,
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
        console.log('handleUpdatePageSubmit', args);
        await updatePage({ ...args, sync: false });
    }, [updatePage]);

    const handleRenamePage = useCallback(async (id: string, pageTitle: string) => {
        console.log('handleRenamePage', id, pageTitle);
        await updatePage({ id, page: { title: pageTitle }, sync: true });
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
        }
    }
};
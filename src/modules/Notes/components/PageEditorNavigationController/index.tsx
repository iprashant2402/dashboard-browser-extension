import { useQuery, useQueryClient } from "@tanstack/react-query";
import { localPageRepository } from "../../repository/PageRepository";
import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router";
import { useCreatePage } from "../../hooks/useCreatePage";
import { v4 as uuidv4 } from 'uuid';
import { RELEASE_NOTES_PAGE_VISITED_KEY } from "../../../../utils/constants";

export const PageEditorNavigationController = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { mutateAsync: createPage } = useCreatePage(
        { onSuccess: () => queryClient.refetchQueries({
            queryKey: ['pages']
        }) }
    );
    const { data: page, status } = useQuery({
        queryKey: ['latest-page'],
        queryFn: () => localPageRepository.getLastAccessedPage(),
    });

    const createNewPage = useCallback(async () => {
        try {
            const createdAt = new Date();
            const newPage = {
                id: uuidv4(),
                title: "",
                content: "",
                createdAt,
                updatedAt: createdAt,
                version: 0,
            };
            await createPage(newPage);
            navigate(`/editor/${newPage.id}`);
        } catch (error) {
            console.error(error);
        }
    }, [createPage, navigate]);

    useEffect(() => {
        if (status !== 'success') return;
        if (page) {
            const hasSeenReleaseNotes = localStorage.getItem(RELEASE_NOTES_PAGE_VISITED_KEY);
            if (!hasSeenReleaseNotes) {
                navigate('/resource/releaseNotes');
            }
            else navigate(`/editor/${page.id}`);
        } else {
            navigate('/resource/about');
        }
    }, [page, navigate, status, createNewPage]);

    return null;
}
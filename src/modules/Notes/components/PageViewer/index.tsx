import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import { pagesSyncRepository } from "../../api";
import { Editor } from "../../../../components/Editor";
import "./index.css";
import { Button } from "../../../../components/Button";
import { IoCopy } from "react-icons/io5";
import { IconError } from "../../../../assets/icons/IconError";
import { useCallback } from "react";
import { v4 as uuidv4 } from 'uuid';
import { useCreatePage } from "../../hooks/useCreatePage";
import { useToast } from "../../../../components/Toast";
import { AnalyticsTracker } from "../../../../analytics/AnalyticsTracker";

export const PageViewer = () => {
    const { id } = useParams();
    const { mutateAsync: createPage } = useCreatePage();
    const navigate = useNavigate();
    const { showToast } = useToast();
    const { data: page, isLoading: isFetchingPage, isError: isPageFetchError } = useQuery({
        queryKey: ['page', id],
        queryFn: () => pagesSyncRepository.getPublicPageById(id!),
        enabled: !!id,
        staleTime: 0,
        gcTime: 0,
        refetchOnMount: true,
    });

    const createPageCopy = useCallback(async () => {
        if (!page?.content || typeof page.content !== 'string') return;
        AnalyticsTracker.track('Create page copy - Click', {
            page_id: page.id,
            page_title: page.title,
        });
        try {
            const createdAt = new Date();
            const newPage = {
                id: uuidv4(),
                title: page.title,
                content: page.content as string,
                createdAt,
                updatedAt: createdAt,
                version: 0,
                order: createdAt.getTime(),
            };
            await createPage(newPage);
            showToast({
                type: "success",
                message: "Page copied successfully"
            });
            navigate(`/editor/${newPage.id}`);
        } catch (error) {
            console.error(error);
            showToast({
                type: "error",
                message: "Oops! Something went wrong. Failed to create a copy."
            });
        }
    }, [createPage, navigate, page?.content, page?.id, page?.title, showToast]);

    return <div className="page-editor viewer">
        <div className="viewer-header">
            <Button disabled={isFetchingPage || isPageFetchError} variant="clear" onClick={createPageCopy} label="Create a copy" icon={<IoCopy size={18} />} className="action" />
        </div>
        {
            isPageFetchError && <div className="viewer-error">
                <IconError color="red" size={180} />
                <p>Oops! Something went wrong.</p>
                <p>We are not able to find the page you are looking for.</p>
            </div>
        }
        {
            !isPageFetchError && !!page?.content && <Editor
                key={page.id}
                initialState={page.content as string}
                onChange={() => { }}
                onSave={() => { }}
                editable={false}
                showToolbar={false}
            />
        }
    </div>;
};
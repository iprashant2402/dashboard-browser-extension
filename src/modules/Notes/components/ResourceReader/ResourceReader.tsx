import { useParams } from "react-router";
import AboutInsquooDoc from "../../../../resources/aboutInsquooDoc.json";
import ReleaseNotes from "../../../../resources/releaseNotes.json";
import { useEffect, useMemo } from "react";
import { Editor } from "../../../../components/Editor";
import "../PageEditor/index.css";
import { ABOUT_PAGE_VISITED_KEY, RELEASE_NOTES_PAGE_VISITED_KEY } from "../../../../utils/constants";

export type ResourceType = "about" | "releaseNotes";

export const ResourceReader = () => {
    const {resource} = useParams();

    useEffect(() => {
        if (resource === "releaseNotes") {
            localStorage.setItem(RELEASE_NOTES_PAGE_VISITED_KEY, "true");
        }
        else if (resource === "about") {
            localStorage.setItem(ABOUT_PAGE_VISITED_KEY, "true");
        }
    }, [resource]);

    const content = useMemo(() => {
        switch (resource) {
            case "about":
                return JSON.stringify(AboutInsquooDoc);
            case "releaseNotes":
                return JSON.stringify(ReleaseNotes);
            default:
                return null;
        }
    }, [resource]);

    return <div className="page-editor">
        {content && <Editor 
        key={resource}
        initialState={content} 
        onChange={() => {}}
        onSave={() => {}}
        editable={false}
        />}
    </div>;
};
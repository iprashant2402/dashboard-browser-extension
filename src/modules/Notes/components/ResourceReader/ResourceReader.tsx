import { useParams } from "react-router";
import AboutInsquooDoc from "../../../../resources/aboutInsquooDoc.json";
import ReleaseNotes from "../../../../resources/releaseNotes.json";
import { useMemo } from "react";
import { Editor } from "../../../../components/Editor";
import "../PageEditor/index.css";

export type ResourceType = "about" | "releaseNotes";

export const ResourceReader = () => {
    const {resource} = useParams();

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
import { useEditorTabs } from "../../../modules/Notes/components/EditorTabsProvider";
import "./index.css";
import { useEffect } from "react";


// TODO: This is in progress. Not yet live.
export const EditorTabs = () => {
    const { tabs } = useEditorTabs();

    useEffect(() => {
        console.log(tabs);
    }, [tabs]);

    return <div className="editor-tabs">
        {tabs.map((tab) => (
            <div key={tab.id}>
                <span>{tab.title}</span>
            </div>
        ))}
    </div>;
}
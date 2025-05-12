import { IoDownload } from "react-icons/io5";
import "./index.css";
import { Button } from "../Button";
import { Editor } from "../Editor";

export const CommandCenter = () => {

    return <div className="command-center">
        <div className="command-center-header row jt-space-between ai-center">
            <h1>Scratch Pad</h1>
            <div className="command-center-actions">
                <Button variant="clear" icon={<IoDownload size={18} />} label="Save page" />
            </div>
        </div>
        <div className="command-center-content">
        <Editor />
        </div>
    </div>;
}
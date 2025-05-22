import { useState } from "react";
import { Project } from "../../types/Project";
import "./CreateProjectForm.css";
import { IoCheckmarkCircle } from "react-icons/io5";
import { Button } from "../../../../components/Button";
import { v4 as uuidv4 } from 'uuid';
import { DEFAULT_TASK_STATUSES } from "../../config/TaskColumns";

export const CreateProjectForm = (props: { onSubmit: (project: Project) => void }) => {
    const [projectName, setProjectName] = useState("");

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!projectName || projectName.trim() === "") return;

        const id = uuidv4();
        props.onSubmit({ id, name: projectName, allowed_columns: DEFAULT_TASK_STATUSES, createdAt: new Date(), updatedAt: new Date() });
        setProjectName("");
    }

    return <div className="create-project-form-container">
        <form className="create-project-form" onSubmit={handleSubmit}>
            <div className="column">
                <label htmlFor="project-name">What would you like to call your board?</label>
                <input id="project-name" type="text" placeholder="e.g. Personal/Work etc." value={projectName} onChange={(e) => setProjectName(e.target.value)} />
            </div>
            <div className="row jt-end">
            <Button variant="primary" type="submit" icon={<IoCheckmarkCircle size={24} />} label="Create" />
            </div>
        </form>
    </div>
}
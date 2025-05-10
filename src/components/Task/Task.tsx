import './Task.css';

export const Task = () => {
    return (
        <div className="taskContainer" draggable>
            <h3 contentEditable={'plaintext-only'} placeholder="Enter your task"></h3>
            <p contentEditable={'plaintext-only'} placeholder="Describe your task"></p>
        </div>
    )
}

export default Task;
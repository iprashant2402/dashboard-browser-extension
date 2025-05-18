import './Task.css';

export const Task = () => {
    return (
        <div className="taskContainer" draggable>
            <div className='row task-header'>
                <h5 contentEditable="true" data-placeholder="Enter your task"></h5>
            </div>
            <div className='row task-footer'>
                <p contentEditable="true" data-placeholder="Describe your task"></p>
            </div>
        </div>
    )
}

export default Task;
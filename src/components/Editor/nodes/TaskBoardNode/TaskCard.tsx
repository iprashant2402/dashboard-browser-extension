import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task } from './types';
import { IoEllipsisVertical, IoCreate, IoTrash } from 'react-icons/io5';

interface TaskCardProps {
  task: Task;
  onUpdate: (taskId: string, updates: Partial<Task>) => void;
  onDelete: (taskId: string) => void;
  isDragging?: boolean;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onUpdate,
  onDelete,
  isDragging = false
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: sortableIsDragging,
  } = useSortable({ id: task.id });
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description || '');
  const [showMenu, setShowMenu] = useState(false);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleSave = () => {
    onUpdate(task.id, {
      title: editTitle.trim() || 'Untitled Task',
      description: editDescription.trim()
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(task.title);
    setEditDescription(task.description || '');
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#ff4757';
      case 'medium': return '#ffa726';
      case 'low': return '#66bb6a';
      default: return '#9e9e9e';
    }
  };

  if (isEditing) {
    return (
      <div className="task-card editing">
        <div className="task-card-content">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            className="task-title-input"
            placeholder="Task title"
            autoFocus
          />
          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            onKeyDown={handleKeyDown}
            className="task-description-input"
            placeholder="Add description..."
            rows={3}
          />
          <div className="task-priority">
            <label>Priority:</label>
            <select
              value={task.priority}
              onChange={(e) => onUpdate(task.id, { priority: e.target.value as Task['priority'] })}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>
        <div className="task-card-actions">
          <button onClick={handleSave} className="save-btn">Save</button>
          <button onClick={handleCancel} className="cancel-btn">Cancel</button>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={setNodeRef}
      style={style}
      className={`task-card ${isDragging || sortableIsDragging ? 'dragging' : ''}`}
      {...attributes}
      {...listeners}
    >
      <div className="task-card-header">
        <div 
          className="task-priority-indicator"
          style={{ backgroundColor: getPriorityColor(task.priority || 'medium') }}
        />
        <div className="task-card-menu">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="menu-toggle"
          >
            <IoEllipsisVertical />
          </button>
          {showMenu && (
            <div className="task-menu" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => { setIsEditing(true); setShowMenu(false); }}>
                <IoCreate /> Edit
              </button>
              <button onClick={() => { onDelete(task.id); setShowMenu(false); }} className="delete-btn">
                <IoTrash /> Delete
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="task-card-content">
        <h4 className="task-title">{task.title}</h4>
        {task.description && (
          <p className="task-description">{task.description}</p>
        )}
        {task.assignee && (
          <div className="task-assignee">
            <span className="assignee-avatar">{task.assignee[0].toUpperCase()}</span>
            <span className="assignee-name">{task.assignee}</span>
          </div>
        )}
        {task.dueDate && (
          <div className="task-due-date">
            Due: {new Date(task.dueDate).toLocaleDateString()}
          </div>
        )}
      </div>
    </div>
  );
};

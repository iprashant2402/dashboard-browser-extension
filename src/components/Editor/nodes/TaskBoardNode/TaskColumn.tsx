import React, { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Column, Task } from './types';
import { TaskCard } from './TaskCard';
import { IoAdd, IoCreate } from 'react-icons/io5';
import { createTask } from './utils';

interface TaskColumnProps {
  column: Column;
  tasks: Task[];
  onTaskUpdate: (taskId: string, updates: Partial<Task>) => void;
  onTaskDelete: (taskId: string) => void;
  onTaskAdd: (task: Task, columnId: string) => void;
  onColumnUpdate: (columnId: string, updates: Partial<Column>) => void;
  activeTaskId?: string | null;
}

export const TaskColumn: React.FC<TaskColumnProps> = ({
  column,
  tasks,
  onTaskUpdate,
  onTaskDelete,
  onTaskAdd,
  onColumnUpdate,
  activeTaskId
}) => {
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editTitle, setEditTitle] = useState(column.title);

  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  const taskIds = tasks.map(task => task.id);

  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      const newTask = createTask(newTaskTitle.trim(), column.id);
      onTaskAdd(newTask, column.id);
      setNewTaskTitle('');
      setIsAddingTask(false);
    }
  };

  const handleTitleSave = () => {
    if (editTitle.trim() && editTitle.trim() !== column.title) {
      onColumnUpdate(column.id, { title: editTitle.trim() });
    }
    setIsEditingTitle(false);
  };

  const handleTitleCancel = () => {
    setEditTitle(column.title);
    setIsEditingTitle(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (isEditingTitle) {
        handleTitleSave();
      } else {
        handleAddTask();
      }
    } else if (e.key === 'Escape') {
      if (isEditingTitle) {
        handleTitleCancel();
      } else {
        setIsAddingTask(false);
        setNewTaskTitle('');
      }
    }
  };

  return (
    <div 
      ref={setNodeRef}
      className={`task-column ${isOver ? 'drag-over' : ''}`}
    >
      <div className="task-column-header">
        {isEditingTitle ? (
          <div className="column-title-edit">
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleTitleSave}
              className="column-title-input"
              autoFocus
            />
          </div>
        ) : (
          <div className="column-title-wrapper">
            <div 
              className="column-title"
              style={{ borderColor: column.color }}
              onClick={() => setIsEditingTitle(true)}
            >
              <h3>{column.title}</h3>
              <span className="task-count">({tasks.length})</span>
              <IoCreate className="edit-icon" />
            </div>
          </div>
        )}
        <button 
          onClick={() => setIsAddingTask(true)}
          className="add-task-btn"
          title="Add task"
        >
          <IoAdd />
        </button>
      </div>
      
      <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
        <div className="task-column-content">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onUpdate={onTaskUpdate}
              onDelete={onTaskDelete}
              isDragging={activeTaskId === task.id}
            />
          ))}
          
          {isAddingTask && (
            <div className="new-task-form">
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter task title..."
                className="new-task-input"
                autoFocus
              />
              <div className="new-task-actions">
                <button onClick={handleAddTask} className="add-btn">Add</button>
                <button 
                  onClick={() => {
                    setIsAddingTask(false);
                    setNewTaskTitle('');
                  }} 
                  className="cancel-btn"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  );
};

import React, { useState } from 'react';
import { TaskBoardData, Task } from './types';
import { TaskCard } from './TaskCard';
import { IoAdd, IoGrid, IoList, IoFunnel } from 'react-icons/io5';
import { createTask } from './utils';

interface TaskListViewProps {
  data: TaskBoardData;
  onTaskUpdate: (taskId: string, updates: Partial<Task>) => void;
  onTaskDelete: (taskId: string) => void;
  onTaskAdd: (task: Task, columnId: string) => void;
  onViewModeChange: (mode: 'kanban' | 'list') => void;
}

export const TaskListView: React.FC<TaskListViewProps> = ({
  data,
  onTaskUpdate,
  onTaskDelete,
  onTaskAdd,
  onViewModeChange
}) => {
  const [filterColumn, setFilterColumn] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'createdAt' | 'priority' | 'title'>('createdAt');
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskColumn, setNewTaskColumn] = useState(data.columnOrder[0]);

  // Get all tasks with their column information
  const allTasks = Object.values(data.tasks).map(task => {
    const columnId = Object.values(data.columns).find(col => 
      col.taskIds.includes(task.id)
    )?.id || '';
    const column = data.columns[columnId];
    return {
      ...task,
      columnId,
      columnTitle: column?.title || 'Unknown',
      columnColor: column?.color || '#6c757d'
    };
  });

  // Filter tasks
  const filteredTasks = filterColumn === 'all' 
    ? allTasks 
    : allTasks.filter(task => task.columnId === filterColumn);

  // Sort tasks
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    switch (sortBy) {
      case 'priority':
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return (priorityOrder[b.priority || 'medium'] || 2) - (priorityOrder[a.priority || 'medium'] || 2);
      case 'title':
        return a.title.localeCompare(b.title);
      case 'createdAt':
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  const handleAddTask = () => {
    if (newTaskTitle.trim() && newTaskColumn) {
      const newTask = createTask(newTaskTitle.trim(), newTaskColumn);
      onTaskAdd(newTask, newTaskColumn);
      setNewTaskTitle('');
      setIsAddingTask(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddTask();
    } else if (e.key === 'Escape') {
      setIsAddingTask(false);
      setNewTaskTitle('');
    }
  };

  return (
    <div className="task-list-view">
      <div className="task-list-header">
        <div className="view-controls">
          <button 
            onClick={() => onViewModeChange('kanban')}
            className="view-toggle"
            title="Switch to Kanban view"
          >
            <IoGrid /> Kanban
          </button>
          <button className="view-toggle active">
            <IoList /> List
          </button>
        </div>
        
        <div className="list-controls">
          <div className="filter-control">
            <IoFunnel />
            <select 
              value={filterColumn} 
              onChange={(e) => setFilterColumn(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Columns</option>
              {data.columnOrder.map(columnId => (
                <option key={columnId} value={columnId}>
                  {data.columns[columnId].title}
                </option>
              ))}
            </select>
          </div>
          
          <div className="sort-control">
            <span>Sort by:</span>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="sort-select"
            >
              <option value="createdAt">Created Date</option>
              <option value="priority">Priority</option>
              <option value="title">Title</option>
            </select>
          </div>
          
          <button 
            onClick={() => setIsAddingTask(true)}
            className="add-task-btn"
          >
            <IoAdd /> Add Task
          </button>
        </div>
      </div>

      {isAddingTask && (
        <div className="new-task-form-list">
          <div className="new-task-inputs">
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter task title..."
              className="new-task-input"
              autoFocus
            />
            <select 
              value={newTaskColumn}
              onChange={(e) => setNewTaskColumn(e.target.value)}
              className="column-select"
            >
              {data.columnOrder.map(columnId => (
                <option key={columnId} value={columnId}>
                  {data.columns[columnId].title}
                </option>
              ))}
            </select>
          </div>
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

      <div className="task-list-content">
        {sortedTasks.length === 0 ? (
          <div className="empty-state">
            <p>No tasks found</p>
            {!isAddingTask && (
              <button 
                onClick={() => setIsAddingTask(true)}
                className="add-first-task-btn"
              >
                Add your first task
              </button>
            )}
          </div>
        ) : (
          <div className="task-list-items">
            {sortedTasks.map((task) => (
              <div key={task.id} className="task-list-item">
                <div className="task-column-badge" style={{ backgroundColor: task.columnColor }}>
                  {task.columnTitle}
                </div>
                <div className="task-card-wrapper">
                  <TaskCard
                    task={task}
                    onUpdate={onTaskUpdate}
                    onDelete={onTaskDelete}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

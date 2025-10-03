import React, { useState, useCallback } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { 
  DndContext, 
  DragEndEvent,
  DragStartEvent,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import { $getNodeByKey } from 'lexical';
import { TaskBoardData, Task, Column } from './types';
import { TaskColumn } from './TaskColumn';
// import { TaskListView } from './TaskListView'; // Temporarily disabled
import { 
  createDefaultTaskBoard, 
  addTask, 
  updateTask, 
  deleteTask, 
  updateColumn,
  addColumn,
  moveTask
} from './utils';
import { IoSettings, /* IoGrid, IoList, */ IoAdd, IoCreate } from 'react-icons/io5';
import { $isTaskBoardNode } from './TaskBoardNode';
import './TaskBoard.css';

interface TaskBoardComponentProps {
  nodeKey: string;
  data?: TaskBoardData;
}

export const TaskBoardComponent: React.FC<TaskBoardComponentProps> = ({
  nodeKey,
  data: initialData
}) => {
  const [editor] = useLexicalComposerContext();
  const [data, setData] = useState<TaskBoardData>(() => 
    initialData || createDefaultTaskBoard()
  );

  // Sync with initial data changes (e.g., when loading from saved state)
  React.useEffect(() => {
    if (initialData) {
      setData(initialData);
    }
  }, [initialData]);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editTitle, setEditTitle] = useState(data.title);
  const [showSettings, setShowSettings] = useState(false);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const updateData = useCallback((newData: TaskBoardData) => {
    setData(newData);
    
    // Update the lexical node data for persistence
    editor.update(() => {
      const node = $getNodeByKey(nodeKey);
      
      if (node && (node.getType() === 'taskboard' || $isTaskBoardNode(node))) {
        // Cast to TaskBoardNode since we know it's the right type
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const taskBoardNode = node as any;
        taskBoardNode.updateData(newData);
      } else {
        console.warn("TaskBoard node not found or invalid type", {
          node,
          nodeKey,
          nodeType: node?.getType(),
          isTaskBoardNode: node ? $isTaskBoardNode(node) : false
        });
      }
    });
  }, [editor, nodeKey]);

  const handleTaskUpdate = useCallback((taskId: string, updates: Partial<Task>) => {
    const newData = updateTask(data, taskId, updates);
    updateData(newData);
  }, [data, updateData]);

  const handleTaskDelete = useCallback((taskId: string) => {
    const newData = deleteTask(data, taskId);
    updateData(newData);
  }, [data, updateData]);

  const handleTaskAdd = useCallback((task: Task, columnId: string) => {
    const newData = addTask(data, task, columnId);
    updateData(newData);
  }, [data, updateData]);

  const handleColumnUpdate = useCallback((columnId: string, updates: Partial<Column>) => {
    const newData = updateColumn(data, columnId, updates);
    updateData(newData);
  }, [data, updateData]);

  const handleTitleSave = () => {
    if (editTitle.trim() && editTitle.trim() !== data.title) {
      const newData = { ...data, title: editTitle.trim(), updatedAt: new Date().toISOString() };
      updateData(newData);
    }
    setIsEditingTitle(false);
  };

  const handleTitleCancel = () => {
    setEditTitle(data.title);
    setIsEditingTitle(false);
  };

  const handleAddColumn = () => {
    const title = prompt('Enter column title:');
    if (title?.trim()) {
      const newData = addColumn(data, title.trim());
      updateData(newData);
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveTaskId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTaskId(null);

    if (!over) return;

    const taskId = active.id as string;
    const overId = over.id as string;

    // Don't do anything if dropped on itself
    if (taskId === overId) return;

    // Find source column
    const sourceColumnId = Object.keys(data.columns).find(columnId =>
      data.columns[columnId].taskIds.includes(taskId)
    );

    if (!sourceColumnId) return;

    const sourceColumn = data.columns[sourceColumnId];
    const sourceIndex = sourceColumn.taskIds.indexOf(taskId);

    let destinationColumnId = sourceColumnId;
    let destinationIndex = sourceColumn.taskIds.length - 1; // Default to end of same column

    // Determine destination based on what was dropped on
    if (Object.keys(data.columns).includes(overId)) {
      // Dropped on a column - move to end of that column
      destinationColumnId = overId;
      destinationIndex = data.columns[overId].taskIds.length;
    } else if (Object.keys(data.tasks).includes(overId)) {
      // Dropped on a task - find which column it's in and insert before it
      destinationColumnId = Object.keys(data.columns).find(columnId =>
        data.columns[columnId].taskIds.includes(overId)
      ) || sourceColumnId;
      
      const targetColumn = data.columns[destinationColumnId];
      destinationIndex = targetColumn.taskIds.indexOf(overId);
    }

    // Skip if no actual movement
    if (sourceColumnId === destinationColumnId && sourceIndex === destinationIndex) {
      return;
    }

    // For same column moves, adjust destination index if needed
    if (sourceColumnId === destinationColumnId && sourceIndex < destinationIndex) {
      destinationIndex--;
    }


    const newData = moveTask(
      data,
      taskId,
      sourceColumnId,
      destinationColumnId,
      sourceIndex,
      destinationIndex
    );

    updateData(newData);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTitleSave();
    } else if (e.key === 'Escape') {
      handleTitleCancel();
    }
  };

  const renderKanbanView = () => (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="task-board-kanban">
        <div className="task-columns">
          {data.columnOrder.map(columnId => {
            const column = data.columns[columnId];
            const tasks = column.taskIds.map(taskId => data.tasks[taskId]).filter(Boolean);
            
            return (
              <TaskColumn
                key={columnId}
                column={column}
                tasks={tasks}
                onTaskUpdate={handleTaskUpdate}
                onTaskDelete={handleTaskDelete}
                onTaskAdd={handleTaskAdd}
                onColumnUpdate={handleColumnUpdate}
                activeTaskId={activeTaskId}
              />
            );
          })}
          
          <div className="add-column">
            <button onClick={handleAddColumn} className="add-column-btn">
              <IoAdd /> Add Column
            </button>
          </div>
        </div>
      </div>
    </DndContext>
  );

  return (
    <div className="task-board-container">
      <div className="task-board-header">
        <div className="board-title-section">
          {isEditingTitle ? (
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleTitleSave}
              className="board-title-input"
              autoFocus
            />
          ) : (
            <h2 
              className="board-title"
              onClick={() => setIsEditingTitle(true)}
            >
              {data.title}
              <IoCreate className="edit-icon" />
            </h2>
          )}
        </div>
        
        <div className="board-controls">
          {/* List view temporarily disabled */}
          {/* {data.viewMode === 'list' ? (
            <button 
              onClick={() => handleViewModeChange('kanban')}
              className="view-toggle"
              title="Switch to Kanban view"
            >
              <IoGrid /> Kanban
            </button>
          ) : (
            <button 
              onClick={() => handleViewModeChange('list')}
              className="view-toggle"
              title="Switch to List view"
            >
              <IoList /> List
            </button>
          )} */}
          
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className="settings-btn"
            title="Board settings"
          >
            <IoSettings />
          </button>
        </div>
      </div>

      {showSettings && (
        <div className="board-settings">
          <div className="settings-content">
            <h4>Board Settings</h4>
            <div className="setting-item">
              <label>Board Title:</label>
              <input
                type="text"
                value={data.title}
                onChange={(e) => {
                  const newData = { ...data, title: e.target.value, updatedAt: new Date().toISOString() };
                  updateData(newData);
                }}
              />
            </div>
            {/* List view temporarily disabled */}
            {/* <div className="setting-item">
              <label>Default View:</label>
              <select
                value={data.viewMode}
                onChange={(e) => handleViewModeChange(e.target.value as 'kanban' | 'list')}
              >
                <option value="kanban">Kanban</option>
                <option value="list">List</option>
              </select>
            </div> */}
          </div>
        </div>
      )}

      <div className="task-board-content">
        {/* Always render Kanban view - List view temporarily disabled */}
        {renderKanbanView()}
      </div>
    </div>
  );
};

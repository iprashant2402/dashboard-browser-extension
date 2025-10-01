import { TaskBoardData, Task, Column } from './types';

export const createDefaultTaskBoard = (title: string = 'Task Board'): TaskBoardData => {
  const todoId = 'column-todo';
  const inProgressId = 'column-in-progress';
  const doneId = 'column-done';

  return {
    id: `taskboard-${Date.now()}`,
    title,
    tasks: {},
    columns: {
      [todoId]: {
        id: todoId,
        title: 'TODO',
        taskIds: [],
        color: '#ff6b6b'
      },
      [inProgressId]: {
        id: inProgressId,
        title: 'In Progress',
        taskIds: [],
        color: '#4ecdc4'
      },
      [doneId]: {
        id: doneId,
        title: 'Done',
        taskIds: [],
        color: '#45b7d1'
      }
    },
    columnOrder: [todoId, inProgressId, doneId],
    viewMode: 'kanban',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
};

export const createTask = (title: string): Task => {
  return {
    id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    title,
    description: '',
    priority: 'medium',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
};

export const moveTask = (
  taskBoardData: TaskBoardData,
  taskId: string,
  sourceColumnId: string,
  destinationColumnId: string,
  sourceIndex: number,
  destinationIndex: number
): TaskBoardData => {
  const sourceColumn = taskBoardData.columns[sourceColumnId];
  const destinationColumn = taskBoardData.columns[destinationColumnId];

  if (!sourceColumn || !destinationColumn) {
    return taskBoardData;
  }

  // Remove task from source column
  const newSourceTaskIds = Array.from(sourceColumn.taskIds);
  newSourceTaskIds.splice(sourceIndex, 1);

  // Add task to destination column
  const newDestinationTaskIds = Array.from(destinationColumn.taskIds);
  newDestinationTaskIds.splice(destinationIndex, 0, taskId);

  return {
    ...taskBoardData,
    columns: {
      ...taskBoardData.columns,
      [sourceColumnId]: {
        ...sourceColumn,
        taskIds: newSourceTaskIds
      },
      [destinationColumnId]: {
        ...destinationColumn,
        taskIds: newDestinationTaskIds
      }
    },
    updatedAt: new Date().toISOString()
  };
};

export const addTask = (
  taskBoardData: TaskBoardData,
  task: Task,
  columnId: string
): TaskBoardData => {
  const column = taskBoardData.columns[columnId];
  if (!column) {
    return taskBoardData;
  }

  return {
    ...taskBoardData,
    tasks: {
      ...taskBoardData.tasks,
      [task.id]: task
    },
    columns: {
      ...taskBoardData.columns,
      [columnId]: {
        ...column,
        taskIds: [...column.taskIds, task.id]
      }
    },
    updatedAt: new Date().toISOString()
  };
};

export const updateTask = (
  taskBoardData: TaskBoardData,
  taskId: string,
  updates: Partial<Task>
): TaskBoardData => {
  const existingTask = taskBoardData.tasks[taskId];
  if (!existingTask) {
    return taskBoardData;
  }

  return {
    ...taskBoardData,
    tasks: {
      ...taskBoardData.tasks,
      [taskId]: {
        ...existingTask,
        ...updates,
        updatedAt: new Date().toISOString()
      }
    },
    updatedAt: new Date().toISOString()
  };
};

export const deleteTask = (
  taskBoardData: TaskBoardData,
  taskId: string
): TaskBoardData => {
  const newTasks = { ...taskBoardData.tasks };
  delete newTasks[taskId];

  const newColumns = { ...taskBoardData.columns };
  Object.keys(newColumns).forEach(columnId => {
    newColumns[columnId] = {
      ...newColumns[columnId],
      taskIds: newColumns[columnId].taskIds.filter(id => id !== taskId)
    };
  });

  return {
    ...taskBoardData,
    tasks: newTasks,
    columns: newColumns,
    updatedAt: new Date().toISOString()
  };
};

export const addColumn = (
  taskBoardData: TaskBoardData,
  title: string,
  color?: string
): TaskBoardData => {
  const columnId = `column-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  return {
    ...taskBoardData,
    columns: {
      ...taskBoardData.columns,
      [columnId]: {
        id: columnId,
        title,
        taskIds: [],
        color: color || '#6c757d'
      }
    },
    columnOrder: [...taskBoardData.columnOrder, columnId],
    updatedAt: new Date().toISOString()
  };
};

export const updateColumn = (
  taskBoardData: TaskBoardData,
  columnId: string,
  updates: Partial<Column>
): TaskBoardData => {
  const existingColumn = taskBoardData.columns[columnId];
  if (!existingColumn) {
    return taskBoardData;
  }

  return {
    ...taskBoardData,
    columns: {
      ...taskBoardData.columns,
      [columnId]: {
        ...existingColumn,
        ...updates
      }
    },
    updatedAt: new Date().toISOString()
  };
};

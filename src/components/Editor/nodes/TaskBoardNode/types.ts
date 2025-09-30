export interface Task {
  id: string;
  title: string;
  description?: string;
  assignee?: string;
  priority?: 'low' | 'medium' | 'high';
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Column {
  id: string;
  title: string;
  taskIds: string[];
  color?: string;
}

export interface TaskBoardData {
  id: string;
  title: string;
  tasks: Record<string, Task>;
  columns: Record<string, Column>;
  columnOrder: string[];
  viewMode: 'kanban' | 'list';
  createdAt: string;
  updatedAt: string;
}

export interface TaskBoardPayload {
  title?: string;
  key?: string;
  data?: TaskBoardData;
}

export type TaskMove = {
  taskId: string;
  sourceColumnId: string;
  destinationColumnId: string;
  sourceIndex: number;
  destinationIndex: number;
};

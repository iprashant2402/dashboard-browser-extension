export type TaskHistoryEntryType = 'comment' | 'status_change' | 'task_created' | 'task_title_updated' | 'task_description_updated' | 'task_tags_updated' | 'task_due_date_updated' | 'task_priority_updated';

export type TaskPriority = 'LOWEST' | 'LOW' | 'MEDIUM' | 'HIGH' | 'HIGHEST';

export interface TaskHistoryEntry {
    id: string;
    content: string;
    type: TaskHistoryEntryType;
    createdAt: Date;
}

export interface TaskStatusMetadata {
    id: string;
    name: string;
    color: string;
    order: number;
    isTerminal: boolean;
}

export interface Task {
    id: string;
    projectId: string;
    title: string;
    description?: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
    dueDate?: Date;
    priority: TaskPriority;
    tags: string[];
}
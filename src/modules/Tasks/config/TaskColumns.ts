import { TaskStatusMetadata } from "../types/Task"

export const TODO_TASK_STATUS: TaskStatusMetadata = {
    id: 'TODO',
    name: 'TODO',
    color: '#000000',
    order: 0
}

export const IN_PROGRESS_TASK_STATUS: TaskStatusMetadata = {
    id: 'IN_PROGRESS',
    name: 'IN_PROGRESS',
    color: '#000000',
    order: 1
}

export const DONE_TASK_STATUS: TaskStatusMetadata = {
    id: 'DONE',
    name: 'DONE',
    color: '#000000',
    order: 2
}

export const DEFAULT_TASK_STATUSES: TaskStatusMetadata[] = [
    TODO_TASK_STATUS,
    IN_PROGRESS_TASK_STATUS,
    DONE_TASK_STATUS
]
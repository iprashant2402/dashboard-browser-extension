import { TaskStatusMetadata } from "../types/Task"

export const TODO_TASK_STATUS: TaskStatusMetadata = {
    id: 'TODO',
    name: 'To do',
    color: '#000000',
    order: 0,
    isTerminal: false
}

export const IN_PROGRESS_TASK_STATUS: TaskStatusMetadata = {
    id: 'IN_PROGRESS',
    name: 'In progress',
    color: '#000000',
    order: 1,
    isTerminal: false
}

export const DONE_TASK_STATUS: TaskStatusMetadata = {
    id: 'DONE',
    name: 'Done',
    color: '#000000',
    order: 2,
    isTerminal: true
}

export const DEFAULT_TASK_STATUSES: TaskStatusMetadata[] = [
    TODO_TASK_STATUS,
    IN_PROGRESS_TASK_STATUS,
    DONE_TASK_STATUS
]
import { TaskStatusMetadata } from "./Task";

export interface Project {
    id: string;
    name: string;
    description?: string;
    allowed_columns: TaskStatusMetadata[];
    createdAt: Date;
    updatedAt: Date;
}
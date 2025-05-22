import { Project } from "../types/Project";
import { Task } from "../types/Task";

export interface IProjectRepository {
    getProjects(): Promise<Project[]>;
    getProject(id: string): Promise<Project>;
    createProject(project: Project): Promise<Project>;
    updateProject(id: string, project: Partial<Project>): Promise<Project>;
    deleteProject(id: string): Promise<void>;
    getTasks(projectId: string): Promise<Task[]>;
    createTask(projectId: string, task: Task): Promise<Task>;
    updateTask(taskId: string, task: Partial<Task>): Promise<Task>;
    deleteTask(taskId: string): Promise<void>;
}
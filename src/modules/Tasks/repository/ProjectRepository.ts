import { IProjectRepository } from "./IProjectRepository";
import { Project } from "../types/Project";
import { localDB } from "../../../utils/LocalDBStorage";
import { Task } from "../types/Task";

export class LocalProjectRepository implements IProjectRepository {
    async getProjects(): Promise<Project[]> {
        return await localDB.getAll<Project>('projects');
    } 

    async getProject(id: string): Promise<Project> {
        const project = await localDB.get<Project>('projects', id);
        if (!project) throw new Error('PROJECT_NOT_FOUND');
        return project;
    }

    async createProject(project: Project): Promise<Project> {
        return await localDB.add('projects', project);
    }   

    async updateProject(id: string, project: Partial<Project>): Promise<Project> {
        const projectToUpdate = await localDB.get<Project>('projects', id);
        if (!projectToUpdate) throw new Error('PROJECT_NOT_FOUND');
        const updatedProject = {...projectToUpdate, ...project};
        return await localDB.update<Project>('projects', updatedProject);
    }

    async deleteProject(id: string): Promise<void> {
        return await localDB.delete('projects', id);
    }

    async getTasks(projectId: string): Promise<Task[]> {
        return await localDB.search<Task>('tasks', 'projectId', projectId);
    }

    async createTask(projectId: string, task: Task): Promise<Task> {
        return await localDB.add('tasks', { ...task, projectId });
    }

    async updateTask(taskId: string, task: Partial<Task>): Promise<Task> {
        const taskToUpdate = await localDB.get<Task>('tasks', taskId);
        if (!taskToUpdate) throw new Error('TASK_NOT_FOUND');
        const updatedTask = {...taskToUpdate, ...task};
        return await localDB.update<Task>('tasks', updatedTask);
    }

    async deleteTask(taskId: string): Promise<void> {
        return await localDB.delete('tasks', taskId);
    }
}

export const localProjectRepository = new LocalProjectRepository();
import { useCallback, useState } from "react";
import { Task } from "../../types/Task";
import { v4 as uuidv4 } from 'uuid';

export const useCreateTask = () => {
    const [task, setTask] = useState<Task>();

    const createNewTask = useCallback(() => {
        setTask({
            id: uuidv4(),
            title: '',
            description: '',
            status: 'TODO',
            createdAt: new Date(),
            updatedAt: new Date(),
            tags: []
        });
    }, []);

    const updateTask = useCallback((updates: Task) => {
        setTask(prev => ({ ...prev, ...updates }));
    }, []);

    const handleOnChange = useCallback((e: React.ChangeEvent<HTMLDivElement>) => {
        console.log(e.target);
    }, []);

    return {
        task,
        createNewTask,
        updateTask,
        handleOnChange
    }
}
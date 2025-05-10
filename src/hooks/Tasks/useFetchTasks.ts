import { useCallback, useState } from "react";

import { storage } from "../../utils/storage";
import { Task } from "../../types/Task";
export const useFetchTasks = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchTasks = useCallback(async () => {
        setIsLoading(true);
        try {
            const tasks = await storage.getItem<Task[]>("tasks");
            if (!tasks) return;
            setTasks(tasks);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    return {
        fetchTasks,
        tasks,
        isLoading
    }
}
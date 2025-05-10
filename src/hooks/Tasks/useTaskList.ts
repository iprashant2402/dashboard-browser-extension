import { useFetchTasks } from "./useFetchTasks";

export const useTaskList = () => {
    const { fetchTasks, tasks, isLoading } = useFetchTasks();

    return {};
};
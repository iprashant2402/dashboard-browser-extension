import { createMemoryRouter, RouteObject } from "react-router";
import { HomeView } from "../views/HomeView";
import { TaskBoardView } from "../views/TaskBoardView";

const routes: RouteObject[] = [
    {
        path: '/',
        element: <HomeView />,
    },
    {
        path: '/task-board',
        element: <TaskBoardView />,
    },
]

export const router = createMemoryRouter(routes);
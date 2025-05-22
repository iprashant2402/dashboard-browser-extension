import { createMemoryRouter, Navigate, RouteObject } from "react-router";
import { HomeView } from "../views/HomeView";
import { TaskBoardView } from "../modules/Tasks/components/TaskBoardView";
import { Editor } from "../components/Editor";

const routes: RouteObject[] = [
    {
        path: '/',
        element: <HomeView />,
        children: [
            {
                index: true,
                element: <Navigate to='/editor' />,
            },
            {
                path: 'editor',
                element: <Editor />,
            },
            {
                path: 'task-board/:id',
                element: <TaskBoardView />,
            }
        ]
    },
]

export const router = createMemoryRouter(routes);
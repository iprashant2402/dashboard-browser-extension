import { createMemoryRouter, RouteObject } from "react-router";
import { HomeView } from "../views/HomeView";
import { TaskBoardView } from "../views/TaskBoardView";
import { Editor } from "../components/Editor";

const routes: RouteObject[] = [
    {
        path: '/',
        element: <HomeView />,
        children: [
            {
                path: 'editor',
                element: <Editor />,
                index: true,
            },
            {
                path: 'task-board/:id',
                element: <TaskBoardView />,
            }
        ]
    },
]

export const router = createMemoryRouter(routes);
import { createMemoryRouter, RouteObject } from "react-router";
import { HomeView } from "../views/HomeView";
import { TaskBoardView } from "../modules/Tasks/components/TaskBoardView";
import { PageEditorNavigationController } from "../modules/Notes/components/PageEditorNavigationController";
import { PageEditor } from "../modules/Notes/components/PageEditor";

const routes: RouteObject[] = [
    {
        path: '/',
        element: <HomeView />,
        children: [
            {
                index: true,
                element: <PageEditorNavigationController />,
            },
            {
                path: 'editor/:id',
                element: <PageEditor />,
            },
            {
                path: 'task-board/:id',
                element: <TaskBoardView />,
            }
        ]
    },
]

export const router = createMemoryRouter(routes);
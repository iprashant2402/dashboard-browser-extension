import { createMemoryRouter, RouteObject } from "react-router";
import { HomeView } from "../views/HomeView";
import { TaskBoardView } from "../modules/Tasks/components/TaskBoardView";
import { PageEditorNavigationController } from "../modules/Notes/components/PageEditorNavigationController";
import { PageEditor } from "../modules/Notes/components/PageEditor";
import { ResourceReader } from "../modules/Notes/components/ResourceReader/ResourceReader";

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
                path: 'resource/:resource',
                element: <ResourceReader />,
            },
            {
                path: 'task-board/:id',
                element: <TaskBoardView />,
            }
        ]
    },
]

export const router = createMemoryRouter(routes);
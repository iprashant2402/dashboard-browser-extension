import { createBrowserRouter, createMemoryRouter, RouteObject } from "react-router";
import { HomeView } from "../views/HomeView";
import { TaskBoardView } from "../modules/Tasks/components/TaskBoardView";
import { PageEditorNavigationController } from "../modules/Notes/components/PageEditorNavigationController";
import { PageEditor } from "../modules/Notes/components/PageEditor";
import { ResourceReader } from "../modules/Notes/components/ResourceReader/ResourceReader";
import { MobileHomeView } from "../views/MobileHomeView";
import { PreferencesView } from "../views/PreferencesView";
import { getCurrentPlatform } from "../utils/helpers";

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
                path: 'home',
                element: <MobileHomeView />,
            },
            {
                path: 'preferences',
                element: <PreferencesView />,
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

const platform = getCurrentPlatform();

const createRouter = (routes: RouteObject[]) => {
    if (platform === 'EXTENSION') {
        return createMemoryRouter(routes);
    }
    return createBrowserRouter(routes);
}

export const router = createRouter(routes);
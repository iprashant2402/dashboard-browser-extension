import { createBrowserRouter, createMemoryRouter, Navigate, RouteObject } from "react-router";
import { HomeView } from "../views/HomeView";
import { PageEditorNavigationController } from "../modules/Notes/components/PageEditorNavigationController";
import { PageEditor } from "../modules/Notes/components/PageEditor";
import { ResourceReader } from "../modules/Notes/components/ResourceReader/ResourceReader";
import { MobileHomeView } from "../views/MobileHomeView";
import { PreferencesView } from "../views/PreferencesView";
import { getCurrentPlatform } from "../utils/helpers";
import { PageViewer } from "../modules/Notes/components/PageViewer";
import { AppManager } from "../AppManager";
import { AuthView } from "../modules/Auth/components/AuthView/AuthView";

const authRoutes: RouteObject = {
    path: '/auth',
    element: <AuthView />,
};

const protectedRoutes: RouteObject = {
    path: '/notebook',
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
            path: 'view/page/:id',
            element: <PageViewer />,
        }
    ]
};

const routes: RouteObject[] = [
    {
        path: '/',
        element: <AppManager />,
        children: [
            protectedRoutes,
            authRoutes,
        ]
    },
    {
        path: '*',
        element: <Navigate to="/notebook" replace />,
    }
]

const platform = getCurrentPlatform();

const createRouter = (routes: RouteObject[]) => {
    if (platform === 'EXTENSION') {
        return createMemoryRouter(routes);
    }
    return createBrowserRouter(routes);
}

export const router = createRouter(routes);
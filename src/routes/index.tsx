import {
    createBrowserRouter,
    createRoutesFromElements,
    Route,
} from "react-router-dom";

import Layout from "@/pages/Layout";
import LoginPage from "@/pages/LoginPage";
import DashboardPage from "@/pages/dashboard/DashboardPage";
import ProjectsPage from "@/pages/projects/ProjectsPage";
import WebAppPage from "@/pages/projects/frontend/WebAppPage";
import LandingPage from "@/pages/projects/frontend/LandingPage";
import ApiPage from "@/pages/projects/backend/ApiPage";
import WorkersPage from "@/pages/projects/backend/WorkersPage";
import SettingsPage from "@/pages/settings/SettingsPage";
import NotFoundPage from "@/pages/NotFoundPage";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export const router = createBrowserRouter([
    {
        path: "/login",
        element: <LoginPage />,
    },
    {
        element: <ProtectedRoute />,
        children: [
            {
                path: "/",
                element: <Layout />,
                children: [
                    {
                        index: true,
                        element: <DashboardPage />,
                    },
                    {
                        path: "projects",
                        children: [
                            {
                                index: true,
                                element: <ProjectsPage />,
                            },
                            {
                                path: "frontend",
                                children: [
                                    {
                                        path: "web-app",
                                        element: <WebAppPage />,
                                    },
                                    {
                                        path: "landing-page",
                                        element: <LandingPage />,
                                    },
                                ],
                            },
                            {
                                path: "backend",
                                children: [
                                    {
                                        path: "api",
                                        element: <ApiPage />,
                                    },
                                    {
                                        path: "workers",
                                        element: <WorkersPage />,
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        path: "settings",
                        element: <SettingsPage />,
                    },
                    {
                        path: "*",
                        element: <NotFoundPage />,
                    },
                ],
            },
        ],
    },
]);

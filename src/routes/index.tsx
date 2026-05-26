import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";

import Layout from "@/pages/Layout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

// Lazy-loaded pages — each becomes its own chunk
const LoginPage = lazy(() => import("@/pages/LoginPage"));
const DashboardPage = lazy(() => import("@/pages/dashboard/DashboardPage"));
const ProjectsPage = lazy(() => import("@/pages/projects/ProjectsPage"));
const WebAppPage = lazy(() => import("@/pages/projects/frontend/WebAppPage"));
const LandingPage = lazy(() => import("@/pages/projects/frontend/LandingPage"));
const ApiPage = lazy(() => import("@/pages/projects/backend/ApiPage"));
const WorkersPage = lazy(() => import("@/pages/projects/backend/WorkersPage"));
const SettingsPage = lazy(() => import("@/pages/settings/SettingsPage"));
const UserPage = lazy(() => import("@/pages/user/UserPage"));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"));

/** Wrap a lazy component in Suspense with a loading spinner */
const S = ({ children }: { children: React.ReactNode }) => (
    <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>
);

export const router = createBrowserRouter([
    {
        path: "/login",
        element: (
            <S>
                <LoginPage />
            </S>
        ),
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
                        element: (
                            <S>
                                <DashboardPage />
                            </S>
                        ),
                    },
                    {
                        path: "projects",
                        children: [
                            {
                                index: true,
                                element: (
                                    <S>
                                        <ProjectsPage />
                                    </S>
                                ),
                            },
                            {
                                path: "frontend",
                                children: [
                                    {
                                        path: "web-app",
                                        element: (
                                            <S>
                                                <WebAppPage />
                                            </S>
                                        ),
                                    },
                                    {
                                        path: "landing-page",
                                        element: (
                                            <S>
                                                <LandingPage />
                                            </S>
                                        ),
                                    },
                                ],
                            },
                            {
                                path: "backend",
                                children: [
                                    {
                                        path: "api",
                                        element: (
                                            <S>
                                                <ApiPage />
                                            </S>
                                        ),
                                    },
                                    {
                                        path: "workers",
                                        element: (
                                            <S>
                                                <WorkersPage />
                                            </S>
                                        ),
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        path: "settings",
                        element: (
                            <S>
                                <SettingsPage />
                            </S>
                        ),
                    },
                    {
                        path: "user",
                        element: (
                            <S>
                                <UserPage />
                            </S>
                        ),
                    },
                    {
                        path: "*",
                        element: (
                            <S>
                                <NotFoundPage />
                            </S>
                        ),
                    },
                ],
            },
        ],
    },
]);

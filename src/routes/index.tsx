import { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";

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

// admin pages
const PermissionPage = lazy(
    () => import("@/pages/admin/permission/RolePermission"),
);

const UserList = lazy(() => import("@/pages/admin/user-management/UserList"));
const CreateUser = lazy(
    () => import("@/pages/admin/user-management/CreateUser"),
);
const UpdateUser = lazy(
    () => import("@/pages/admin/user-management/UpdateUser"),
);
const LanguageManagement = lazy(
    () => import("@/pages/admin/translation/Translation"),
);

// not found page
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
                        path: "administration",
                        children: [
                            {
                                path: "permission",
                                element: (
                                    <S>
                                        <PermissionPage />
                                    </S>
                                ),
                            },
                            {
                                path: "translation",
                                element: (
                                    <S>
                                        <LanguageManagement />
                                    </S>
                                ),
                            },
                            {
                                path: "user-management",
                                handle: { activeSidebar: "user-management" },
                                children: [
                                    {
                                        index: true,
                                        element: <Navigate to="list" replace />,
                                    },
                                    {
                                        path: "list",
                                        element: (
                                            <S>
                                                <UserList />
                                            </S>
                                        ),
                                    },
                                    {
                                        path: "create",
                                        element: (
                                            <S>
                                                <CreateUser />
                                            </S>
                                        ),
                                    },
                                    {
                                        path: "update/:id",
                                        element: (
                                            <S>
                                                <UpdateUser />
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

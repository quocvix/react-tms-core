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

// Report
const InventoryReport = lazy(() => import("@/pages/report/InventoryReport"));

// Administration
const PermissionPage = lazy(() => import("@/pages/admin/permission/RolePermission"));

const UserList = lazy(() => import("@/pages/admin/user-management/UserList"));
const CreateUser = lazy(() => import("@/pages/admin/user-management/CreateUser"));
const UpdateUser = lazy(() => import("@/pages/admin/user-management/UpdateUser"));
const LanguageManagement = lazy(() => import("@/pages/admin/translation/Translation"));

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
                        handle: { breadcrumb: "Projects", isClickable: false },
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
                                handle: { breadcrumb: "Frontend", isClickable: false },
                                children: [
                                    {
                                        path: "web-app",
                                        handle: { breadcrumb: "Web App" },
                                        element: (
                                            <S>
                                                <WebAppPage />
                                            </S>
                                        ),
                                    },
                                    {
                                        path: "landing-page",
                                        handle: { breadcrumb: "Landing Page" },
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
                                handle: { breadcrumb: "Backend", isClickable: false },
                                children: [
                                    {
                                        path: "api",
                                        handle: { breadcrumb: "API" },
                                        element: (
                                            <S>
                                                <ApiPage />
                                            </S>
                                        ),
                                    },
                                    {
                                        path: "workers",
                                        handle: { breadcrumb: "Workers" },
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
                        path: "report",
                        handle: { activeSidebar: "report", breadcrumb: "Reports", isClickable: false },
                        children: [
                            {
                                index: true,
                                element: <Navigate to="inventory" replace />,
                            },
                            {
                                path: "inventory",
                                handle: { breadcrumb: "Inventory" },
                                element: (
                                    <S>
                                        <InventoryReport />
                                    </S>
                                ),
                            },
                        ],
                    },
                    {
                        path: "administration",
                        handle: { breadcrumb: "Administration", isClickable: false },
                        children: [
                            {
                                index: true,
                                element: <Navigate to="user-management/list" replace />,
                            },
                            {
                                path: "permission",
                                handle: { breadcrumb: "Role & Permission" },
                                element: (
                                    <S>
                                        <PermissionPage />
                                    </S>
                                ),
                            },
                            {
                                path: "translation",
                                handle: { breadcrumb: "Translation" },
                                element: (
                                    <S>
                                        <LanguageManagement />
                                    </S>
                                ),
                            },
                            {
                                path: "user-management",
                                handle: { activeSidebar: "user-management", breadcrumb: "User Management" },
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
                                        handle: { breadcrumb: "Create" },
                                        element: (
                                            <S>
                                                <CreateUser />
                                            </S>
                                        ),
                                    },
                                    {
                                        path: "update/:id",
                                        handle: { breadcrumb: "Update" },
                                        element: (
                                            <S>
                                                <UpdateUser mode="edit" />
                                            </S>
                                        ),
                                    },
                                    {
                                        path: "view/:id",
                                        handle: { breadcrumb: "View" },
                                        element: (
                                            <S>
                                                <UpdateUser mode="view" />
                                            </S>
                                        ),
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        path: "settings",
                        handle: { breadcrumb: "Settings" },
                        element: (
                            <S>
                                <SettingsPage />
                            </S>
                        ),
                    },
                    {
                        path: "user",
                        handle: { breadcrumb: "Profile" },
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

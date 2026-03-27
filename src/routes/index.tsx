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

export const router = createBrowserRouter(
    createRoutesFromElements(
        <>
            <Route path="/login" element={<LoginPage />} />

            <Route path="/" element={<Layout />}>
                <Route index element={<DashboardPage />} />
                <Route path="dashboard" element={<DashboardPage />} />

                <Route path="projects">
                    <Route index element={<ProjectsPage />} />
                    <Route path="frontend">
                        <Route path="web-app" element={<WebAppPage />} />
                        <Route path="landing-page" element={<LandingPage />} />
                    </Route>
                    <Route path="backend">
                        <Route path="api" element={<ApiPage />} />
                        <Route path="workers" element={<WorkersPage />} />
                    </Route>
                </Route>

                <Route path="settings" element={<SettingsPage />} />

                <Route path="*" element={<NotFoundPage />} />
            </Route>

            <Route path="*" element={<NotFoundPage />} />
        </>
    )
);
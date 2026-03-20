import {
    createBrowserRouter,
    createRoutesFromElements,
    Route,
} from "react-router-dom";

import Layout from "@/pages/Layout";
import LoginPage from "@/pages/LoginPage";

const PagePlaceholder = ({ title }: { title: string }) => (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        <div className="min-h-screen flex-1 rounded-xl bg-muted/50 md:min-h-min" />
    </div>
);

export const router = createBrowserRouter(
    createRoutesFromElements(
        <>
            <Route path="/login" element={<LoginPage />} />

            <Route path="/" element={<Layout />}>
                <Route index element={<PagePlaceholder title="Dashboard" />} />
                <Route
                    path="dashboard"
                    element={<PagePlaceholder title="Dashboard" />}
                />

                <Route path="projects">
                    <Route
                        index
                        element={<PagePlaceholder title="All Projects" />}
                    />
                    <Route path="frontend">
                        <Route
                            path="web-app"
                            element={<PagePlaceholder title="Frontend Web App" />}
                        />
                        <Route
                            path="landing-page"
                            element={
                                <PagePlaceholder title="Frontend Landing Page" />
                            }
                        />
                    </Route>
                    <Route path="backend">
                        <Route
                            path="api"
                            element={<PagePlaceholder title="Backend API" />}
                        />
                        <Route
                            path="workers"
                            element={<PagePlaceholder title="Backend Workers" />}
                        />
                    </Route>
                </Route>

                <Route
                    path="settings"
                    element={<PagePlaceholder title="Settings" />}
                />
            </Route>
        </>
    )
);
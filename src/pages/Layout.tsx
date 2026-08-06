import { LayoutHeader } from "@/components/header/LayoutHeader";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";
import { useThemeStore } from "@/stores/useThemeStore";
import { useEffect } from "react";
import { AppBreadcrumb } from "@/components/header/AppBreadcrumb";

import { useLanguageStore } from "@/stores/useLanguageStore";

const Layout = () => {
    const isDark = useThemeStore((s) => s.isDark);
    const fetchLanguages = useLanguageStore((s) => s.fetchLanguages);

    useEffect(() => {
        fetchLanguages();
    }, [fetchLanguages]);

    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [isDark]);

    return (
        <SidebarProvider>
            {/* Sidebar */}
            <AppSidebar />

            {/* Main content */}
            <SidebarInset className="overflow-hidden">
                {/* Header */}
                <LayoutHeader />

                {/* Content */}
                <div className="flex flex-1 flex-col gap-3 p-4 pt-0 min-h-0">
                    <AppBreadcrumb />
                    <Outlet />
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
};

export default Layout;

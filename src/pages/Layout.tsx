import { LayoutHeader } from "@/components/header/LayoutHeader";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";
import { useThemeStore } from "@/stores/useThemeStore";
import { useEffect } from "react";

const Layout = () => {
    const { isDark, setTheme } = useThemeStore();

    useEffect(() => {
        setTheme(isDark);
    }, [isDark]);
    
    return (
        <SidebarProvider>
            {/* Sidebar */}
            <AppSidebar />

            {/* Main content */}
            <SidebarInset>
                {/* Header */}
                <LayoutHeader />

                {/* Content */}
                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    <Outlet />
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
};

export default Layout;

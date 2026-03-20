import { LayoutHeader } from "@/components/header/LayoutHeader";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";

const Layout = () => {
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

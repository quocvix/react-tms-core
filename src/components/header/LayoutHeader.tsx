import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { NavUser, type NavUserProps } from "./nav-user";
import { Bell, Sun } from "lucide-react";
import { Button } from "../ui/button";

const MOCK_USER: NavUserProps = {
    name: "Nguyen Van A",
    email: "nguyenvana@example.com",
    avatar: "/avatars/shadcn.jpg",
};

export const LayoutHeader = () => {
    return (
        <header className="flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex w-full items-center gap-2 px-4 lg:px-6">
                {/* Sidebar toggle */}
                <SidebarTrigger className="-ml-1" />

                <Separator
                    orientation="vertical"
                    className="mx-1 my-2 self-stretch shrink-0"
                />

                {/* Page title — ideally driven by router/breadcrumb */}
                <span className="text-sm font-medium text-foreground">Dashboard</span>

                {/* Right-side actions */}
                <div className="ml-auto -mr-3 flex items-center gap-2">
                    <Button variant="ghost" size="icon-lg" className="cursor-pointer ">
                        <Bell className="h-5 w-5" />
                    </Button>

                    <Button variant="ghost" size="icon-lg" className="cursor-pointer">
                        <Sun className="h-5 w-5" />
                    </Button>

                    <Separator
                        orientation="vertical"
                        className="mx-1 my-2 self-stretch shrink-0"
                    />
                    <NavUser user={MOCK_USER} />
                </div>
            </div>
        </header>
    );
};

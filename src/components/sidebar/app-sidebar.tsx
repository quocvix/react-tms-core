"use client";

import * as React from "react";
import {
    BookOpen,
    Bot,
    Command,
    Folder,
    Frame,
    Home,
    LifeBuoy,
    Map,
    PieChart,
    Send,
    Settings,
    Settings2,
    SquareTerminal,
    Users,
} from "lucide-react";

import {
    SidebarNavItem,
    type SidebarNavItem as SidebarNavItemType,
    type SidebarNavNode,
} from "@/components/sidebar/sidebar-nav-item";
// import { NavProjects } from "@/components/sidebar/nav-projects"
// import { NavSecondary } from "@/components/sidebar/nav-secondary"
import { NavUser } from "@/components/header/nav-user";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";


export const navMain: SidebarNavNode[] = [
    {
        title: "Dashboard",
        url: "/dashboard",
        icon: Home,
        isActive: false,
    },
    {
        title: "Projects",
        icon: Folder,
        isActive: true,
        items: [
            {
                title: "Frontend",
                items: [
                    { title: "Web App", url: "/projects/frontend/web-app" },
                    {
                        title: "Landing Page",
                        url: "/projects/frontend/landing-page",
                    },
                ],
            },
            {
                title: "Backend",
                items: [
                    {
                        title: "API",
                        url: "/projects/backend/api",
                        isActive: true,
                    },
                    { title: "Workers", url: "/projects/backend/workers" },
                ],
            },
            {
                title: "All Projects",
                url: "/projects",
            },
        ],
    },
    {
        title: "Settings",
        url: "/settings",
        icon: Settings,
    },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar collapsible="icon" variant="inset" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <a href="/">
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                    <Command className="size-4" />
                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-medium">
                                        Acme Inc
                                    </span>
                                    <span className="truncate text-xs">
                                        Enterprise
                                    </span>
                                </div>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                {/* <NavMain items={data.navMain} /> */}
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {navMain.map((item) => (
                                <SidebarNavItem key={item.title} item={item} />
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
                {/* <NavUser user={data.user} /> */}
                footer
            </SidebarFooter>
        </Sidebar>
    );
}

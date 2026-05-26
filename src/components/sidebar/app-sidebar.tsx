"use client";

import * as React from "react";

import { SidebarNavItem } from "@/components/sidebar/sidebar-nav-item";
import { getSidebarMenu } from "@/lib/sidebar-data";
import { useTranslation } from "react-i18next";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";

export const AppSidebar = ({
    ...props
}: React.ComponentProps<typeof Sidebar>) => {
    const { t } = useTranslation();
    const sidebarMenu = getSidebarMenu(t);

    return (
        <Sidebar collapsible="icon" variant="inset" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <a href="/">
                                <div
                                    style={{
                                        width: "100%",
                                        aspectRatio: "16/9",
                                        overflow: "hidden",
                                    }}
                                >
                                    <img
                                        src="src/assets/images/public/404_NotFound.png"
                                        alt="Logo"
                                        width={320}
                                        height={180}
                                        loading="eager"
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "contain",
                                        }}
                                    />
                                </div>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {sidebarMenu.map((item) => (
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
};

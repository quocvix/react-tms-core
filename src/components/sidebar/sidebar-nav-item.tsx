"use client";

import * as React from "react";
import { ChevronRight, type LucideIcon } from "lucide-react";

import {
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarMenuSub,
    SidebarMenuSubItem,
    SidebarMenuSubButton,
    useSidebar,
} from "@/components/ui/sidebar";

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card";

import { cn } from "@/lib/utils";

export type SidebarNavNode = {
    title: string;
    url?: string;
    icon?: LucideIcon;
    isActive?: boolean;
    items?: SidebarNavNode[];
};

type SidebarNavItemProps = {
    item: SidebarNavNode;
};

const hasActiveDescendant = (item: SidebarNavNode): boolean => {
    if (item.isActive) return true;

    if (!item.items?.length) return false;

    return item.items.some((child) => hasActiveDescendant(child));
}

const RecursiveExpandedNode = ({
    item,
    depth = 0,
}: {
    item: SidebarNavNode;
    depth?: number;
}) => {
    const hasChildren = !!item.items?.length;
    const [open, setOpen] = React.useState(() => hasActiveDescendant(item));

    React.useEffect(() => {
        setOpen(hasActiveDescendant(item));
    }, [item.isActive, item.items]);

    if (!hasChildren) {
        return (
            <SidebarMenuSubItem>
                <SidebarMenuSubButton
                    asChild
                    isActive={item.isActive}
                    className={cn(
                        "transition-all",
                        depth > 0 && "ml-1",
                        item.isActive && "font-medium",
                    )}
                >
                    <a href={item.url ?? "#"}>
                        <span>{item.title}</span>
                    </a>
                </SidebarMenuSubButton>
            </SidebarMenuSubItem>
        );
    }

    return (
        <SidebarMenuSubItem>
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className={cn(
                    "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    hasActiveDescendant(item) &&
                        "bg-sidebar-accent text-sidebar-accent-foreground font-medium",
                )}
            >
                <span className="truncate">{item.title}</span>
                <ChevronRight
                    className={cn(
                        "ml-auto size-4 shrink-0 transition-transform duration-200",
                        open && "rotate-90",
                    )}
                />
            </button>

            {open ? (
                <SidebarMenuSub className={cn("mt-1", depth >= 0 && "ml-3")}>
                    {item.items!.map((child) => (
                        <RecursiveExpandedNode
                            key={`${depth}-${item.title}-${child.title}`}
                            item={child}
                            depth={depth + 1}
                        />
                    ))}
                </SidebarMenuSub>
            ) : null}
        </SidebarMenuSubItem>
    );
}

const CascaderPanel = ({
    items,
    level = 0,
}: {
    items: SidebarNavNode[];
    level?: number;
}) => {
    return (
        <div className="min-w-56 rounded-lg border bg-popover p-1 text-popover-foreground shadow-md">
            {items.map((subItem) => {
                const hasChildren = !!subItem.items?.length;

                if (!hasChildren) {
                    return (
                        <a
                            key={`${level}-${subItem.title}`}
                            href={subItem.url ?? "#"}
                            className={cn(
                                "flex w-full items-center rounded-md px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground",
                                subItem.isActive &&
                                    "bg-accent text-accent-foreground font-medium",
                            )}
                        >
                            {subItem.title}
                        </a>
                    );
                }

                return (
                    <HoverCard
                        key={`${level}-${subItem.title}`}
                        openDelay={60}
                        closeDelay={120}
                    >
                        <HoverCardTrigger asChild>
                            <button
                                type="button"
                                className={cn(
                                    "flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground",
                                    subItem.isActive &&
                                        "bg-accent text-accent-foreground font-medium",
                                )}
                            >
                                <span className="truncate">
                                    {subItem.title}
                                </span>
                                <ChevronRight className="size-4 shrink-0" />
                            </button>
                        </HoverCardTrigger>

                        <HoverCardContent
                            side="right"
                            align="start"
                            sideOffset={8}
                            className="w-auto border-none bg-transparent p-0 shadow-none"
                        >
                            <CascaderPanel
                                items={subItem.items!}
                                level={level + 1}
                            />
                        </HoverCardContent>
                    </HoverCard>
                );
            })}
        </div>
    );
}

export const SidebarNavItem = ({ item }: SidebarNavItemProps) => {
    const { state, isMobile } = useSidebar();
    const [open, setOpen] = React.useState(() => hasActiveDescendant(item));

    React.useEffect(() => {
        setOpen(hasActiveDescendant(item));
    }, [item.isActive, item.items]);

    const isCollapsed = state === "collapsed" && !isMobile;
    const hasChildren = !!item.items?.length;
    const Icon = item.icon;
    const isBranchActive = hasActiveDescendant(item);

    if (!Icon) return null;

    if (!hasChildren) {
        const singleItemButton = (
            <SidebarMenuButton
                asChild
                isActive={item.isActive}
                className={cn("transition-all", item.isActive && "font-medium")}
            >
                <a href={item.url ?? "#"}>
                    <Icon />
                    <span>{item.title}</span>
                </a>
            </SidebarMenuButton>
        );

        return (
            <SidebarMenuItem>
                {isCollapsed ? (
                    <TooltipProvider delayDuration={100}>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                {singleItemButton}
                            </TooltipTrigger>
                            <TooltipContent
                                side="right"
                                align="center"
                                sideOffset={8}
                            >
                                {item.title}
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                ) : (
                    singleItemButton
                )}
            </SidebarMenuItem>
        );
    }

    if (isCollapsed) {
        return (
            <SidebarMenuItem>
                <HoverCard openDelay={60} closeDelay={120}>
                    <HoverCardTrigger asChild>
                        <div>
                            <SidebarMenuButton
                                isActive={isBranchActive}
                                className={cn(
                                    "transition-all",
                                    isBranchActive && "font-medium",
                                )}
                            >
                                <Icon />
                                <span>{item.title}</span>
                            </SidebarMenuButton>
                        </div>
                    </HoverCardTrigger>

                    <HoverCardContent
                        side="right"
                        align="start"
                        sideOffset={10}
                        className="w-auto border-0 bg-transparent p-0 shadow-none"
                    >
                        <CascaderPanel items={item.items!} />
                    </HoverCardContent>
                </HoverCard>
            </SidebarMenuItem>
        );
    }

    return (
        <SidebarMenuItem>
            <SidebarMenuButton
                onClick={() => setOpen((v) => !v)}
                isActive={isBranchActive}
                className={cn(
                    "transition-all",
                    isBranchActive && "font-medium",
                )}
            >
                <Icon />
                <span>{item.title}</span>
                <ChevronRight
                    className={cn(
                        "ml-auto size-4 shrink-0 transition-transform duration-200",
                        open && "rotate-90",
                    )}
                />
            </SidebarMenuButton>

            {open ? (
                <SidebarMenuSub className="mt-1">
                    {item.items!.map((child) => (
                        <RecursiveExpandedNode
                            key={`${item.title}-${child.title}`}
                            item={child}
                            depth={0}
                        />
                    ))}
                </SidebarMenuSub>
            ) : null}
        </SidebarMenuItem>
    );
}

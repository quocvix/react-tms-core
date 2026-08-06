"use client";

import { useEffect, useState } from "react";
import { ChevronRight, type LucideIcon } from "lucide-react";
import { Link, useLocation, useMatches } from "react-router-dom";

import {
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    useSidebar,
} from "@/components/ui/sidebar";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// TYPE DEFINITIONS
// Phân biệt 2 loại item trong sidebar:
//   - SidebarLinkItem  : item có `url`, không có `children` → render thành <Link>
//   - SidebarGroupItem : item có `children`, không có `url`  → render thành accordion
//
// SidebarRootItem = item ở cấp 1 (luôn có `icon`)
// SidebarItem     = item ở cấp 2+ (không có `icon`)
// ---------------------------------------------------------------------------

type SidebarItemBase = {
    title: string;
    id?: string;
};

export type SidebarLinkItem = SidebarItemBase & {
    url: string;
    activeUrls?: string[];
    children?: never;
};

export type SidebarGroupItem = SidebarItemBase & {
    children: SidebarItem[];
    url?: never;
};

export type SidebarItem = SidebarLinkItem | SidebarGroupItem;

export type SidebarRootLinkItem = SidebarLinkItem & {
    icon: LucideIcon;
};

export type SidebarRootGroupItem = SidebarGroupItem & {
    icon: LucideIcon;
};

export type SidebarRootItem = SidebarRootLinkItem | SidebarRootGroupItem;

type SidebarNavItemProps = {
    item: SidebarRootItem;
};

type SidebarTreeNodeProps = {
    item: SidebarItem;
    pathname: string;
    nodeKey: string;
    depth?: number;
    activeSidebarId?: string;
};

type SidebarFlyoutProps = {
    items: SidebarItem[];
    pathname: string;
    parentKey: string;
    activeSidebarId?: string;
};

// ---------------------------------------------------------------------------
// TYPE GUARDS
// Dùng để phân biệt link item vs group item tại runtime.
// Không dùng `item.url !== undefined` vì TypeScript có thể không thu hẹp type.
// ---------------------------------------------------------------------------

const isLinkItem = (
    item: SidebarItem | SidebarRootItem,
): item is SidebarLinkItem | SidebarRootLinkItem => {
    return "url" in item;
};

// ---------------------------------------------------------------------------
// PATH HELPERS
// ---------------------------------------------------------------------------

/**
 * Kiểm tra xem `url` có đang active dựa trên `pathname` hoặc `activeSidebarId` hiện tại không.
 *
 * Lưu ý: Root "/" chỉ active khi exact match để tránh match với mọi route.
 * Các route khác dùng prefix match: /projects active khi pathname = /projects/active
 */
const isCurrentItem = (
    pathname: string,
    item: SidebarLinkItem | SidebarRootLinkItem,
    activeSidebarId?: string,
) => {
    if (item.id && activeSidebarId && item.id === activeSidebarId) return true;
    
    if (item.url === "/") return pathname === item.url;
    if (pathname === item.url || pathname.startsWith(`${item.url}/`)) return true;
    if (item.activeUrls) {
        return item.activeUrls.some(
            (path) => pathname === path || pathname.startsWith(`${path}/`),
        );
    }
    return false;
};

/**
 * Kiểm tra đệ quy xem item (hoặc bất kỳ child nào) có đang active không.
 * Dùng để highlight group item khi một child bên trong đang được truy cập.
 */
const hasCurrentChild = (
    pathname: string,
    item: SidebarItem | SidebarRootItem,
    activeSidebarId?: string,
): boolean => {
    if (isLinkItem(item)) {
        return isCurrentItem(pathname, item, activeSidebarId);
    }

    return item.children.some((child) => hasCurrentChild(pathname, child, activeSidebarId));
};

/**
 * Tạo React key duy nhất cho mỗi item.
 * Link item dùng `url` làm key (luôn unique).
 * Group item dùng fallback (title + index) vì không có url.
 */
const getItemKey = (item: SidebarItem | SidebarRootItem, fallback: string) => {
    return isLinkItem(item) ? item.url : fallback;
};

// ---------------------------------------------------------------------------
// INTERNAL COMPONENTS
// ---------------------------------------------------------------------------

/**
 * Wrapper đơn giản cho <Link> của react-router-dom.
 * Tách ra để tái sử dụng ở cả expanded lẫn collapsed (flyout) mode.
 */
const SidebarLink = ({
    item,
    icon,
    className,
}: {
    item: SidebarLinkItem | SidebarRootLinkItem;
    icon?: React.ReactNode;
    className?: string;
}) => {
    return (
        <Link
            to={item.url}
            className={cn("flex items-center gap-2", className)}
        >
            {icon}
            <span>{item.title}</span>
        </Link>
    );
};

/**
 * Nút toggle cho group item trong chế độ expanded.
 * Highlight khi bất kỳ child nào đang active (`active` = true).
 */
const SidebarGroupToggle = ({
    title,
    open,
    active,
    onClick,
    className,
}: {
    title: string;
    open: boolean;
    active: boolean;
    onClick: () => void;
    className?: string;
}) => {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-expanded={open}
            className={cn(
                "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                active &&
                    "bg-sidebar-accent font-medium text-sidebar-accent-foreground",
                className,
            )}
        >
            <span className="truncate">{title}</span>
            <ChevronRight
                className={cn(
                    "ml-auto size-4 shrink-0 transition-transform duration-200",
                    open && "rotate-90",
                )}
            />
        </button>
    );
};

// ---------------------------------------------------------------------------
// TREE NODE COMPONENTS
//
// ⚠️  LƯU Ý QUAN TRỌNG (Rules of Hooks):
// SidebarTreeNode được tách thành 2 component riêng biệt:
//   - SidebarTreeLeaf  : xử lý link item (không dùng hooks)
//   - SidebarTreeGroup : xử lý group item (dùng useState + useEffect)
//
// KHÔNG gộp lại thành 1 component rồi dùng early return trước khi gọi hooks,
// vì điều đó vi phạm React Rules of Hooks và gây lỗi runtime.
// ---------------------------------------------------------------------------

/**
 * Render một link item (leaf node) trong cây sidebar.
 * Active state được tính theo pathname hiện tại.
 *
 * ⚠️ className active phải được set thủ công vì SidebarMenuSubButton từ shadcn/ui
 * dùng Tailwind v4 `data-active:` selector — selector này match khi attribute
 * `data-active` CÓ MẶT trên DOM (bất kể giá trị), không phân biệt true/false.
 * Xem thêm: src/components/ui/sidebar.tsx → SidebarMenuSubButton
 */
const SidebarTreeLeaf = ({
    item,
    depth = 0,
    pathname,
    activeSidebarId,
}: {
    item: SidebarLinkItem;
    depth?: number;
    pathname: string;
    activeSidebarId?: string;
}) => {
    const active = isCurrentItem(pathname, item, activeSidebarId);

    return (
        <SidebarMenuSubItem>
            <SidebarMenuSubButton
                asChild
                isActive={active}
                className={cn(
                    "transition-all",
                    depth > 0 && "ml-1",
                    active &&
                        "bg-sidebar-accent font-medium text-accent-foreground",
                )}
            >
                <SidebarLink item={item} />
            </SidebarMenuSubButton>
        </SidebarMenuSubItem>
    );
};

/**
 * Render một group item (có children) trong cây sidebar.
 * Tự động mở accordion khi một child đang active.
 * Người dùng vẫn có thể đóng/mở thủ công.
 */
const SidebarTreeGroup = ({
    item,
    pathname,
    nodeKey,
    depth = 0,
    activeSidebarId,
}: SidebarTreeNodeProps & { item: SidebarGroupItem }) => {
    const active = hasCurrentChild(pathname, item, activeSidebarId);
    const [open, setOpen] = useState(active);

    useEffect(() => {
        // Tự động mở accordion khi navigate vào một child của group này.
        // Không tự đóng khi điều hướng ra ngoài để tránh UX khó chịu.
        if (active) setOpen(true);
    }, [active]);

    return (
        <SidebarMenuSubItem>
            <SidebarGroupToggle
                title={item.title}
                open={open}
                active={active}
                onClick={() => setOpen((prev) => !prev)}
            />

            {open && (
                <SidebarMenuSub className={cn("mx-0 mt-1 ml-3")}>
                    {item.children.map((child, index) => {
                        const childKey = getItemKey(
                            child,
                            `${nodeKey}-${index}-${child.title}`,
                        );

                        return (
                            <SidebarTreeNode
                                key={childKey}
                                item={child}
                                pathname={pathname}
                                nodeKey={childKey}
                                depth={depth + 1}
                                activeSidebarId={activeSidebarId}
                            />
                        );
                    })}
                </SidebarMenuSub>
            )}
        </SidebarMenuSubItem>
    );
};

/**
 * Dispatcher: phân loại item rồi render Leaf hoặc Group tương ứng.
 * Component này không chứa logic, chỉ là điểm phân nhánh.
 */
const SidebarTreeNode = ({
    item,
    pathname,
    nodeKey,
    depth = 0,
    activeSidebarId,
}: SidebarTreeNodeProps) => {
    if (isLinkItem(item)) {
        return (
            <SidebarTreeLeaf
                item={item}
                pathname={pathname}
                depth={depth}
                activeSidebarId={activeSidebarId}
            />
        );
    }

    return (
        <SidebarTreeGroup
            item={item}
            pathname={pathname}
            nodeKey={nodeKey}
            depth={depth}
            activeSidebarId={activeSidebarId}
        />
    );
};

// ---------------------------------------------------------------------------
// FLYOUT MENU (collapsed mode)
// Hiển thị khi sidebar bị thu gọn (icon-only).
// Dùng HoverCard để show submenu khi hover vào icon.
// Active state được tính trực tiếp trong render, không dùng state.
// ---------------------------------------------------------------------------

const SidebarFlyout = ({ items, pathname, parentKey, activeSidebarId }: SidebarFlyoutProps) => {
    return (
        <div className="min-w-56 rounded-lg border bg-popover p-1 text-popover-foreground shadow-md">
            {items.map((item, index) => {
                const itemKey = getItemKey(
                    item,
                    `${parentKey}-${index}-${item.title}`,
                );

                if (isLinkItem(item)) {
                    const active = isCurrentItem(pathname, item, activeSidebarId);

                    return (
                        <Link
                            key={itemKey}
                            to={item.url}
                            className={cn(
                                "flex w-full items-center rounded-md px-2 py-1.5 my-1 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground",
                                active &&
                                    "bg-accent font-medium text-accent-foreground",
                            )}
                        >
                            {item.title}
                        </Link>
                    );
                }

                // Group item trong flyout: dùng HoverCard lồng nhau để hiện submenu
                const active = hasCurrentChild(pathname, item, activeSidebarId);

                return (
                    <HoverCard key={itemKey} openDelay={60} closeDelay={120}>
                        <HoverCardTrigger asChild>
                            <button
                                type="button"
                                className={cn(
                                    "flex w-full items-center justify-between rounded-md px-2 py-1.5 my-1 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground",
                                    active &&
                                        "bg-accent font-medium text-accent-foreground",
                                )}
                            >
                                <span className="truncate">{item.title}</span>
                                <ChevronRight className="size-4 shrink-0" />
                            </button>
                        </HoverCardTrigger>

                        <HoverCardContent
                            side="right"
                            align="start"
                            sideOffset={8}
                            className="w-auto border-none bg-transparent p-0 shadow-none"
                        >
                            {/* Đệ quy: flyout có thể lồng flyout cho n cấp */}
                            <SidebarFlyout
                                items={item.children}
                                pathname={pathname}
                                parentKey={itemKey}
                                activeSidebarId={activeSidebarId}
                            />
                        </HoverCardContent>
                    </HoverCard>
                );
            })}
        </div>
    );
};

// ---------------------------------------------------------------------------
// MAIN EXPORT
// SidebarNavItem là entry point cho mỗi item ở cấp root (có icon).
// Xử lý 3 trường hợp:
//   1. Link item (collapsed) → icon + Tooltip
//   2. Link item (expanded)  → icon + label
//   3. Group item (collapsed) → icon + HoverCard flyout
//   4. Group item (expanded)  → icon + label + accordion
// ---------------------------------------------------------------------------

function SidebarNavGroupItem({
    item,
    collapsed,
    active,
    pathname,
    activeSidebarId,
}: {
    item: SidebarRootGroupItem;
    collapsed: boolean;
    active: boolean;
    pathname: string;
    activeSidebarId: string | undefined;
}) {
    const [open, setOpen] = useState(active);

    useEffect(() => {
        if (active) setOpen(true);
    }, [active]);

    if (collapsed) {
        return (
            <SidebarMenuItem>
                <HoverCard openDelay={60} closeDelay={120}>
                    <HoverCardTrigger asChild>
                        <div>
                            <SidebarMenuButton
                                isActive={active}
                                className={cn(
                                    "transition-all mt-1",
                                    active && "font-medium",
                                )}
                            >
                                <item.icon />
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
                        <SidebarFlyout
                            items={item.children}
                            pathname={pathname}
                            parentKey={item.title}
                            activeSidebarId={activeSidebarId}
                        />
                    </HoverCardContent>
                </HoverCard>
            </SidebarMenuItem>
        );
    }

    return (
        <SidebarMenuItem>
            <SidebarMenuButton
                isActive={active}
                onClick={() => setOpen((value) => !value)}
                aria-expanded={open}
                className={cn("my-1 transition-all", active && "font-medium")}
            >
                <item.icon />
                <span>{item.title}</span>
                <ChevronRight
                    className={cn(
                        "ml-auto size-4 shrink-0 transition-transform duration-200",
                        open && "rotate-90",
                    )}
                />
            </SidebarMenuButton>

            {open && (
                <SidebarMenuSub className="mr-0 mt-1">
                    {item.children.map((child, index) => {
                        const childKey = getItemKey(
                            child,
                            `${item.title}-${index}-${child.title}`,
                        );

                        return (
                            <SidebarTreeNode
                                key={childKey}
                                item={child}
                                pathname={pathname}
                                nodeKey={childKey}
                                activeSidebarId={activeSidebarId}
                            />
                        );
                    })}
                </SidebarMenuSub>
            )}
        </SidebarMenuItem>
    );
}

export function SidebarNavItem({ item }: SidebarNavItemProps) {
    const { pathname } = useLocation();
    const { isMobile, state } = useSidebar();
    
    const matches = useMatches();
    const matchWithSidebar = matches.reverse().find(
        // @ts-expect-error - Route handle typing
        (match) => match.handle?.activeSidebar
    );
    // @ts-expect-error - Route handle typing
    const activeSidebarId = matchWithSidebar?.handle?.activeSidebar;

    // Sidebar collapsed chỉ tính trên desktop; mobile luôn dùng expanded layout
    const collapsed = state === "collapsed" && !isMobile;

    // active = true nếu item này (hoặc bất kỳ child nào) khớp với route hiện tại
    const active = isLinkItem(item)
        ? isCurrentItem(pathname, item, activeSidebarId)
        : hasCurrentChild(pathname, item, activeSidebarId);

    // --- LINK ITEM ---
    if (isLinkItem(item)) {
        const button = (
            <SidebarMenuButton
                asChild
                isActive={active}
                className={cn("transition-all", active && "bg-sidebar-accent font-medium text-accent-foreground")}
            >
                <SidebarLink item={item} icon={<item.icon />} />
            </SidebarMenuButton>
        );

        return (
            <SidebarMenuItem>
                {/* Collapsed: hiện tooltip thay cho label */}
                {collapsed ? (
                    <TooltipProvider delayDuration={100}>
                        <Tooltip>
                            <TooltipTrigger asChild>{button}</TooltipTrigger>
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
                    button
                )}
            </SidebarMenuItem>
        );
    }

    // --- GROUP ITEM ---
    return (
        <SidebarNavGroupItem
            item={item}
            collapsed={collapsed}
            active={active}
            pathname={pathname}
            activeSidebarId={activeSidebarId}
        />
    );
}

import { useState } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Bell, Package, Truck, AlertTriangle, Info, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

export interface NotificationItem {
    id: string;
    title: string;
    description: string;
    time: string;
    read: boolean;
    type: "order" | "shipping" | "warning" | "info";
}

const MOCK_NOTIFICATIONS: NotificationItem[] = [
    {
        id: "1",
        title: "Đơn hàng mới #TMS-4521",
        description: "Khách hàng Nguyễn Văn B vừa tạo đơn hàng mới cần xử lý.",
        time: "2 phút trước",
        read: false,
        type: "order",
    },
    {
        id: "2",
        title: "Xe tải GH-12345 đã đến Hub",
        description: "Xe đã cập bến tại Hub HCM lúc 10:15.",
        time: "15 phút trước",
        read: false,
        type: "shipping",
    },
    {
        id: "3",
        title: "Cảnh báo quá tải Hub HN",
        description: "Hub Hà Nội đang vượt 90% công suất xử lý.",
        time: "1 giờ trước",
        read: false,
        type: "warning",
    },
    {
        id: "4",
        title: "Cập nhật hệ thống v2.1.0",
        description: "Hệ thống đã được nâng cấp với các tính năng mới.",
        time: "3 giờ trước",
        read: true,
        type: "info",
    },
    {
        id: "5",
        title: "Đơn hàng #TMS-4518 hoàn thành",
        description: "Đơn hàng đã được giao thành công đến người nhận.",
        time: "5 giờ trước",
        read: true,
        type: "order",
    },
    {
        id: "6",
        title: "Cảnh báo quá tải Hub HN",
        description: "Hub Hà Nội đang vượt 90% công suất xử lý.",
        time: "1 giờ trước",
        read: false,
        type: "warning",
    },
    {
        id: "7",
        title: "Cập nhật hệ thống v2.1.0",
        description: "Hệ thống đã được nâng cấp với các tính năng mới.",
        time: "3 giờ trước",
        read: false,
        type: "info",
    },
    {
        id: "8",
        title: "Đơn hàng #TMS-4518 hoàn thành",
        description: "Đơn hàng đã được giao thành công đến người nhận.",
        time: "5 giờ trước",
        read: true,
        type: "order",
    },
    {
        id: "9",
        title: "Cảnh báo quá tải Hub HN",
        description: "vượt 90% công suất xử lý.",
        time: "1 giờ trước",
        read: false,
        type: "warning",
    },
    {
        id: "10",
        title: "Cập nh v2.1.0",
        description: "Hệ thống đã ới các tính năng mới.",
        time: "3 giờ trước",
        read: false,
        type: "info",
    },
    {
        id: "11",
        title: "Đơn hàng #TMS-4518 hoàn thành",
        description: "Đơn hàng đã được giao .",
        time: "5 giờ trước",
        read: false,
        type: "order",
    },
    {
        id: "12",
        title: "Cập nhật hệ thống v2.1.0",
        description: "Hệ thống đã được nâng cấp với các tính năng mới.",
        time: "3 giờ trước",
        read: false,
        type: "info",
    },
    {
        id: "13",
        title: "Đơn hàng #TMS-4518 hoàn thành",
        description: "Đơn hàng đã được giao .",
        time: "5 giờ trước",
        read: false,
        type: "order",
    },
    {
        id: "14",
        title: "Cập nhật hệ thống v2.1.0",
        description: "Hệ thống đã được nâng cấp với các tính năng mới.",
        time: "3 giờ trước",
        read: false,
        type: "info",
    },
];

const typeIconMap = {
    order: Package,
    shipping: Truck,
    warning: AlertTriangle,
    info: Info,
};

const typeColorMap = {
    order: "text-blue-500 bg-blue-500/10 dark:bg-blue-500/20",
    shipping: "text-emerald-500 bg-emerald-500/10 dark:bg-emerald-500/20",
    warning: "text-amber-500 bg-amber-500/10 dark:bg-amber-500/20",
    info: "text-sky-500 bg-sky-500/10 dark:bg-sky-500/20",
};

const MAX_VISIBLE_HEIGHT = 340;

export function Notification() {
    const [notifications, setNotifications] =
        useState<NotificationItem[]>(MOCK_NOTIFICATIONS);
    const [parentRef, setParentRef] = useState<HTMLDivElement | null>(null);
    const { t } = useTranslation();

    const unreadCount = notifications.filter((n) => !n.read).length;

    const rowVirtualizer = useVirtualizer({
        count: notifications.length,
        getScrollElement: () => parentRef,
        estimateSize: () => 88,
    });

    const markAsRead = (id: string) => {
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
        );
    };

    const markAllAsRead = () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon-lg"
                    className="relative cursor-pointer"
                    id="notification-trigger"
                >
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <span
                            className={cn(
                                "absolute top-0 flex h-3 min-w-3 translate-x-1/2 items-center justify-center rounded-full bg-destructive px-1 py-2 text-[10px] font-bold text-destructive-foreground ring-1 ring-background",
                                unreadCount > 9 ? "right-1.5" : "right-2.5",
                            )}
                        >
                            {unreadCount > 99 ? "99+" : unreadCount}
                        </span>
                    )}
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="end"
                sideOffset={6}
                className="w-[380px] rounded-xl p-0"
            >
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3">
                    <DropdownMenuLabel className="p-0 text-sm font-semibold text-foreground">
                        {t("Notifications")}
                        {unreadCount > 0 && (
                            <span className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary/10 px-1.5 text-xs font-semibold text-primary">
                                {unreadCount}
                            </span>
                        )}
                    </DropdownMenuLabel>
                    {unreadCount > 0 && (
                        <button
                            onClick={markAllAsRead}
                            className="flex cursor-pointer items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary/10"
                        >
                            <Check className="h-3 w-3" />
                            {t("Read all")}
                        </button>
                    )}
                </div>

                <DropdownMenuSeparator className="m-0" />

                {/* Notification list */}
                {notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                        <Bell className="mb-2 h-8 w-8 opacity-40" />
                        <span className="text-sm">{t("No notifications")}</span>
                    </div>
                ) : (
                    <div
                        ref={setParentRef}
                        className="w-full overflow-y-auto"
                        style={{ maxHeight: MAX_VISIBLE_HEIGHT }}
                    >
                        <div
                            style={{
                                height: `${rowVirtualizer.getTotalSize()}px`,
                                width: "100%",
                                position: "relative",
                            }}
                        >
                            {rowVirtualizer
                                .getVirtualItems()
                                .map((virtualRow) => {
                                    const notification =
                                        notifications[virtualRow.index];
                                    const Icon = typeIconMap[notification.type];
                                    const colorClass =
                                        typeColorMap[notification.type];

                                    return (
                                        <DropdownMenuItem
                                            key={notification.id}
                                            ref={rowVirtualizer.measureElement}
                                            data-index={virtualRow.index}
                                            className={cn(
                                                "flex cursor-pointer items-start gap-3 rounded-none px-4 py-3 transition-colors",
                                                !notification.read &&
                                                    "bg-primary/[0.03] dark:bg-primary/[0.06]",
                                            )}
                                            onClick={() =>
                                                markAsRead(notification.id)
                                            }
                                            style={{
                                                position: "absolute",
                                                top: 0,
                                                left: 0,
                                                width: "100%",
                                                transform: `translateY(${virtualRow.start}px)`,
                                            }}
                                        >
                                            {/* Icon */}
                                            <div
                                                className={cn(
                                                    "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                                                    colorClass,
                                                )}
                                            >
                                                <Icon className="h-4 w-4" />
                                            </div>

                                            {/* Content */}
                                            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                                                <div className="flex items-start justify-between gap-2">
                                                    <span
                                                        className={cn(
                                                            "line-clamp-1 text-sm",
                                                            !notification.read
                                                                ? "font-semibold text-foreground"
                                                                : "font-medium text-foreground/80",
                                                        )}
                                                    >
                                                        {notification.title}
                                                    </span>
                                                    {!notification.read && (
                                                        <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                                                    )}
                                                </div>
                                                <span className="line-clamp-2 text-xs text-muted-foreground">
                                                    {notification.description}
                                                </span>
                                                <span className="mt-0.5 text-[11px] text-muted-foreground/70">
                                                    {notification.time}
                                                </span>
                                            </div>
                                        </DropdownMenuItem>
                                    );
                                })}
                        </div>
                    </div>
                )}

                <DropdownMenuSeparator className="m-0" />

                {/* Footer */}
                {/* <div className="p-2">
                    <button className="w-full cursor-pointer rounded-lg py-2 text-center text-sm font-medium text-primary transition-colors hover:bg-primary/10">
                        Xem tất cả thông báo
                    </button>
                </div> */}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

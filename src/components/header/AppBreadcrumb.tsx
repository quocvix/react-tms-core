import { Link, useLocation } from "react-router-dom";
import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { getSidebarMenu } from "@/lib/sidebar-data";
import {
    Breadcrumb,
    BreadcrumbList,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface BreadcrumbNode {
    title: string;
    url?: string;
}

const segmentMap: Record<string, string> = {
    admin: "Administration",
    permission: "Permissions",
    roles: "Roles",
    projects: "Projects",
    settings: "Settings",
    user: "Profile",
    dashboard: "Dashboard",
};

export function AppBreadcrumb() {
    const location = useLocation();
    const { t } = useTranslation();
    const menuItems = getSidebarMenu(t);

    const pathname = location.pathname;

    // Helper to find the path in the sidebar menu hierarchy
    const findActivePath = (
        items: any[],
        targetUrl: string,
        currentPath: BreadcrumbNode[] = [],
    ): BreadcrumbNode[] | null => {
        for (const item of items) {
            const itemPath = [
                ...currentPath,
                { title: item.title, url: item.url },
            ];

            if (item.url && item.url === targetUrl) {
                return itemPath;
            }

            if (item.children) {
                const match = findActivePath(
                    item.children,
                    targetUrl,
                    itemPath,
                );
                if (match) {
                    return match;
                }
            }
        }
        return null;
    };

    let items: {
        url?: string;
        label: string;
        isLast: boolean;
        isPage: boolean;
    }[] = [];

    const activePath = findActivePath(menuItems, pathname);

    if (activePath) {
        const pathItems = activePath.map((item, index) => {
            const isLast = index === activePath.length - 1;
            // A node is a page (non-clickable BreadcrumbPage) if it is the last item OR if it does not have a url
            const isPage = isLast || !item.url;
            return {
                url: item.url,
                label: item.title,
                isLast,
                isPage,
            };
        });

        items = pathItems;
    } else {
        // Fallback segment-based breadcrumbs
        const pathnames = pathname.split("/").filter((x) => x);
        items = [];

        pathnames.forEach((segment, index) => {
            const url = `/${pathnames.slice(0, index + 1).join("/")}`;
            if (segment.toLowerCase() === "dashboard") return;

            const translationKey =
                segmentMap[segment.toLowerCase()] ||
                segment.charAt(0).toUpperCase() + segment.slice(1);
            const isLast = index === pathnames.length - 1;
            items.push({
                url,
                label: t(translationKey),
                isLast,
                isPage: isLast,
            });
        });
    }

    return (
        <Breadcrumb className="pt-2">
            <BreadcrumbList>
                {items.map((item, index) => (
                    <Fragment key={item.url || index}>
                        <BreadcrumbItem>
                            {item.isPage ? (
                                <BreadcrumbPage className="text-lg font-semibold">
                                    {item.label}
                                </BreadcrumbPage>
                            ) : (
                                <BreadcrumbLink asChild>
                                    <Link
                                        className="text-lg font-semibold"
                                        to={item.url || "/"}
                                    >
                                        {item.label}
                                    </Link>
                                </BreadcrumbLink>
                            )}
                        </BreadcrumbItem>
                        {index < items.length - 1 && (
                            <BreadcrumbSeparator className="mt-1" />
                        )}
                    </Fragment>
                ))}
            </BreadcrumbList>
        </Breadcrumb>
    );
}

import {
    FolderKanban,
    LayoutDashboard,
    ReceiptText,
    Settings,
    ShieldCheck,
    Users,
} from "lucide-react";

import type { SidebarRootItem } from "@/components/sidebar/sidebar-nav-item";

export const sidebarMenu: SidebarRootItem[] = [
    {
        title: "Dashboard",
        url: "/",
        icon: LayoutDashboard,
    },
    {
        title: "Projects",
        icon: FolderKanban,
        children: [
            { title: "Overview", url: "/projects" },
            { title: "Active Projects", url: "/projects/active" },
            {
                title: "Teams",
                children: [
                    {
                        title: "Engineering",
                        url: "/projects/teams/engineering",
                    },
                    { title: "Design", url: "/projects/teams/design" },
                    { title: "Product", url: "/projects/teams/product" },
                ],
            },
            {
                title: "Archive",
                children: [
                    { title: "2025", url: "/projects/archive/2025" },
                    { title: "2024", url: "/projects/archive/2024" },
                ],
            },
        ],
    },
    {
        title: "Customers",
        icon: Users,
        children: [
            // { title: "All Customers", url: "/customers" },
            {
                title: "Segments",
                children: [
                    { title: "VIP", url: "/customers/segments/vip" },
                    { title: "New", url: "/customers/segments/new" },
                    {
                        title: "Churn Risk",
                        url: "/customers/segments/churn-risk",
                    },
                ],
            },
        ],
    },
    {
        title: "Billing",
        icon: ReceiptText,
        children: [
            { title: "Invoices", url: "/billing/invoices" },
            { title: "Subscriptions", url: "/billing/subscriptions" },
            { title: "Reports", url: "/billing/reports" },
        ],
    },
    {
        title: "Administration",
        icon: ShieldCheck,
        children: [
            { title: "Roles", url: "/admin/roles" },
            { title: "Permissions", url: "/admin/permissions" },
            { title: "Audit Logs", url: "/admin/audit-logs" },
        ],
    },
    {
        title: "Settings",
        icon: Settings,
        children: [
            { title: "Profile", url: "/settings/profile" },
            { title: "Workspace", url: "/settings/workspace" },
            {
                title: "Integrations",
                children: [
                    { title: "Slack", url: "/settings/integrations/slack" },
                    { title: "GitHub", url: "/settings/integrations/github" },
                    { title: "Google", url: "/settings/integrations/google" },
                ],
            },
        ],
    },
];

export default sidebarMenu;

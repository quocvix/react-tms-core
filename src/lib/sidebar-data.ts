import {
    FolderKanban,
    LayoutDashboard,
    ReceiptText,
    Settings,
    ShieldCheck,
    Users,
} from "lucide-react";

import type { SidebarRootItem } from "@/components/sidebar/sidebar-nav-item";
import type { TFunction } from "i18next";

export const getSidebarMenu = (t: TFunction): SidebarRootItem[] => [
    {
        title: t("Dashboard"),
        url: "/",
        icon: LayoutDashboard,
    },
    {
        title: t("Projects"),
        icon: FolderKanban,
        children: [
            { title: t("Overview"), url: "/projects" },
            { title: t("Active Projects"), url: "/projects/active" },
            {
                title: t("Teams"),
                children: [
                    {
                        title: t("Engineering"),
                        url: "/projects/teams/engineering",
                    },
                    { title: t("Design"), url: "/projects/teams/design" },
                    { title: t("Product"), url: "/projects/teams/product" },
                ],
            },
            {
                title: t("Archive"),
                children: [
                    { title: "2025", url: "/projects/archive/2025" },
                    { title: "2024", url: "/projects/archive/2024" },
                ],
            },
        ],
    },
    {
        title: t("Customers"),
        icon: Users,
        children: [
            // { title: "All Customers", url: "/customers" },
            {
                title: t("Segments"),
                children: [
                    { title: t("VIP"), url: "/customers/segments/vip" },
                    { title: t("New"), url: "/customers/segments/new" },
                    {
                        title: t("Churn Risk"),
                        url: "/customers/segments/churn-risk",
                    },
                ],
            },
        ],
    },
    {
        title: t("Billing"),
        icon: ReceiptText,
        children: [
            { title: t("Invoices"), url: "/billing/invoices" },
            { title: t("Subscriptions"), url: "/billing/subscriptions" },
            { title: t("Reports"), url: "/billing/reports" },
        ],
    },
    {
        title: t("Administration"),
        icon: ShieldCheck,
        children: [
            {
                title: t("User Management"),
                url: "/administration/user-management/list",
                id: "user-management",
            },
            {
                title: t("Role & Permission"),
                url: "/administration/permission",
            },
            {
                title: t("Translation"),
                url: "/administration/translation",
            },
            {
                title: t("Audit Logs"),
                url: "/administration/audit-logs",
            },
        ],
    },
    {
        title: t("Settings"),
        icon: Settings,
        children: [
            { title: t("Profile"), url: "/settings/profile" },
            { title: t("Workspace"), url: "/settings/workspace" },
            {
                title: t("Integrations"),
                children: [
                    { title: "Slack", url: "/settings/integrations/slack" },
                    { title: "GitHub", url: "/settings/integrations/github" },
                    { title: "Google", url: "/settings/integrations/google" },
                ],
            },
        ],
    },
];

export default getSidebarMenu;

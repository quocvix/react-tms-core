import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import { type UserListItem } from "@/services/userService";

/**
 * Hook cục bộ định nghĩa metadata các cột cho bảng User Management.
 * Chỉ chứa thông tin cấu hình thuần (title, dataIndex, key, width, sorter, ellipsis).
 * Các hàm render (UI) được cấu hình riêng tại UserList.tsx.
 */
export function useUserColumns() {
    const { t } = useTranslation();

    const columns = useMemo(
        () => [
            {
                title: t("Avatar"),
                dataIndex: "image_url",
                key: "image_url",
                width: 120,
            },
            {
                title: t("Status"),
                dataIndex: "status_name",
                key: "status_name",
                width: 100,
            },
            {
                title: t("Email"),
                dataIndex: "email",
                key: "email",
                sorter: (a: UserListItem, b: UserListItem) =>
                    a.email.localeCompare(b.email),
            },
            {
                title: t("Username"),
                dataIndex: "user_name",
                key: "user_name",
                sorter: (a: UserListItem, b: UserListItem) =>
                    a.user_name.localeCompare(b.user_name),
            },
            {
                title: t("First Name"),
                dataIndex: "first_name",
                key: "first_name",
            },
            {
                title: t("Last Name"),
                dataIndex: "last_name",
                key: "last_name",
            },
            {
                title: t("Roles"),
                dataIndex: "role",
                key: "role",
            },
            {
                title: t("Hubs"),
                dataIndex: "hubs",
                key: "hubs",
                ellipsis: true,
            },
            {
                title: t("Gender"),
                dataIndex: "gender",
                key: "gender",
                width: 80,
            },
            {
                title: t("Contact Phone"),
                dataIndex: "contact_phone",
                key: "contact_phone",
            },
            {
                title: t("Contact Email"),
                dataIndex: "contact_email",
                key: "contact_email",
            },
            {
                title: t("Created At"),
                dataIndex: "created_at",
                key: "created_at",
                width: 160,
                sorter: (a: UserListItem, b: UserListItem) =>
                    dayjs(a.created_at).unix() - dayjs(b.created_at).unix(),
            },
        ],
        [t]
    );

    return columns;
}

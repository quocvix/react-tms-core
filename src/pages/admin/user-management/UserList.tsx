import React, { useMemo, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { AntdTable, TableSlot } from "@/components/table/antd-table";
import { TableColumnSettings } from "@/components/table/table-column-settings";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import userService, { type UserListItem } from "@/services/userService";
import { useUserColumns } from "./useUserColumns";
import { useTableColumns } from "@/hooks/useTableColumns";
import { t } from "i18next";
import { Plus, Settings2, Pencil, Trash, ChevronDown } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { type ComboOption } from "@/components/select-box/select-box";
import {
    DynamicSearchBox,
    type SearchFieldConfig,
} from "@/components/search-box/dynamic-search-box";
import { STATUS, GENDER } from "@/lib/constants";
import permissionService from "@/services/permissionService";

// ─── Search Defaults ─────────────────────────────────────────────────────────
const defaultSearchParams = {
    email: "",
    user_name: "",
    first_name: "",
    last_name: "",
    gender: "",
    contact_phone: "",
    contact_email: "",
    status: "",
    role_id: "",
    created_at: "",
};

type UserSearchParams = typeof defaultSearchParams;

// ─── Dropdown Options (tĩnh) ────────────────────────────────────────────────
const statusOptions: ComboOption[] = [
    { label: t("All"), value: "" },
    ...Object.entries(STATUS).map(([key, value]) => ({
        label: value,
        value: key,
    })),
];

const genderOptions: ComboOption[] = [
    { label: t("All"), value: "" },
    ...Object.entries(GENDER).map(([key, value]) => ({
        label: value,
        value: key,
    })),
];

// ─── Search Fields Config ────────────────────────────────────────────────────
const userSearchFields: SearchFieldConfig[] = [
    { name: "email", label: t("Email"), type: "text" },
    { name: "user_name", label: t("Username"), type: "text" },
    {
        name: "status",
        label: t("Status"),
        type: "select",
        options: statusOptions,
        placeholder: t("All"),
    },
    { name: "first_name", label: t("First Name"), type: "text" },
    { name: "last_name", label: t("Last Name"), type: "text" },
    {
        name: "role_id",
        label: t("Role"),
        type: "select-search",
        placeholder: t("All"),
        clearable: true,
        fetchOptions: async () => {
            const res = await permissionService.getRoles();
            if (Array.isArray(res?.data)) {
                return [
                    { label: t("All"), value: "" },
                    ...res.data.map((role) => ({
                        label: role.name,
                        value: String(role.id),
                    })),
                ];
            }
            return [{ label: t("All"), value: "" }];
        },
    },
    {
        name: "gender",
        label: t("Gender"),
        type: "select",
        options: genderOptions,
        placeholder: t("All"),
    },
    { name: "contact_phone", label: t("Contact Phone"), type: "text" },
    { name: "contact_email", label: t("Contact Email"), type: "text" },
];

export default function UserListPage() {
    const navigate = useNavigate();

    // ─── Column Renderers ───────────────────────────────────────────────────────
    const columnRenderers = useMemo<
        Record<string, (...args: unknown[]) => React.ReactNode>
    >(
        () => ({
            email: (email: unknown, record: unknown) => {
                const r = record as UserListItem;
                return (
                    <span
                        className="text-blue-600 font-medium hover:underline cursor-pointer"
                        onClick={() =>
                            navigate(
                                `/administration/user-management/view/${r?.id}`,
                            )
                        }
                    >
                        {(email as string) ?? ""}
                    </span>
                );
            },
            image_url: (image_url: unknown, record: unknown) => {
                const url = image_url as string | null;
                const r = record as UserListItem;
                return (
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={url ?? undefined} />
                        <AvatarFallback className="text-xs">
                            {(r?.first_name?.[0] ?? "").toUpperCase()}
                            {(r?.last_name?.[0] ?? "").toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                );
            },
            status_name: (status_name: unknown, record: unknown) => {
                const r = record as UserListItem;
                const isActive = r?.status === "AC";
                return (
                    <Badge
                        variant="outline"
                        className={
                            isActive
                                ? "bg-green-500/10 text-green-500"
                                : "bg-red-500/10 text-red-500"
                        }
                    >
                        {status_name ? t(status_name as string) : ""}
                    </Badge>
                );
            },
            role: (roles: unknown) => (
                <div className="flex flex-wrap gap-1">
                    {Array.isArray(roles) ? (
                        roles.map((role) => (
                            <Badge key={role} variant="secondary" className="text-xs">
                                {role}
                            </Badge>
                        ))
                    ) : typeof roles === "string" ? (
                        <Badge variant="secondary" className="text-xs">
                            {roles}
                        </Badge>
                    ) : null}
                </div>
            ),
            gender: (gender: unknown) =>
                gender ? ((gender as string) === "MALE" ? t("Male") : t("Female")) : "",
            created_at: (date: unknown) =>
                date ? dayjs(date as string).format("DD/MM/YYYY HH:mm") : "",
        }),
        [navigate],
    );

    // ─── Search state (chỉ lưu submitted params cho API) ────────────────────
    const [submittedParams, setSubmittedParams] =
        useState<UserSearchParams>(defaultSearchParams);

    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(20);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [isCollapseSearch, setIsCollapseSearch] = useState(false);

    // ─── React Query ────────────────────────────────────────────────────────
    const { data, isLoading } = useQuery({
        queryKey: ["users", submittedParams, page, limit],
        queryFn: () =>
            userService.getUsers({
                ...submittedParams,
                page,
                limit,
            }),
    });

    const users = data?.data ?? [];

    // ─── Callbacks cho SearchBox ─────────────────────────────────────────────
    const handleSearch = useCallback((params: UserSearchParams) => {
        setSubmittedParams(params);
        setPage(1);
        setSelectedRowKeys([]);
    }, []);

    const handleReset = useCallback(() => {
        setSubmittedParams(defaultSearchParams);
        setPage(1);
        setSelectedRowKeys([]);
    }, []);

    // ─── Row Selection ──────────────────────────────────────────────────────
    const rowSelection = useMemo(
        () => ({
            selectedRowKeys,
            onChange: (newSelectedRowKeys: React.Key[]) => {
                setSelectedRowKeys(newSelectedRowKeys);
            },
        }),
        [selectedRowKeys],
    );

    // ─── Columns ────────────────────────────────────────────────────────────
    const baseColumns = useUserColumns();
    const columnsWithRender = useMemo(
        () =>
            baseColumns.map((col) => ({
                ...col,
                ...(columnRenderers[col.key]
                    ? { render: columnRenderers[col.key] }
                    : {}),
            })),
        [baseColumns, columnRenderers],
    );

    const { columns, userSettings, updateConfig, resetConfig, isUpdating } = useTableColumns("user_management", columnsWithRender);

    return (
        <div className="space-y-4">
            {/* Search Box — DynamicSearchBox với react-hook-form, zero re-render */}
            <DynamicSearchBox<UserSearchParams>
                fields={userSearchFields}
                defaultValues={defaultSearchParams}
                onSearch={handleSearch}
                onReset={handleReset}
                isCollapsed={isCollapseSearch}
            />

            {/* Table */}
            <AntdTable
                columns={columns}
                dataSource={users}
                loading={isLoading}
                rowKey="id"
                hideLeftFooter={true}
                paginationMeta={data?.meta?.pagination}
                onPageChange={(p) => setPage(p)}
                pageSize={limit}
                onPageSizeChange={(size) => {
                    setLimit(size);
                    setPage(1);
                }}
                rowSelection={rowSelection}
                showSearchToggle={true}
                isSearchCollapsed={isCollapseSearch}
                onSearchCollapseChange={setIsCollapseSearch}
                columnSettings={
                    <TableColumnSettings
                        tableId="user_management"
                        baseColumns={columnsWithRender}
                        userSettings={userSettings}
                        onSave={updateConfig}
                        onReset={resetConfig}
                        isUpdating={isUpdating}
                    />
                }
            >
                <TableSlot name="rightAction">
                    <Button
                        onClick={() =>
                            navigate("/administration/user-management/create")
                        }
                    >
                        <Plus className="" />
                        {t("Add")}
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">
                                <Settings2 className="" />
                                {t("Action")}
                                <ChevronDown className="" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem
                                disabled={selectedRowKeys.length !== 1}
                                onClick={() => {
                                    if (selectedRowKeys.length === 1) {
                                        navigate(
                                            `/administration/user-management/update/${selectedRowKeys[0]}`,
                                        );
                                    }
                                }}
                            >
                                <Pencil className="" />
                                <span>{t("Edit")}</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600 focus:text-red-600 focus:bg-red-100 dark:focus:bg-red-900">
                                <Trash className="" />
                                <span>{t("Delete")}</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </TableSlot>
            </AntdTable>
        </div>
    );
}

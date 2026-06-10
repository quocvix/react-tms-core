import React, { useMemo, useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { AntdTable, TableSlot } from "@/components/table/antd-table";
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
import UserSearchBox, {
    defaultSearchParams,
    type UserSearchParams,
} from "./UserSearchBox";

// ─── Column Renderers ───────────────────────────────────────────────────────
// Định nghĩa các hàm render riêng theo key của cột.
// Chỉ các cột cần tuỳ chỉnh hiển thị mới cần khai báo ở đây.
const columnRenderers: Record<string, (...args: unknown[]) => React.ReactNode> =
    {
        image_url: (image_url: unknown, record: unknown) => {
            const url = image_url as string | null;
            const r = record as UserListItem;
            return (
                <Avatar className="h-8 w-8">
                    <AvatarImage src={url ?? undefined} />
                    <AvatarFallback className="text-xs">
                        {(r.first_name?.[0] ?? "").toUpperCase()}
                        {(r.last_name?.[0] ?? "").toUpperCase()}
                    </AvatarFallback>
                </Avatar>
            );
        },
        status_name: (status_name: unknown, record: unknown) => {
            const r = record as UserListItem;
            const isActive = r.status === "AC";
            return (
                <Badge
                    variant="outline"
                    className={
                        isActive
                            ? "bg-green-500/10 text-green-500"
                            : "bg-red-500/10 text-red-500"
                    }
                >
                    {t(status_name as string)}
                </Badge>
            );
        },
        role: (roles: unknown) => (
            <div className="flex flex-wrap gap-1">
                {(roles as string[]).map((role) => (
                    <Badge key={role} variant="secondary" className="text-xs">
                        {role}
                    </Badge>
                ))}
            </div>
        ),
        gender: (gender: unknown) =>
            (gender as string) === "MALE" ? t("Male") : t("Female"),
        created_at: (date: unknown) =>
            dayjs(date as string).format("DD/MM/YYYY HH:mm"),
    };

export default function UserListPage() {
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
        [baseColumns],
    );
    const columns = useTableColumns("user_management", columnsWithRender);

    return (
        <div className="space-y-4">
            {/* Search Box — component riêng, gõ phím không re-render Table */}
            <UserSearchBox
                isCollapsed={isCollapseSearch}
                onSearch={handleSearch}
                onReset={handleReset}
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
            >
                <TableSlot name="rightAction">
                    <Button>
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
                            <DropdownMenuItem>
                                <Pencil className="" />
                                <span>{t("Edit", "Sửa")}</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600 focus:text-red-600 focus:bg-red-100 dark:focus:bg-red-900">
                                <Trash className="" />
                                <span>{t("Delete", "Xóa")}</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </TableSlot>
            </AntdTable>
        </div>
    );
}

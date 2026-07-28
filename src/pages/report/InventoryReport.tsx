import React, { useMemo, useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { RefreshCw } from "lucide-react";
import { AntdTable, TableSlot } from "@/components/table/antd-table";
import { Button } from "@/components/ui/button";
import { DynamicSearchBox, type SearchFieldConfig } from "@/components/search-box/dynamic-search-box";
import { useTableColumns } from "@/hooks/useTableColumns";
import inventoryReportService, {
    type InventorySearchParams,
    type InventoryReportItem,
} from "@/services/inventoryReport";
import AutocompleteWithAsync from "@/components/shadcn-space/autocomplete/autocomplete-05";

const defaultSearchParams: InventorySearchParams = {
    hub_id: "",
    item_code: "",
    item_name: "",
};

export default function InventoryReport() {
    const { t } = useTranslation();
    const queryClient = useQueryClient();

    // ─── Search Fields Config ──────────────────────────────────────────────────
    const searchFields = useMemo<SearchFieldConfig[]>(
        () => [
            {
                name: "hub_id",
                label: t("WareHouse Code"),
                type: "select-search",
                placeholder: t("All"),
                clearable: true,
                fetchOptions: async () => {
                    try {
                        const res = await inventoryReportService.getHubs();
                        const hubs = Array.isArray(res) ? res : (res?.data ?? []);
                        return [
                            { label: t("All"), value: "" },
                            ...hubs.map((hub: any) => ({
                                label: hub.name || hub.warehouse_code || hub.code || String(hub.id),
                                value: String(hub.id ?? hub.warehouse_code ?? hub.code),
                            })),
                        ];
                    } catch {
                        return [{ label: t("All"), value: "" }];
                    }
                },
            },
            {
                name: "item_code",
                label: t("Product Code"),
                type: "text",
            },
            {
                name: "item_name",
                label: t("Product Name"),
                type: "text",
            },
        ],
        [t],
    );

    // ─── Search & Pagination state ──────────────────────────────────────────────
    const [submittedParams, setSubmittedParams] = useState<InventorySearchParams>(defaultSearchParams);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(20);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [isCollapseSearch, setIsCollapseSearch] = useState(false);

    // ─── React Query ────────────────────────────────────────────────────────────
    const { data, isLoading } = useQuery({
        queryKey: ["inventory-report", submittedParams, page, limit],
        queryFn: () =>
            inventoryReportService.getList({
                ...submittedParams,
                page,
                limit,
            }),
    });

    const inventoryItems = data?.data ?? [];

    // ─── Sync Now Mutation ──────────────────────────────────────────────────────
    const syncMutation = useMutation({
        mutationFn: () => inventoryReportService.postSyncNow(),
        onSuccess: () => {
            toast.success(t("Sync successfully"));
            queryClient.invalidateQueries({ queryKey: ["inventory-report"] });
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || t("Sync failed"));
        },
    });

    // ─── Callbacks cho SearchBox ────────────────────────────────────────────────
    const handleSearch = useCallback((params: InventorySearchParams) => {
        setSubmittedParams(params);
        setPage(1);
        setSelectedRowKeys([]);
    }, []);

    const handleReset = useCallback(() => {
        setSubmittedParams(defaultSearchParams);
        setPage(1);
        setSelectedRowKeys([]);
    }, []);

    // ─── Row Selection ──────────────────────────────────────────────────────────
    const rowSelection = useMemo(
        () => ({
            selectedRowKeys,
            onChange: (newSelectedRowKeys: React.Key[]) => {
                setSelectedRowKeys(newSelectedRowKeys);
            },
        }),
        [selectedRowKeys],
    );

    // ─── Columns Definition ─────────────────────────────────────────────────────
    const baseColumns = useMemo(
        () => [
            {
                title: t("WareHouse Code"),
                dataIndex: "hub_name",
                key: "hub_name",
                width: 150,
            },
            {
                title: t("Product Code"),
                dataIndex: "item_code",
                key: "item_code",
                width: 150,
            },
            {
                title: t("Product Name"),
                dataIndex: "item_name",
                key: "item_name",
                width: 350,
            },
            {
                title: t("Ending Inventory Quantity"),
                dataIndex: "avail_qty",
                key: "avail_qty",
                width: 150,
            },
            {
                title: t("UOM"),
                dataIndex: "uom",
                key: "uom",
                width: 150,
            },
        ],
        [t],
    );

    const columns = useTableColumns("inventory_report", baseColumns);

    return (
        <div className="space-y-4">
            {/* Search Box */}
            <DynamicSearchBox<InventorySearchParams>
                fields={searchFields}
                defaultValues={defaultSearchParams}
                onSearch={handleSearch}
                onReset={handleReset}
                isCollapsed={isCollapseSearch}
            />

            <AutocompleteWithAsync />

            {/* Table */}
            <AntdTable<InventoryReportItem>
                columns={columns}
                dataSource={inventoryItems}
                loading={isLoading}
                skeletonName="inventory-report"
                rowKey={(record) => record.id ?? `${record.hub_name}-${record.item_code}`}
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
                    <Button onClick={() => syncMutation.mutate()} disabled={syncMutation.isPending}>
                        <RefreshCw className={syncMutation.isPending ? "animate-spin" : ""} />
                        {t("Sync Now")}
                    </Button>
                </TableSlot>
            </AntdTable>
        </div>
    );
}

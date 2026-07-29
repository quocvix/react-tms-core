import React, { useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { RefreshCw } from "lucide-react";
import { AntdTable, TableSlot } from "@/components/table/antd-table";
import { Button } from "@/components/ui/button";
import { DynamicSearchBox, type SearchFieldConfig } from "@/components/search-box/dynamic-search-box";
import { useTableColumns } from "@/hooks/useTableColumns";
import { useDataTable } from "@/hooks/useDataTable";
import inventoryReportService, {
    type InventorySearchParams,
    type InventoryReportItem,
} from "@/services/inventoryReport";

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
                type: "autocomplete-async",
                getValue: (item: any) => (typeof item === "string" ? item : (item?.item_name ?? item?.name ?? "")),
                getLabel: (item: any) => (typeof item === "string" ? item : (item?.item_name ?? item?.name ?? "")),
                fetchAsyncOptions: async (query: string) => {
                    if (!query) return [];
                    const res = await inventoryReportService.getItemNameAutocomplete(query);
                    return Array.isArray(res) ? res : (res?.data ?? []);
                },
            },
        ],
        [t],
    );

    // ─── DataTable Hook ─────────────────────────────────────────────────────────
    const {
        data,
        isLoading,
        page,
        setPage,
        limit,
        setLimit,
        rowSelection,
        isCollapseSearch,
        setIsCollapseSearch,
        handleSearch,
        handleReset,
    } = useDataTable<InventorySearchParams>({
        queryKey: "inventory-report",
        defaultParams: defaultSearchParams,
        fetcher: (params) => inventoryReportService.getList(params),
    });

    const inventoryItems = data?.data ?? [];

    // ─── Sync Now Mutation ──────────────────────────────────────────────────────
    const syncMutation = useMutation({
        mutationFn: () => inventoryReportService.postSyncNow({ type: "inventory" }),
        onSuccess: (response: any) => {
            toast.success(response?.data.message);
            queryClient.invalidateQueries({ queryKey: ["inventory-report"] });
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || t("Sync failed"));
        },
    });

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

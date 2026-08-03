import React, { type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { Table, ConfigProvider, theme } from "antd";
import type { TableProps } from "antd";
import { useThemeStore } from "@/stores/useThemeStore";
import { Card } from "../ui/card";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Label } from "../ui/label";
import { t } from "i18next";
import { Button } from "../ui/button";
import FileTypeExcel from "@/assets/icon/svg/file-type-excel";
import TablePagination, { type PaginationMeta } from "../pagination/pagination";
import { Eye, EyeOff } from "lucide-react";
import { TableBodySkeletonRow, TableBodySkeletonCell } from "@/components/skeleton/skeleton-table";

// Kế thừa lại toàn bộ Props chuẩn của Antd Table để dùng đầy đủ logic
interface AntdTableProps<T> extends TableProps<T> {
    hideActionTable?: boolean;
    hideLeftAction?: boolean;
    hideRightAction?: boolean;
    children?: ReactNode;
    hideFooterTable?: boolean;
    hideLeftFooter?: boolean;
    hideRightFooter?: boolean;
    paginationMeta?: PaginationMeta;
    onPageChange?: (page: number) => void;
    pageSize?: number;
    onPageSizeChange?: (size: number) => void;
    showSearchToggle?: boolean;
    isSearchCollapsed?: boolean;
    onSearchCollapseChange?: (collapsed: boolean) => void;
    borderless?: boolean;
    skeletonRowsCount?: number;
}

export function AntdTable<T extends object>({
    columns,
    dataSource,
    hideActionTable,
    hideLeftAction,
    hideRightAction,
    children,
    hideFooterTable,
    hideLeftFooter,
    hideRightFooter,
    paginationMeta,
    onPageChange,
    pageSize,
    onPageSizeChange,
    showSearchToggle,
    isSearchCollapsed,
    onSearchCollapseChange,
    borderless,
    skeletonRowsCount,
    ...props
}: AntdTableProps<T>) {
    const { isDark } = useThemeStore();

    const tableWrapperRef = useRef<HTMLDivElement>(null);
    const [tableScrollY, setTableScrollY] = useState<number | string>(400);

    useEffect(() => {
        const updateHeight = () => {
            if (!tableWrapperRef.current) return;
            const rect = tableWrapperRef.current.getBoundingClientRect();
            const headerHeight = 55; // Chiều cao dự trù của thead
            const footerHeight = hideFooterTable ? 0 : 50; // Chiều cao vùng footer-table (chứa export, pagination)
            const bottomOffset = 10 + 16 + footerHeight;

            const availableHeight = window.innerHeight - rect.top - headerHeight - bottomOffset;
            setTableScrollY(Math.max(200, availableHeight)); // Đảm bảo min height là 200px
        };

        updateHeight();
        window.addEventListener("resize", updateHeight);

        const observer = new ResizeObserver(() => {
            updateHeight();
        });
        observer.observe(document.body);

        return () => {
            window.removeEventListener("resize", updateHeight);
            observer.disconnect();
        };
    }, [hideFooterTable]);

    // ─── Determine Loading & Skeleton Body Data ──────────────────────────
    const isLoading =
        typeof props.loading === "boolean"
            ? props.loading
            : Boolean(typeof props.loading === "object" && props.loading !== null && props.loading.spinning);

    const skeletonCount = skeletonRowsCount ?? (pageSize && pageSize > 0 ? Math.min(pageSize, 10) : 8);

    const skeletonDataSource = useMemo(() => {
        return Array.from({ length: skeletonCount }).map((_, index) => ({
            key: `skeleton-row-${index}`,
            id: `skeleton-row-${index}`,
        })) as unknown as T[];
    }, [skeletonCount]);

    // Giữ nguyên columns gốc để header table không bị nhảy layout (re-measure width)
    const effectiveDataSource = isLoading ? skeletonDataSource : dataSource;
    const effectiveRowKey = isLoading ? "key" : props.rowKey;

    const effectiveRowSelection = useMemo(() => {
        if (!props.rowSelection) return undefined;
        if (isLoading) {
            return {
                ...props.rowSelection,
                getCheckboxProps: () => ({ disabled: true }),
            };
        }
        return props.rowSelection;
    }, [props.rowSelection, isLoading]);

    // Antd custom components: ghi đè duy nhất body row và body cell khi isLoading=true từ skeleton-table.tsx
    const components = useMemo(() => {
        if (!isLoading) return undefined;

        return {
            body: {
                row: TableBodySkeletonRow,
                cell: TableBodySkeletonCell,
            },
        };
    }, [isLoading]);

    // ─── Named Slots ─────────────────────────────────────────────────────
    const slots: Record<string, ReactNode> = {};
    React.Children.forEach(children, (child) => {
        if (React.isValidElement<{ name: string }>(child) && child.type === TableSlot) {
            slots[child.props.name] = child;
        }
    });

    return (
        <ConfigProvider
            theme={{
                algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
                token: {
                    fontFamily: "var(--font-sans)",
                },
                components: {
                    Table: isDark
                        ? {
                              cellPaddingInline: 12,
                              cellPaddingBlock: 10,
                              headerBg: "#172033",
                              headerColor: "#ffffff",
                              headerSplitColor: "#374151",
                              rowHoverBg: "#1a2535",
                              borderColor: "#374151",
                              colorBgContainer: "#0b1220",
                          }
                        : {
                              cellPaddingInline: 12,
                              cellPaddingBlock: 10,
                              headerBg: "#f1f5f9",
                              headerColor: "#0f172a",
                              headerSplitColor: "#cbd5e1",
                              rowHoverBg: "#f8fafc",
                              borderColor: "#cbd5e1",
                          },
                    Pagination: isDark
                        ? {
                              itemBg: "#0e1523X",
                              itemActiveBg: "#141d2b",
                          }
                        : {},
                },
            }}
        >
            <Card className={`table-box ${borderless ? "shadow-none rounded-none ring-0 bg-transparent p-0" : "p-2"}`}>
                {/* Action Table */}
                {!hideActionTable && (
                    <div className="action-table flex w-full justify-between mt-1">
                        {!hideLeftAction ? (
                            <div className="left-action flex items-center space-x-2">
                                <Select
                                    value={pageSize?.toString() ?? "20"}
                                    onValueChange={(val) => onPageSizeChange?.(Number(val))}
                                >
                                    <SelectTrigger className="w-full max-w-35">
                                        <Label>{t("Show")}:</Label>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectItem value="20">20</SelectItem>
                                            <SelectItem value="30">30</SelectItem>
                                            <SelectItem value="40">40</SelectItem>
                                            <SelectItem value="100">100</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                {showSearchToggle && (
                                    <Button
                                        variant="ghost"
                                        onClick={() => onSearchCollapseChange?.(!isSearchCollapsed)}
                                    >
                                        {isSearchCollapsed ? <EyeOff /> : <Eye />}
                                        {isSearchCollapsed ? t("Show Search Engines") : t("Hide Search Engines")}
                                    </Button>
                                )}
                                {slots.leftAction}
                            </div>
                        ) : (
                            <div />
                        )}
                        {!hideRightAction && (
                            <div className="right-action flex items-center justify-end space-x-3">
                                {slots.rightAction}
                            </div>
                        )}
                    </div>
                )}

                {/* Table */}
                <div ref={tableWrapperRef} className="w-full">
                    <Table
                        {...props}
                        columns={columns}
                        dataSource={effectiveDataSource}
                        rowKey={effectiveRowKey}
                        rowSelection={effectiveRowSelection}
                        components={components}
                        loading={false}
                        className="antd-table border border-border border-x-0"
                        scroll={{
                            x: "max-content",
                            y: tableScrollY,
                            ...(props.scroll || {}),
                        }}
                        pagination={false}
                    />
                </div>

                {/* Footer Table */}
                {!hideFooterTable && (
                    <div className="footer-table flex w-full justify-between mt-1">
                        {!hideLeftFooter ? (
                            <div className="left-footer flex items-center space-x-2">
                                <Button variant="outline">
                                    <FileTypeExcel />
                                    {t("Export")}
                                </Button>
                            </div>
                        ) : (
                            <div />
                        )}
                        {!hideRightFooter ? (
                            <div className="right-footer flex items-center justify-end space-x-2">
                                <TablePagination meta={paginationMeta} onPageChange={onPageChange} />
                            </div>
                        ) : (
                            <div />
                        )}
                    </div>
                )}
            </Card>
        </ConfigProvider>
    );
}

export function TableSlot({ children }: { name: string; children: ReactNode }) {
    return <>{children}</>;
}

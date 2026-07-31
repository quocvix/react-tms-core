import React, {
    type ReactNode,
    useEffect,
    useRef,
    useState,
} from "react";
import { Table, ConfigProvider, theme } from "antd";
import type { TableProps } from "antd";
import { useThemeStore } from "@/stores/useThemeStore";
import { Card } from "../ui/card";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import { Label } from "../ui/label";
import { t } from "i18next";
import { Button } from "../ui/button";
import FileTypeExcel from "@/assets/icon/svg/file-type-excel";
import TablePagination, { type PaginationMeta } from "../pagination/pagination";
import { Eye, EyeOff } from "lucide-react";

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
            // 16px là padding bottom của div chứa UserList mà bạn yêu cầu trừ đi
            // 16px nữa là padding dư dả cho Card hoặc khoảng cách an toàn
            const bottomOffset = 10 + 16 + footerHeight;

            const availableHeight =
                window.innerHeight - rect.top - headerHeight - bottomOffset;
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

    // ─── Named Slots ─────────────────────────────────────────────────────
    // Duyệt qua tất cả children được truyền vào giữa cặp thẻ <AntdTable>...</AntdTable>
    // Chỉ nhận những children là <TableSlot>, các phần tử khác sẽ bị bỏ qua.
    // Mỗi <TableSlot name="xxx"> sẽ được gán vào slots["xxx"] để render đúng vị trí.
    //
    // Cách sử dụng:
    //   <AntdTable>
    //     <TableSlot name="leftAction">  → render ở vùng left-action (bên cạnh Select)
    //     <TableSlot name="rightAction"> → render ở vùng right-action (góc phải)
    //   </AntdTable>
    // ─────────────────────────────────────────────────────────────────────
    const slots: Record<string, ReactNode> = {};
    React.Children.forEach(children, (child) => {
        if (
            React.isValidElement<{ name: string }>(child) &&
            child.type === TableSlot
        ) {
            slots[child.props.name] = child;
        }
    });

    return (
        <ConfigProvider
            theme={{
                // 1. Tự động chuyển đổi theo Light/Dark Mode của Shadcn (nếu có)
                algorithm: isDark
                    ? theme.darkAlgorithm
                    : theme.defaultAlgorithm,

                // 2. Map các biến màu và font của Shadcn (Tailwind) sang cho Antd
                token: {
                    fontFamily: "var(--font-sans)", // Font hệ thống của Shadcn
                },

                // 3. Tinh chỉnh riêng giao diện Table cho chuẩn Style Shadcn
                components: {
                    Table: isDark
                        ? {
                              cellPaddingInline: 12, // Thu nhỏ padding một chút cho gọn
                              cellPaddingBlock: 10,
                              headerBg: "#101826", // Màu nền header khi tối (Mặc định Antd là #1d1d1d)
                              headerColor: "#ffffff", // Màu chữ header khi tối
                              rowHoverBg: "#1a2535", // Màu khi di chuột (hover) vào dòng khi tối
                              borderColor: "#1f2937", // Màu đường kẻ giữa các ô
                              colorBgContainer: "#0b1220", // Nền của toàn bộ bảng
                          }
                        : {
                              cellPaddingInline: 12, // Thu nhỏ padding một chút cho gọn
                              cellPaddingBlock: 10,
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
            <Card
                className={`table-box ${
                    borderless
                        ? "shadow-none rounded-none ring-0 bg-transparent p-0"
                        : "p-2"
                }`}
            >
                {!hideActionTable && (
                    <div className="action-table flex w-full justify-between mt-1">
                        {!hideLeftAction ? (
                            <div className="left-action flex items-center space-x-2">
                                <Select
                                    value={pageSize?.toString() ?? "20"}
                                    onValueChange={(val) =>
                                        onPageSizeChange?.(Number(val))
                                    }
                                >
                                    <SelectTrigger className="w-full max-w-35">
                                        <Label>{t("Show")}:</Label>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectItem value="20">
                                                20
                                            </SelectItem>
                                            <SelectItem value="30">
                                                30
                                            </SelectItem>
                                            <SelectItem value="40">
                                                40
                                            </SelectItem>
                                            <SelectItem value="100">
                                                100
                                            </SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                {showSearchToggle && (
                                    <Button
                                        variant="ghost"
                                        onClick={() =>
                                            onSearchCollapseChange?.(
                                                !isSearchCollapsed,
                                            )
                                        }
                                    >
                                        {isSearchCollapsed ? (
                                            <EyeOff className="w-4 h-4 mr-2" />
                                        ) : (
                                            <Eye className="w-4 h-4 mr-2" />
                                        )}
                                        {isSearchCollapsed
                                            ? t("Show Search")
                                            : t("Hide Search")}
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

                <div ref={tableWrapperRef} className="w-full">
                    <Table
                        columns={columns}
                        dataSource={dataSource}
                        className="antd-table border border-border border-x-0"
                        {...props}
                        scroll={{
                            x: "max-content",
                            y: tableScrollY,
                            ...(props.scroll || {}),
                        }}
                        pagination={false}
                    />
                </div>
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
                                <TablePagination
                                    meta={paginationMeta}
                                    onPageChange={onPageChange}
                                />
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

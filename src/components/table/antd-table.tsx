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
import { Plus, Settings2 } from "lucide-react";
import { Button } from "../ui/button";
import FileTypeExcel from "@/assets/icon/svg/file-type-excel";
import TablePagination, { type PaginationMeta } from "../pagination/pagination";

// Kế thừa lại toàn bộ Props chuẩn của Antd Table để dùng đầy đủ logic
interface AntdTableProps<T> extends TableProps<T> {
    hideActionTable?: boolean;
    hideLeftAction?: boolean;
    hideRightAction?: boolean;
    hideFooterTable?: boolean;
    hideLeftFooter?: boolean;
    hideRightFooter?: boolean;
    paginationMeta?: PaginationMeta;
    onPageChange?: (page: number) => void;
    pageSize?: number;
    onPageSizeChange?: (size: number) => void;
}

export function AntdTable<T extends object>({
    columns,
    dataSource,
    hideActionTable,
    hideLeftAction,
    hideRightAction,
    hideFooterTable,
    hideLeftFooter,
    hideRightFooter,
    paginationMeta,
    onPageChange,
    pageSize,
    onPageSizeChange,
    ...props
}: AntdTableProps<T>) {
    const { isDark } = useThemeStore();
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
            <Card className="table-box p-2">
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
                            </div>
                        ) : (
                            <div />
                        )}
                        {!hideRightAction && (
                            <div className="right-action flex items-center justify-end space-x-3">
                                <Button variant="outline">
                                    <Plus />
                                    {t("Add")}
                                </Button>
                                <Button variant="outline">
                                    <Settings2 />
                                    {t("Actions")}
                                </Button>
                            </div>
                        )}
                    </div>
                )}

                <Table
                    columns={columns}
                    dataSource={dataSource}
                    // Thêm class để tiện tinh chỉnh CSS nếu có xung đột nhỏ với Tailwind
                    className="antd-table border border-border border-x-0"
                    {...props}
                    pagination={false}
                />
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

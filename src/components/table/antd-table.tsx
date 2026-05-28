import { Table, ConfigProvider, theme } from "antd";
import type { TableProps } from "antd";
import { useThemeStore } from "@/stores/useThemeStore";

// Kế thừa lại toàn bộ Props chuẩn của Antd Table để dùng đầy đủ logic
interface AntdTableProps<T> extends TableProps<T> {}

export function AntdTable<T extends object>({
    columns,
    dataSource,
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
            <Table
                columns={columns}
                dataSource={dataSource}
                // Thêm class để tiện tinh chỉnh CSS nếu có xung đột nhỏ với Tailwind
                className="antd-table border border-border rounded-md"
                {...props}
            />
        </ConfigProvider>
    );
}

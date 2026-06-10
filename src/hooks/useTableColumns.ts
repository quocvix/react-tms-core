import { useMemo } from "react";

// Kiểu dữ liệu cấu hình cột từ API (dùng cho tương lai)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface TableColumnConfig {
    key: string;
    width?: number;
    hidden?: boolean;
    order?: number;
}

/**
 * Hook toàn cục để quản lý cấu hình hiển thị cột của bảng.
 *
 * Hiện tại: Trả về baseColumns nguyên bản (chỉ thêm className mặc định).
 * Tương lai: Sẽ gọi API `api/v1/table-config` theo `tableId` để lấy cấu hình
 * của user (ẩn/hiện, thứ tự, width) rồi merge với baseColumns.
 *
 * @param _tableId - Định danh duy nhất cho bảng (ví dụ: "user_management")
 * @param baseColumns - Mảng cột gốc được định nghĩa tại component
 * @returns Mảng cột đã được xử lý, sẵn sàng truyền vào AntdTable
 */
export function useTableColumns<T extends Record<string, unknown>>(
    _tableId: string,
    baseColumns: T[]
): T[] {
    // TODO: Tích hợp API table-config
    // const { data: userConfig } = useQuery({
    //     queryKey: ["table-config", _tableId],
    //     queryFn: () => tableConfigService.getConfig(_tableId),
    // });

    const mergedColumns = useMemo(() => {
        // TODO: Khi có API, thực hiện merge tại đây:
        // 1. Lọc bỏ các cột có hidden = true
        // 2. Sắp xếp lại theo order
        // 3. Ghi đè width nếu user đã tuỳ chỉnh

        return baseColumns.map((col) => ({
            ...col,
            className: "whitespace-nowrap",
        }));
    }, [baseColumns]);

    return mergedColumns;
}

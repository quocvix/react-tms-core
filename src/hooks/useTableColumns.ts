import { useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { ColumnType } from "antd/es/table";
import tableConfigService from "@/services/tableConfigService";
import type { TableColumnUserSetting } from "@/types/table-config";

export type ExtendedColumnType<T> = ColumnType<T> & {
    key?: React.Key;
    dataIndex?: string | number | (string | number)[];
};

export function getColumnKey<T>(col: ExtendedColumnType<T>): string {
    if (col.key !== undefined && col.key !== null) {
        return String(col.key);
    }
    if (col.dataIndex !== undefined && col.dataIndex !== null) {
        return Array.isArray(col.dataIndex) ? col.dataIndex.join(".") : String(col.dataIndex);
    }
    if (typeof col.title === "string") {
        return col.title;
    }
    return "";
}

export function useTableColumns<T extends object>(
    tableId: string,
    baseColumns: ExtendedColumnType<T>[]
) {
    const queryClient = useQueryClient();

    // 1. Fetch user table config from API / Storage
    const { data: userSettings, isLoading } = useQuery<TableColumnUserSetting[] | null>({
        queryKey: ["table-config", tableId],
        queryFn: () => tableConfigService.getConfig(tableId),
        staleTime: 1000 * 60 * 5,
    });

    // 2. Mutation to save user table config
    const saveMutation = useMutation({
        mutationFn: (newSettings: TableColumnUserSetting[]) =>
            tableConfigService.saveConfig(tableId, newSettings),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["table-config", tableId] });
        },
    });

    // 3. Mutation to reset user table config
    const resetMutation = useMutation({
        mutationFn: () => tableConfigService.resetConfig(tableId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["table-config", tableId] });
        },
    });

    // 4. Smart Merge FE-Driven Algorithm
    const mergedColumns = useMemo(() => {
        if (!userSettings || userSettings.length === 0) {
            return baseColumns.map((col) => ({
                ...col,
                className: col.className ? `${col.className} whitespace-nowrap` : "whitespace-nowrap",
            }));
        }

        const settingsMap = new Map<string, TableColumnUserSetting>();
        userSettings.forEach((setting) => {
            if (setting.key) {
                settingsMap.set(setting.key, setting);
            }
        });

        const merged = baseColumns
            .map((col, index) => {
                const colKey = getColumnKey(col);
                const setting = settingsMap.get(colKey);

                if (!setting) {
                    // Cột MỚI do Dev thêm -> Giữ nguyên mặc định từ baseColumns
                    return {
                        ...col,
                        className: col.className ? `${col.className} whitespace-nowrap` : "whitespace-nowrap",
                        _order: index * 100,
                        _hidden: false,
                    };
                }

                // Cột ĐÃ CÓ config -> Ghi đè thuộc tính tùy chỉnh từ userSettings
                return {
                    ...col,
                    width: setting.width ?? col.width,
                    fixed: setting.fixed !== undefined ? setting.fixed : col.fixed,
                    className: col.className ? `${col.className} whitespace-nowrap` : "whitespace-nowrap",
                    _order: setting.order ?? index * 100,
                    _hidden: setting.hidden ?? false,
                };
            })
            // Lọc bỏ các cột user đã ẩn
            .filter((col) => !col._hidden)
            // Sắp xếp lại thứ tự cột theo order đã lưu
            .sort((a, b) => (a._order ?? 0) - (b._order ?? 0))
            // Clean up internal _order & _hidden props
            .map(({ _order, _hidden, ...col }) => col);

        return merged as ColumnType<T>[];
    }, [baseColumns, userSettings]);

    return {
        columns: mergedColumns,
        userSettings: userSettings ?? [],
        isLoading,
        updateConfig: saveMutation.mutate,
        resetConfig: resetMutation.mutate,
        isUpdating: saveMutation.isPending || resetMutation.isPending,
    };
}

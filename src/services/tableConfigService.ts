import type { TableColumnUserSetting, TableUserConfig } from "@/types/table-config";

const LOCAL_STORAGE_KEY_PREFIX = "tms_table_config_";

const tableConfigService = {
    /**
     * Lấy cấu hình cột theo tableId của user
     */
    getConfig: async (tableId: string): Promise<TableColumnUserSetting[] | null> => {
        try {
            // khi BE sẵn sàng API, chỉ cần uncomment dòng dưới:
            // const res = await api.get<{ data: TableUserConfig }>(`${API.URL_MASTER_DATA_V1}/table-config/${tableId}`);
            // return res.data?.data?.columns ?? null;

            const localData = localStorage.getItem(`${LOCAL_STORAGE_KEY_PREFIX}${tableId}`);
            if (localData) {
                const parsed: TableUserConfig = JSON.parse(localData);
                return parsed.columns ?? null;
            }
            return null;
        } catch (error) {
            console.warn(`[tableConfigService] Failed to load config for ${tableId}:`, error);
            return null;
        }
    },

    /**
     * Lưu cấu hình cột tùy biến của user theo tableId
     */
    saveConfig: async (tableId: string, columns: TableColumnUserSetting[]): Promise<void> => {
        try {
            // khi BE sẵn sàng API, chỉ cần uncomment dòng dưới:
            // await api.post(`${API.URL_MASTER_DATA_V1}/table-config`, { tableId, columns });

            const config: TableUserConfig = { tableId, columns };
            localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}${tableId}`, JSON.stringify(config));
        } catch (error) {
            console.error(`[tableConfigService] Failed to save config for ${tableId}:`, error);
        }
    },

    /**
     * Khôi phục về cấu hình mặc định (xóa tùy biến)
     */
    resetConfig: async (tableId: string): Promise<void> => {
        try {
            // khi BE sẵn sàng API, chỉ cần uncomment dòng dưới:
            // await api.delete(`${API.URL_MASTER_DATA_V1}/table-config/${tableId}`);

            localStorage.removeItem(`${LOCAL_STORAGE_KEY_PREFIX}${tableId}`);
        } catch (error) {
            console.error(`[tableConfigService] Failed to reset config for ${tableId}:`, error);
        }
    },
};

export default tableConfigService;

import API from "@/lib/api";
import api from "@/lib/axios";
import type { ApiResponseMeta } from "@/types/api";

export interface InventoryReportItem {
    id?: number | string;
    hub_name?: string;
    item_code?: string;
    item_name?: string;
    avail_qty?: number | string;
    uom?: string;
    [key: string]: unknown;
}

export interface InventoryReportListResponse {
    data: InventoryReportItem[];
    meta?: ApiResponseMeta;
}

export interface InventorySearchParams {
    hub_id: string;
    item_code: string;
    item_name: string;
    [key: string]: unknown;
}

const inventoryReportService = {
    getList: async (params?: Record<string, unknown> | string) => {
        if (typeof params === "string") {
            const res = await api.get<InventoryReportListResponse>(
                `${API.URL_INTERGRATION_V1}/inbound/inventory${params.startsWith("?") ? params : `?${params}`}`,
            );
            return res.data;
        }
        const res = await api.get<InventoryReportListResponse>(
            `${API.URL_INTERGRATION_V1}/inbound/inventory`,
            { params },
        );
        return res.data;
    },

    getHubs: async (params: string = "") => {
        const res = await api.get(
            `${API.URL_MASTER_DATA_V1}/gonsa/infos/hubs${params}`,
        );
        return res.data;
    },

    postSyncNow: async (data?: unknown) => {
        const res = await api.post(
            `${API.URL_INTERGRATION_V1}/inbound/sync`,
            data,
        );
        return res.data;
    },

    getItemNameAutocomplete: async (query: string = "") => {
        const res = await api.get(
            `${API.URL_MASTER_DATA_V1}/gonsa/items/auto-complete/item-name`,
            {
                params: {
                    limit: 20,
                    item_name: query,
                },
            },
        );
        return res.data;
    },
};

export default inventoryReportService;

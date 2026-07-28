import API from "@/lib/api";
import api from "@/lib/axios";

export interface InventoryReportItem {
    id?: number | string;
    hub_name?: string;
    item_code?: string;
    item_name?: string;
    avail_qty?: number | string;
    uom?: string;
    [key: string]: any;
}

export interface InventoryReportListResponse {
    data: InventoryReportItem[];
    meta?: {
        pagination?: {
            total: number;
            count: number;
            per_page: number;
            current_page: number;
            total_pages: number;
        };
    };
}

export interface InventorySearchParams {
    hub_id: string;
    item_code: string;
    item_name: string;
    [key: string]: any;
}

const inventoryReportService = {
    getList: async (params?: Record<string, any> | string) => {
        let queryString = "";
        if (typeof params === "string") {
            queryString = params;
        } else if (params) {
            const searchParams = new URLSearchParams();
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== "") {
                    searchParams.append(key, String(value));
                }
            });
            const str = searchParams.toString();
            if (str) queryString = `?${str}`;
        }
        const res = await api.get<InventoryReportListResponse>(
            API.URL_INTERGRATION_V1 + `/inbound/inventory${queryString}`,
        );
        return res.data;
    },

    getHubs: async (params: string = "") => {
        const res = await api.get(
            API.URL_MASTER_DATA_V1 + `/gonsa/infos/hubs` + params,
        );
        return res.data;
    },

    postSyncNow: async (data?: any) => {
        const res = await api.post(
            API.URL_INTERGRATION_V1 + `/inbound/sync`,
            data,
        );
        return res.data;
    },
};

export default inventoryReportService;

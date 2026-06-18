import API from "@/lib/api";
import api from "@/lib/axios";

export interface HubItem {
    id: number;
    name: string;
    code: string;
    warehouse_code: string;
    address?: string;
    location?: string;
}

export interface UserInHubsResponse {
    data: HubItem[];
}

const hubService = {
    getUserInHub: async () => {
        const res = await api.get<UserInHubsResponse>(
            API.URL_MASTER_DATA_V1 + "/gonsa/hub/user-in-hub",
        );
        return res.data;
    },

    postSelectHub: async (hub_id: number) => {
        const res = await api.put(
            API.URL_API_V1 + "/gonsa/users/selected-hub",
            {
                hub_id: hub_id,
            },
        );
        return res.data;
    },

    getAllHub: async () => {
        const res = await api.get(API.URL_MASTER_DATA_V1 + "/gonsa/hub");
        return res.data;
    },
};

export default hubService;

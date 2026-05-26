import api from "@/lib/axios";

export interface HubItem {
    id: number;
    name: string;
    code: string;
    warehouse_code: string;
}

export interface UserInHubsResponse {
    data: HubItem[];
}

const hubService = {
    getUserInHub: async () => {
        const res = await api.get<UserInHubsResponse>(
            "master-data/api/v1/gonsa/hub/user-in-hub",
        );
        return res.data;
    },

    postSelectHub: async (hub_id: number) => {
        const res = await api.put("/api/api/v1/gonsa/users/selected-hub", {
            hub_id: hub_id,
        });
        return res.data;
    },
};

export default hubService;

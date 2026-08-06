import API from "@/lib/api";
import api from "@/lib/axios";
import type {
    RolesResponse,
    PermissionResponse,
    RoleDetailResponse,
} from "@/types/role-permission";

const permissionService = {
    getRoles: async () => {
        const res = await api.get<RolesResponse>(API.URL_API_API_V1 + "/roles");
        return res.data;
    },

    getRoleDetail: async (id: number) => {
        const res = await api.get<RoleDetailResponse>(
            API.URL_API_API_V1 + `/roles/${id}`,
        );
        return res.data;
    },

    getPermission: async (params: string) => {
        const res = await api.get<PermissionResponse>(
            API.URL_API_API_V1 + `/permissions${params}`,
        );
        return res.data;
    },

    givePermission: async (roleId: number, permissions: Record<string, unknown>) => {
        const res = await api.put(
            API.URL_API_API_V1 + `/roles/${roleId}/give-permissions`,
            permissions,
        );
        return res.data;
    },

    createRole: async (data: unknown) => {
        const res = await api.post(API.URL_API_API_V1 + `/roles`, data);
        return res.data;
    },

    updateRole: async (idRole: number, data: unknown) => {
        const res = await api.put(
            API.URL_API_API_V1 + `/roles/${idRole}`,
            data,
        );
        return res.data;
    },

    deleteRole: async (idRole: number) => {
        const res = await api.delete(API.URL_API_API_V1 + `/roles/${idRole}`);
        return res.data;
    },
};

export default permissionService;

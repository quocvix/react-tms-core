import api from "@/lib/axios";
import type { PaginationMeta } from "@/types/api";

// ─── Types ──────────────────────────────────────────────────────────────────

export interface UserListItem {
    id: number;
    email: string;
    status: string;
    status_name: string;
    role: string[];
    role_ids: number[];
    user_name: string;
    gender: string;
    first_name: string;
    last_name: string;
    full_name: string;
    image_url: string | null;
    contact_email: string | null;
    contact_phone: string | null;
    code: string | null;
    location: string | null;
    department_id: number | null;
    department_name: string | null;
    neox_account: string | null;
    current_debt_amount: string;
    debt_limit: string | null;
    created_at: string;
    hubs: string;
}

export type { PaginationMeta };

export interface UserListResponse {
    data: UserListItem[];
    meta: {
        pagination: PaginationMeta;
    };
}

export interface UserListParams {
    email?: string;
    user_name?: string;
    full_name?: string;
    gender?: string;
    contact_phone?: string;
    contact_email?: string;
    created_at?: string;
    status?: string;
    last_name?: string;
    first_name?: string;
    role_id?: string;
    limit?: number;
    page?: number;
}

// ─── Service ────────────────────────────────────────────────────────────────

const userService = {
    /**
     * Lấy danh sách người dùng có phân trang và bộ lọc
     */
    getUsers: async (params?: UserListParams): Promise<UserListResponse> => {
        const res = await api.get<UserListResponse>("api/api/v1/users", {
            params,
        });
        return res.data;
    },

    /**
     * Tạo người dùng mới
     */
    createUser: async (payload: any) => {
        const res = await api.post("api/api/v1/users", payload);
        return res.data;
    },

    /**
     * Lấy chi tiết người dùng theo ID
     */
    getUserById: async (id: string) => {
        const res = await api.get(`api/api/v1/users/${id}`);
        return res.data;
    },

    /**
     * Cập nhật thông tin người dùng
     */
    updateUser: async (id: string, payload: any) => {
        const res = await api.put(`api/api/v1/users/${id}`, payload);
        return res.data;
    },
};

export default userService;

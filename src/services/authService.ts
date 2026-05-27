import api from "@/lib/axios";
import type { User } from "@/types/user";

export interface SignInRequest {
    email: string;
    password: string;
    platform: string;
    device_id: string;
}

export interface AuthResponse {
    accessToken: string;
    user: User;
}

const authService = {
    // Đăng nhập — trả về accessToken
    signIn: async (request: SignInRequest) => {
        const res = await api.post(
            "/auth/api/login",
            {
                email: request.email,
                password: request.password,
                platform: request.platform,
                device_id: request.device_id,
            },
            { withCredentials: false },
        );
        return res.data.data.token; // accessToken
    },

    // Đăng xuất — xóa refresh token phía server
    signOut: async (): Promise<void> => {
        await api.post("/auth/api/logout");
    },

    // Lấy thông tin user hiện tại (dùng khi reload trang)
    fetchMe: async (): Promise<User> => {
        const res = await api.get<{
            data: User;
        }>("auth/api/v1/users/profile");
        return res.data.data;
    },

    fetchPermission: async (): Promise<{ data: {}[] }> => {
        const res = await api.get("api/api/v1/users/permissions");
        return res.data;
    },

    // Yêu cầu gửi email reset password
    forgotPassword: async (email: string): Promise<void> => {
        await api.post("/auth/forgot-password", { email });
    },

    // Đặt lại mật khẩu bằng token được gửi qua email
    resetPassword: async (
        token: string,
        newPassword: string,
    ): Promise<void> => {
        await api.post("/auth/reset-password", { token, newPassword });
    },
};

export default authService;

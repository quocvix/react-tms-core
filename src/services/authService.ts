import api from "@/lib/axios";
import type { User } from "@/types/user";

// ─── Request / Response Types ───────────────────────────────────────────────

export interface SignInRequest {
    email: string;
    password: string;
}


export interface AuthResponse {
    accessToken: string;
    user: User;
}

// ─── Auth Service ────────────────────────────────────────────────────────────

const authService = {
    /**
     * Đăng nhập — trả về accessToken + user profile
     */
    signIn: async (username: string, password: string) => {
        const res = await api.post(
            "/auth/signin",
            {
                username,
                password,
            },
            { withCredentials: true },
        );
        return res.data; // accessToken, user
    },


    /**
     * Đăng xuất — xóa refresh token phía server
     */
    signOut: async (): Promise<void> => {
        await api.post("/auth/signout");
    },

    /**
     * Lấy thông tin user hiện tại (dùng khi reload trang)
     */
    fetchMe: async (): Promise<User> => {
        const res = await api.get<User>("/auth/me");
        return res.data;
    },

    /**
     * Yêu cầu gửi email reset password
     */
    forgotPassword: async (email: string): Promise<void> => {
        await api.post("/auth/forgot-password", { email });
    },

    /**
     * Đặt lại mật khẩu bằng token được gửi qua email
     */
    resetPassword: async (token: string, newPassword: string): Promise<void> => {
        await api.post("/auth/reset-password", { token, newPassword });
    },
};

export default authService;

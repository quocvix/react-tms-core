import authService from "@/services/authService";
import type { AuthState } from "@/types/store";
import { toast } from "sonner";
import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";

export const useAuthStore = create<AuthState>()(
    devtools(
        persist(
            (set, get) => ({
                user: null,
                accessToken: null,
                loading: false,
                hasCheckedToken: false,

                setAccessToken: (accessToken) => {
                    localStorage.setItem("access-token", accessToken);
                    set({ accessToken });
                },

                clearState: () => {
                    set({
                        accessToken: null,
                        user: null,
                        loading: false,
                        hasCheckedToken: false,
                    });
                    localStorage.clear();
                    sessionStorage.clear();
                },

                signIn: async (email, password, platform, device_id) => {
                    try {
                        get().clearState();
                        set({ loading: true });

                        // goi api
                        const accessToken = await authService.signIn({
                            email,
                            password,
                            platform,
                            device_id,
                        });

                        // luu vao store
                        get().setAccessToken(accessToken);

                        // lay thong tin nguoi dung
                        await get().fetchMe();

                        toast.success("Đăng nhập thành công!");
                    } catch (error: any) {
                        const errorMessage =
                            error.response?.data?.message ||
                            error.response?.data?.error?.message ||
                            "Đăng nhập không thành công";
                        toast.error(errorMessage);
                    } finally {
                        set({ loading: false });
                    }
                },

                signOut: async () => {
                    try {
                        set({ loading: true });

                        // goi api
                        await authService.signOut();

                        // xoa khoi store
                        get().clearState();

                        toast.success("Đăng xuất thành công!");
                    } catch (error) {
                        console.log(error);
                        toast.error("Đã có lỗi xảy ra");
                    } finally {
                        set({ loading: false });
                    }
                },

                fetchMe: async () => {
                    try {
                        set({ loading: true });

                        // goi api
                        const user = await authService.fetchMe();

                        // luu vao store
                        set({ user, hasCheckedToken: true });

                        // toast.success("Lấy thông tin người dùng thành công!");
                    } catch (error) {
                        console.log(error);
                        get().clearState();
                        toast.error(
                            "Phiên đăng nhập hết hạn, vui lòng đăng nhập lại",
                        );
                        window.location.href = "/login";
                    } finally {
                        set({ loading: false });
                    }
                },

                setCurrentHub: (hub) => {
                    const user = get().user;
                    if (user) {
                        set({
                            user: {
                                ...user,
                                info: {
                                    ...user.info,
                                    current_hub: hub,
                                },
                            },
                        });
                    }
                },
            }),
            {
                name: "auth-storage",
                partialize: (state) => ({
                    user: state.user,
                }),
            },
        ),
        { name: "AuthStore" },
    ),
);

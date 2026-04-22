import authService from "@/services/authService";
import type { AuthState } from "@/types/store";
import { toast } from "sonner";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            accessToken: null,
            loading: false,

            setAccessToken: (accessToken) => {
                set({ accessToken });
            },

            clearState: () => {
                set({
                    accessToken: null,
                    user: null,
                    loading: false,
                });
                localStorage.clear();
                sessionStorage.clear();
            },

            signIn: async (username, password) => {
                try {
                    get().clearState();
                    set({ loading: true });

                    // goi api
                    const { accessToken } = await authService.signIn(
                        username,
                        password,
                    );

                    // luu vao store
                    get().setAccessToken(accessToken);

                    // lay thong tin nguoi dung
                    await get().fetchMe();

                    toast.success("Đăng nhập thành công!");
                } catch (error) {
                    console.log(error);
                    toast.error("Đăng nhập không thành công");
                } finally {
                    set({ loading: false });
                }
            },

            signOut: async () => {
                try {
                    set({ loading: true });

                    // xoa khoi store
                    get().clearState();

                    // goi api
                    await authService.signOut();

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
                    set({ user });

                    toast.success("Lấy thông tin người dùng thành công!");
                } catch (error) {
                    console.log(error);
                    set({ user: null, accessToken: null });
                    toast.error("Lấy thông tin người dùng không thành công");
                } finally {
                    set({ loading: false });
                }
            },

        }),
        {
            name: "auth-storage",
            // Chỉ persist thông tin user, KHÔNG lưu accessToken vào localStorage
            partialize: (state) => ({ user: state.user }),
        },
    ),
);

import i18n from "@/lib/i18n";
import { LoginForm } from "@/components/auth/login-form";
import { useAuthStore } from "@/stores/useAuthStore";
import { useThemeStore } from "@/stores/useThemeStore";
import { useEffect } from "react";
import { Navigate } from "react-router-dom";

const LoginPage = () => {
    const { user } = useAuthStore();
    const token = localStorage.getItem("access-token");

    useEffect(() => {
        // Luôn sử dụng Tiếng Việt ở trang Login (dùng local i18n fallback, không gọi API languages/all-messages)
        i18n.changeLanguage("vi");

        // Không áp dụng theme dark ở trang Login (luôn hiển thị light theme)
        document.documentElement.classList.remove("dark");

        return () => {
            // Khi rời khỏi trang Login, khôi phục lại theme theo trạng thái trong store
            if (useThemeStore.getState().isDark) {
                document.documentElement.classList.add("dark");
            }
        };
    }, []);

    if (token && user) {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10 absolute inset-0 z-0 bg-gradient-purple">
            <div className="w-full max-w-sm md:max-w-4xl">
                <LoginForm />
            </div>
        </div>
    );
};

export default LoginPage;

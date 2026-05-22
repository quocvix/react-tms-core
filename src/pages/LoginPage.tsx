import { LoginForm } from "@/components/auth/login-form";
import { useAuthStore } from "@/stores/useAuthStore";
import { useThemeStore } from "@/stores/useThemeStore";
import { useEffect, useRef } from "react";
import { Navigate } from "react-router-dom";

const LoginPage = () => {
    const { user } = useAuthStore();
    const token = localStorage.getItem("access-token");
    const { isDark, setTheme } = useThemeStore();
    const wasDarkRef = useRef(isDark);

    useEffect(() => {
        wasDarkRef.current = isDark;
        if (isDark) {
            setTheme(false);
        }

        return () => {
            if (wasDarkRef.current) {
                setTheme(true);
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

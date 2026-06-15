import { useAuthStore } from "@/stores/useAuthStore";
import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";

let isFetching = false;

const ProtectedRoute = () => {
    const { loading, fetchMe, hasCheckedToken } = useAuthStore();
    const token = localStorage.getItem("access-token");
    const [starting, setStarting] = useState(true);

    // ─── Boneyard bypass (chỉ hoạt động ở DEV mode) ────────────────────────
    const isBoneyardBuild =
        import.meta.env.DEV &&
        new URLSearchParams(window.location.search).has("boneyard");

    const init = async () => {
        if (isBoneyardBuild) {
            setStarting(false);
            return;
        }

        if (!token) {
            // await refresh();
        }

        if (token && !hasCheckedToken && !isFetching) {
            isFetching = true;
            try {
                await fetchMe();
            } catch (error) {
                console.error("Failed to fetch user profile:", error);
            } finally {
                isFetching = false;
            }
        }
        setStarting(false);
    };

    useEffect(() => {
        init();
    }, []);

    if (starting || loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="w-8 h-8 animate-spin" />
            </div>
        );
    }

    if (!isBoneyardBuild && !token) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;

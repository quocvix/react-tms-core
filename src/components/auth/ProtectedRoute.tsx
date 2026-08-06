import { useAuthStore } from "@/stores/useAuthStore";
import { Loader2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
    const { loading, fetchMe, hasCheckedToken } = useAuthStore();
    const token = localStorage.getItem("access-token");
    const [starting, setStarting] = useState(true);
    const isFetchingRef = useRef(false);

    useEffect(() => {
        const init = async () => {
            if (token && !hasCheckedToken && !isFetchingRef.current) {
                isFetchingRef.current = true;
                try {
                    await fetchMe();
                } catch (error) {
                    console.error("Failed to fetch user profile:", error);
                } finally {
                    isFetchingRef.current = false;
                }
            }
            setStarting(false);
        };

        init();
    }, [token, hasCheckedToken, fetchMe]);

    if (starting || loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="w-8 h-8 animate-spin" />
            </div>
        );
    }

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;

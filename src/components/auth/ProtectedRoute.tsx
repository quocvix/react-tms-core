import { useAuthStore } from "@/stores/useAuthStore";
import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
    const { user, loading, fetchMe } = useAuthStore();
    const token = localStorage.getItem("access-token");
    const [starting, setStarting] = useState(true);

    const init = async () => {
        console.log("token", token);

        if (!token) {
            // await refresh();
        }

        if (token) {
            await fetchMe();
            console.log("fetch me");
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

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;

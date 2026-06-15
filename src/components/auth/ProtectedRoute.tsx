import { useAuthStore } from "@/stores/useAuthStore";
import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";

let isFetching = false;

const ProtectedRoute = () => {
    const { loading, fetchMe, hasCheckedToken } = useAuthStore();
    const token = localStorage.getItem("access-token");
    const isBoneyard = navigator.userAgent.includes("HeadlessChrome");
    const [starting, setStarting] = useState(true);

    const init = async () => {
        if (isBoneyard) {
            setStarting(false)
            return
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

    // if (starting || loading) {
    //     return (
    //         <div className="flex items-center justify-center h-screen">
    //             <Loader2 className="w-8 h-8 animate-spin" />
    //         </div>
    //     );
    // }

    if (!isBoneyard && (starting || loading)) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="w-8 h-8 animate-spin" />
            </div>
        );
    }

    if (!token && !isBoneyard) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;

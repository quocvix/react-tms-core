import { useEffect } from "react";
import { Toaster } from "sonner";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { useLanguageStore } from "@/stores/useLanguageStore";

function App() {
    const fetchLanguages = useLanguageStore((s) => s.fetchLanguages);

    useEffect(() => {
        fetchLanguages();
    }, [fetchLanguages]);

    return (
        <>
            <Toaster richColors position="top-right" expand={true} />
            <RouterProvider router={router} />
        </>
    );
}

export default App;


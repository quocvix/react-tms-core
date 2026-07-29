import { useEffect } from "react";
import { Toaster } from "sonner";
import { RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { router } from "./routes";
import { useLanguageStore } from "@/stores/useLanguageStore";
import { TooltipProvider } from "@/components/ui/tooltip";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 0,
            gcTime: 0,
            refetchOnWindowFocus: false,
            retry: 1,
        },
    },
});

function App() {
    const fetchLanguages = useLanguageStore((s) => s.fetchLanguages);

    useEffect(() => {
        fetchLanguages();
    }, [fetchLanguages]);

    return (
        <QueryClientProvider client={queryClient}>
            <TooltipProvider>
                <Toaster richColors position="top-right" expand={true} />
                <RouterProvider router={router} />
            </TooltipProvider>
        </QueryClientProvider>
    );
}

export default App;


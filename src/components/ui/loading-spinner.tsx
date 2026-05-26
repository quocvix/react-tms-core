import { Loader2 } from "lucide-react";

export const LoadingSpinner = () => {
    return (
        <div className="flex items-center justify-center h-full min-h-[200px]">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
    );
};

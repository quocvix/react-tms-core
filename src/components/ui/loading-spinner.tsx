import { Loader2 } from "lucide-react";

export const LoadingSpinner = () => {
    return (
        <div className="flex items-center justify-center h-full min-h-[200px] backdrop-blur-sm bg-background/10 z-10 absolute inset-0">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
    );
};

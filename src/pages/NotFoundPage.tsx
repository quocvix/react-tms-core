import { Link } from "react-router-dom";

const NotFoundPage = () => {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-6 text-center">
            <p className="text-8xl font-bold text-muted-foreground/30">404</p>
            <div className="space-y-2">
                <h1 className="text-2xl font-bold tracking-tight">
                    Page not found
                </h1>
                <p className="text-sm text-muted-foreground">
                    The page you are looking for doesn't exist or has been moved.
                </p>
            </div>
            <Link
                to="/"
                className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
            >
                Back to Home
            </Link>
        </div>
    );
};

export default NotFoundPage;

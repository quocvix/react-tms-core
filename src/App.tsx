import { Toaster } from "sonner";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";

function App() {
    return (
        <>
            <Toaster richColors position="top-right" expand={true} />
            <RouterProvider router={router} />
        </>
    );
}

export default App;

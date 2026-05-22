import { useAuthStore } from "@/stores/useAuthStore";
import { useNavigate } from "react-router";
import { LogOutIcon } from "lucide-react";
import { DropdownMenuItem } from "../ui/dropdown-menu";

export function Logout() {
    const { signOut } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await signOut();
            // navigate("/login");
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <DropdownMenuItem
            className="gap-2 cursor-pointer text-destructive focus:text-destructive"
            onClick={handleLogout}
        >
            <LogOutIcon className="h-4 w-4" />
            <span>Log out</span>
        </DropdownMenuItem>
    );
}

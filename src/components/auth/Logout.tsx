import { useAuthStore } from "@/stores/useAuthStore";
import { useNavigate } from "react-router";
import { LogOutIcon } from "lucide-react";
import { DropdownMenuItem } from "../ui/dropdown-menu";
import { useTranslation } from "react-i18next";

export function Logout() {
    const { t } = useTranslation();
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
            <span>{t("Log out")}</span>
        </DropdownMenuItem>
    );
}

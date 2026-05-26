import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Logout } from "../auth/Logout";

export type NavUserProps = {
    name: string;
    email: string;
    avatar: string;
};

export const NavUser = ({ user }: { user: NavUserProps }) => {
    const { t } = useTranslation();
    const initials = user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    type="button"
                    className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm outline-none hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring transition-colors"
                >
                    <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback className="text-xs font-semibold">
                            {initials}
                        </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-medium">
                            {user.name}
                        </span>
                        {/* <span className="truncate text-xs text-muted-foreground">
                            {user.email}
                        </span> */}
                    </div>
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                className="w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={6}
            >
                <DropdownMenuLabel className="p-0 font-normal">
                    <div className="flex items-center gap-2 px-2 py-2 text-left">
                        <Avatar className="h-8 w-8 rounded-lg">
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback className="rounded-lg text-xs font-semibold">
                                {initials}
                            </AvatarFallback>
                        </Avatar>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                            <span className="truncate font-semibold">
                                {user.name}
                            </span>
                            <span className="truncate text-xs text-muted-foreground">
                                {user.email}
                            </span>
                        </div>
                    </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                    <DropdownMenuItem className="gap-2 cursor-pointer" asChild>
                        <Link to="/user">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span>{t("Profile")}</span>
                        </Link>
                    </DropdownMenuItem>
                    {/* <DropdownMenuItem className="gap-2 cursor-pointer">
                        <SettingsIcon className="h-4 w-4 text-muted-foreground" />
                        <span>Settings</span>
                    </DropdownMenuItem> */}
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                {/* <DropdownMenuItem className="gap-2 cursor-pointer text-destructive focus:text-destructive">
                    <LogOutIcon className="h-4 w-4" />
                    <span>Log out</span>
                </DropdownMenuItem> */}
                <Logout />
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

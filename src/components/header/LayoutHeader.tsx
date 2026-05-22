import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { NavUser, type NavUserProps } from "./nav-user";
import { Moon, Sun, Warehouse, Languages, Check } from "lucide-react";
import { Button } from "../ui/button";
import { Notification } from "./notification";
import { useThemeStore } from "@/stores/useThemeStore";
import { useAuthStore } from "@/stores/useAuthStore";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

const MOCK_USER: NavUserProps = {
    name: "Nguyen Van A",
    email: "nguyenvana@example.com",
    avatar: "/avatars/shadcn.jpg",
};

const HUB_LIST = [
    { value: "HCM", label: "HCM" },
    { value: "HN", label: "Hà Nội" },
    { value: "DN", label: "Đà Nẵng" },
];

const LANGUAGE_LIST = [
    { value: "vi", label: "Tiếng Việt", flag: "🇻🇳" },
    { value: "en", label: "English", flag: "🇺🇸" },
];

export const LayoutHeader = () => {
    const { isDark, toggleTheme } = useThemeStore();
    const { user } = useAuthStore();
    const [selectedHub, setSelectedHub] = useState("HCM");
    const [selectedLang, setSelectedLang] = useState("vi");

    const currentHub = HUB_LIST.find((h) => h.value === selectedHub);
    const currentLang = LANGUAGE_LIST.find((l) => l.value === selectedLang);

    const displayUser = user
        ? {
              name: user.full_name,
              email: user.email || "",
              avatar: user.image || "/avatars/shadcn.jpg",
          }
        : MOCK_USER;

    console.log(user);

    return (
        <header className="flex h-14 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex w-full items-center gap-2 px-4 lg:px-6">
                {/* Sidebar toggle */}
                <SidebarTrigger className="-ml-1" />

                <Separator
                    orientation="vertical"
                    className="mx-1 my-3 self-stretch shrink-0"
                />

                {/* Page title — ideally driven by router/breadcrumb */}
                <span className="text-sm font-medium text-foreground">
                    Dashboard
                </span>

                {/* Right-side actions */}
                <div className="ml-auto -mr-3 flex items-center gap-2">
                    <Notification />

                    {/* Hub dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="cursor-pointer gap-1.5 text-sm"
                            >
                                <Warehouse className="h-4 w-4" />
                                <span>{currentHub?.label}</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            align="end"
                            sideOffset={6}
                            className="w-44 rounded-lg"
                        >
                            <DropdownMenuLabel>Chọn Hub</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {HUB_LIST.map((hub) => (
                                <DropdownMenuItem
                                    key={hub.value}
                                    className="cursor-pointer gap-2"
                                    onClick={() => setSelectedHub(hub.value)}
                                >
                                    <Warehouse className="h-4 w-4 text-muted-foreground" />
                                    <span>{hub.label}</span>
                                    {selectedHub === hub.value && (
                                        <Check className="ml-auto h-4 w-4 text-primary" />
                                    )}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Language dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="cursor-pointer gap-1.5 text-sm"
                            >
                                <Languages className="h-4 w-4" />
                                <span>
                                    {currentLang?.flag} {currentLang?.label}
                                </span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            align="end"
                            sideOffset={6}
                            className="w-44 rounded-lg"
                        >
                            <DropdownMenuLabel>Ngôn ngữ</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {LANGUAGE_LIST.map((lang) => (
                                <DropdownMenuItem
                                    key={lang.value}
                                    className="cursor-pointer gap-2"
                                    onClick={() => setSelectedLang(lang.value)}
                                >
                                    <span>{lang.flag}</span>
                                    <span>{lang.label}</span>
                                    {selectedLang === lang.value && (
                                        <Check className="ml-auto h-4 w-4 text-primary" />
                                    )}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Button
                        variant="ghost"
                        size="icon-lg"
                        className="cursor-pointer"
                        onClick={toggleTheme}
                    >
                        {isDark ? (
                            <Sun className="h-5 w-5" />
                        ) : (
                            <Moon className="h-5 w-5" />
                        )}
                    </Button>

                    <Separator
                        orientation="vertical"
                        className="mx-1 my-3 self-stretch shrink-0"
                    />

                    <NavUser user={displayUser} />
                </div>
            </div>
        </header>
    );
};

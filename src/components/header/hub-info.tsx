import { useAuthStore } from "@/stores/useAuthStore";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Warehouse, Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useEffect, useState, useRef } from "react";
import hubService, { type HubItem } from "@/services/hubService";

const HubInfo = () => {
    const { t } = useTranslation();
    const { user, setCurrentHub } = useAuthStore();
    const [hubs, setHubs] = useState<HubItem[]>([]);
    const [loading, setLoading] = useState(false);
    const fetchedRef = useRef(false);

    useEffect(() => {
        if (fetchedRef.current) return;
        fetchedRef.current = true;

        const fetchHubs = async () => {
            try {
                setLoading(true);
                const res = await hubService.getUserInHub();
                const hubData = res.data || [];
                setHubs(hubData);

                // Khi getUserInHub xong, tìm hub hiện tại và lưu vào localStorage + store
                let hubId = localStorage.getItem("hub_id");
                if (!hubId && user?.info?.current_hub) {
                    const currentHubVal = user.info.current_hub;
                    hubId = String(typeof currentHubVal === "object" ? currentHubVal.id : currentHubVal);
                }

                if (hubId) {
                    const matchedHub = hubData.find(h => String(h.id) === hubId);
                    if (matchedHub) {
                        if (user?.info?.current_hub?.id !== matchedHub.id) {
                            setCurrentHub(matchedHub);
                        }
                        localStorage.setItem("hub_id", String(matchedHub.id));
                    }
                } else if (hubData.length > 0) {
                    const defaultHub = hubData[0];
                    if (user?.info?.current_hub?.id !== defaultHub.id) {
                        setCurrentHub(defaultHub);
                    }
                    localStorage.setItem("hub_id", String(defaultHub.id));
                }
            } catch (error) {
                console.error("Failed to fetch hubs:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchHubs();
    }, []);

    const handleSelectHub = async (hub: HubItem) => {
        if (loading) return;
        const currentHubId = user?.info?.current_hub?.id;
        if (currentHubId === hub.id) return;

        try {
            setLoading(true);
            await hubService.postSelectHub(hub.id);
            setCurrentHub(hub);
            localStorage.setItem("hub_id", String(hub.id));
            window.location.reload();
        } catch (error) {
            console.error("Failed to select hub:", error);
        } finally {
            setLoading(false);
        }
    };

    if (!user?.info?.current_hub) return null;
    const currentHub = user.info.current_hub;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    className="cursor-pointer gap-1.5 text-sm"
                    disabled={loading}
                >
                    <Warehouse className="h-4 w-4" />
                    <span>{currentHub?.name}</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="end"
                sideOffset={6}
                className="w-44 rounded-lg"
            >
                <DropdownMenuLabel>{t("Select Hub")}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {hubs.map((hub) => (
                    <DropdownMenuItem
                        key={hub.id}
                        className="cursor-pointer gap-2"
                        onClick={() => handleSelectHub(hub)}
                    >
                        <Warehouse className="h-4 w-4 text-muted-foreground" />
                        <span>{hub.name}</span>
                        {currentHub.id === hub.id && (
                            <Check className="ml-auto h-4 w-4 text-primary" />
                        )}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default HubInfo;

import { useState, useCallback, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RotateCcw, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { t } from "i18next";
import { STATUS, GENDER } from "@/lib/constants";
import {
    SelectBox,
    type ComboOption,
} from "@/components/select-box/select-box";
import { SelectSearchBox } from "@/components/select-box/select-search-box";
import permissionService from "@/services/permissionService";

// ─── Dropdown Options (tĩnh, chỉ tạo 1 lần) ────────────────────────────────
const statusOptions: ComboOption[] = [
    { label: t("All"), value: "" },
    ...Object.entries(STATUS).map(([key, value]) => ({
        label: value,
        value: key,
    })),
];

const genderOptions: ComboOption[] = [
    { label: t("All"), value: "" },
    ...Object.entries(GENDER).map(([key, value]) => ({
        label: value,
        value: key,
    })),
];

// ─── Default Values ──────────────────────────────────────────────────────────
export const defaultSearchParams = {
    email: "",
    user_name: "",
    first_name: "",
    last_name: "",
    gender: "",
    contact_phone: "",
    contact_email: "",
    status: "",
    role_id: "",
    created_at: "",
};

export type UserSearchParams = typeof defaultSearchParams;

// ─── Props ───────────────────────────────────────────────────────────────────
interface UserSearchBoxProps {
    isCollapsed: boolean;
    onSearch: (params: UserSearchParams) => void;
    onReset: () => void;
}

/**
 * Component Search Box tách riêng.
 * Quản lý form state nội bộ → gõ phím chỉ re-render search box,
 * không ảnh hưởng đến AntdTable bên dưới.
 */
export default function UserSearchBox({
    isCollapsed,
    onSearch,
    onReset,
}: UserSearchBoxProps) {
    const [form, setForm] = useState(defaultSearchParams);
    const [roleOptions, setRoleOptions] = useState<ComboOption[]>([
        { label: t("All"), value: "" }
    ]);

    useEffect(() => {
        permissionService.getRoles()
            .then((res) => {
                if (res?.data) {
                    const options = res.data.map((role) => ({
                        label: role.name,
                        value: String(role.id),
                    }));
                    setRoleOptions([{ label: t("All"), value: "" }, ...options]);
                }
            })
            .catch((err) => console.error("Error fetching roles:", err));
    }, []);

    const handleInputChange = useCallback((field: string, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    }, []);

    const handleSearch = useCallback(() => {
        onSearch(form);
    }, [form, onSearch]);

    const handleReset = useCallback(() => {
        setForm(defaultSearchParams);
        onReset();
    }, [onReset]);

    return (
        <Card
            className={`search-box grid gap-4 p-4 transition-all duration-300 overflow-hidden ${
                isCollapsed ? "hidden" : "grid-cols-6"
            }`}
        >
            <div className="flex flex-col gap-2">
                <Label>{t("Email")}</Label>
                <Input
                    value={form.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                />
            </div>
            <div className="flex flex-col gap-2">
                <Label>{t("Username")}</Label>
                <Input
                    value={form.user_name}
                    onChange={(e) =>
                        handleInputChange("user_name", e.target.value)
                    }
                />
            </div>
            <div className="flex flex-col gap-2">
                <Label>{t("Status")}</Label>
                <SelectBox
                    value={form.status}
                    options={statusOptions}
                    onChange={(val) => handleInputChange("status", val)}
                    placeholder={t("All")}
                />
            </div>
            <div className="flex flex-col gap-2">
                <Label>{t("First Name")}</Label>
                <Input
                    value={form.first_name}
                    onChange={(e) =>
                        handleInputChange("first_name", e.target.value)
                    }
                />
            </div>
            <div className="flex flex-col gap-2">
                <Label>{t("Last Name")}</Label>
                <Input
                    value={form.last_name}
                    onChange={(e) =>
                        handleInputChange("last_name", e.target.value)
                    }
                />
            </div>
            <div className="flex flex-col gap-2">
                <Label>{t("Role")}</Label>
                <SelectSearchBox
                    value={form.role_id}
                    options={roleOptions}
                    onChange={(val) => handleInputChange("role_id", val)}
                    placeholder={t("All")}
                    clearable
                />
            </div>
            <div className="flex flex-col gap-2">
                <Label>{t("Gender")}</Label>
                <SelectBox
                    value={form.gender}
                    options={genderOptions}
                    onChange={(val) => handleInputChange("gender", val)}
                    placeholder={t("All")}
                />
            </div>
            <div className="flex flex-col gap-2">
                <Label>{t("Contact Phone")}</Label>
                <Input
                    value={form.contact_phone}
                    onChange={(e) =>
                        handleInputChange("contact_phone", e.target.value)
                    }
                />
            </div>
            <div className="flex flex-col gap-2">
                <Label>{t("Contact Email")}</Label>
                <Input
                    value={form.contact_email}
                    onChange={(e) =>
                        handleInputChange("contact_email", e.target.value)
                    }
                />
            </div>
            <div className="flex items-end justify-start space-x-2">
                <Button variant="outline" onClick={handleReset}>
                    <RotateCcw />
                    {t("Reset")}
                </Button>
                <Button variant="default" onClick={handleSearch}>
                    <Search />
                    {t("Search")}
                </Button>
            </div>
        </Card>
    );
}

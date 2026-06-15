import { useState } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import { useQuery } from "@tanstack/react-query";
import { t } from "i18next";
import { RotateCcw, Search, Trash2 } from "lucide-react";

import { AntdTable } from "@/components/table/antd-table";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import languageService, { type LanguageItem } from "@/services/translationService";

export default function LanguageManagement() {
    const { permission } = useAuthStore();

    // ─── Permission Check ───────────────────────────────────────────────────
    const hasPermission = permission?.data?.some(
        (p: any) => p === "language.view" || p?.name === "language.view",
    );

    // ─── Search state ───────────────────────────────────────────────────────
    const defaultParams = {
        message: "",
        translate: "",
        lg_type: "FE",
        language_code: "vi",
    };

    const [searchParams, setSearchParams] = useState(defaultParams);
    const [appliedParams, setAppliedParams] = useState(defaultParams);

    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(20);

    // ─── React Query ────────────────────────────────────────────────────────
    const { data, isLoading } = useQuery({
        queryKey: ["languagesTable", appliedParams, page, limit],
        queryFn: () =>
            languageService.getLanguagesTable({
                ...appliedParams,
                page,
                limit,
            }),
        enabled: hasPermission,
    });

    // ─── Handlers ───────────────────────────────────────────────────────────
    const handleInputChange = (field: string, value: string) => {
        setSearchParams((prev) => ({ ...prev, [field]: value }));
    };

    const handleSearch = () => {
        setAppliedParams(searchParams);
        setPage(1);
    };

    const handleReset = () => {
        setSearchParams(defaultParams);
        setAppliedParams(defaultParams);
        setPage(1);
    };

    // ─── Columns ────────────────────────────────────────────────────────────
    const columns = [
        {
            title: t("Nhãn"), // Message
            dataIndex: "message",
            key: "message",
            width: "35%",
        },
        {
            title: t("Dịch"), // Translation
            dataIndex: "translate",
            key: "translate",
            width: "45%",
        },
        {
            title: t("Ngôn ngữ"),
            dataIndex: "language_code",
            key: "language_code",
            width: "10%",
            render: (text: string) => (
                <span className="uppercase font-medium text-xs bg-muted px-2 py-1 rounded">
                    {text}
                </span>
            ),
        },
        {
            title: t("Hành động"),
            key: "action",
            width: "10%",
            render: (_: any, record: any) => (
                <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => console.log("Delete", record)}>
                    <Trash2 className="h-4 w-4" />
                </Button>
            ),
        },
    ];

    if (!hasPermission) {
        return (
            <div className="flex items-center justify-center h-full w-full">
                <div className="p-8 text-center text-destructive bg-destructive/10 rounded-lg font-semibold max-w-md">
                    {t("You do not have permission to access this page.")}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Search Box */}
            <Card className="search-box grid grid-cols-6 gap-4 p-4">
                <div className="flex flex-col">
                    <Label>{t("Loại ngôn ngữ")}</Label>
                    <Select
                        value={searchParams.lg_type}
                        onValueChange={(val) => {
                            handleInputChange("lg_type", val);
                            setAppliedParams(prev => ({ ...prev, lg_type: val }));
                            setPage(1);
                        }}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder={t("Loại ngôn ngữ")} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="FE">{t("Người dùng")}</SelectItem>
                            <SelectItem value="BE">{t("Hệ thống")}</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex flex-col">
                    <Label>{t("Nhãn")}</Label>
                    <Input
                        placeholder={t("Nhập nhãn cần tìm")}
                        value={searchParams.message}
                        onChange={(e) =>
                            handleInputChange("message", e.target.value)
                        }
                        onKeyDown={(e) => {
                            if (e.key === "Enter") handleSearch();
                        }}
                    />
                </div>
                <div className="flex flex-col">
                    <Label>{t("Dịch")}</Label>
                    <Input
                        placeholder={t("Nhập nội dung dịch")}
                        value={searchParams.translate}
                        onChange={(e) =>
                            handleInputChange("translate", e.target.value)
                        }
                        onKeyDown={(e) => {
                            if (e.key === "Enter") handleSearch();
                        }}
                    />
                </div>
                <div className="flex items-end justify-start space-x-2">
                    <Button variant="outline" onClick={handleReset}>
                        <RotateCcw className="mr-2 h-4 w-4" />
                        {t("Reset")}
                    </Button>
                    <Button variant="default" onClick={handleSearch}>
                        <Search className="mr-2 h-4 w-4" />
                        {t("Search")}
                    </Button>
                </div>
            </Card>

            {/* Table */}
            <AntdTable
                columns={columns.map((col) => ({
                    ...col,
                    className: "whitespace-nowrap",
                }))}
                dataSource={data?.data ?? []}
                loading={isLoading}
                rowKey="lg_id"
                scroll={{ x: "max-content", y: "calc(100vh - 280px)" }}
                hideLeftFooter={true}
                paginationMeta={data?.meta?.pagination}
                onPageChange={(p) => setPage(p)}
                pageSize={limit}
                onPageSizeChange={(size) => {
                    setLimit(size);
                    setPage(1);
                }}
            />
        </div>
    );
}

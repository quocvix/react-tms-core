import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { AntdTable } from "@/components/table/antd-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import userService, { type UserListItem } from "@/services/userService";
import { t } from "i18next";
import { RotateCcw, Search } from "lucide-react";

export default function UserListPage() {
    // ─── Search state ───────────────────────────────────────────────────────
    const [searchParams, setSearchParams] = useState({
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
    });

    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(20);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

    // ─── React Query ────────────────────────────────────────────────────────
    const { data, isLoading } = useQuery({
        queryKey: ["users", searchParams, page, limit],
        queryFn: () =>
            userService.getUsers({
                ...searchParams,
                page,
                limit,
            }),
    });

    const users = data?.data ?? [];

    // ─── Hàm xử lý input ───────────────────────────────────────────────────
    const handleInputChange = (field: string, value: string) => {
        setSearchParams((prev) => ({ ...prev, [field]: value }));
    };

    const handleReset = () => {
        setSearchParams({
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
        });
        setPage(1);
        setSelectedRowKeys([]);
    };

    // ─── Row Selection ──────────────────────────────────────────────────────
    const rowSelection = {
        selectedRowKeys,
        onChange: (newSelectedRowKeys: React.Key[]) => {
            setSelectedRowKeys(newSelectedRowKeys);
        },
    };

    // ─── Columns ────────────────────────────────────────────────────────────
    const columns = [
        {
            title: t("Avatar"),
            dataIndex: "image_url",
            key: "image_url",
            width: 120,
            render: (image_url: string | null, record: UserListItem) => (
                <Avatar className="h-8 w-8">
                    <AvatarImage src={image_url ?? undefined} />
                    <AvatarFallback className="text-xs">
                        {(record.first_name?.[0] ?? "").toUpperCase()}
                        {(record.last_name?.[0] ?? "").toUpperCase()}
                    </AvatarFallback>
                </Avatar>
            ),
        },
        {
            title: t("Status"),
            dataIndex: "status_name",
            key: "status_name",
            width: 100,
            render: (status_name: string, record: UserListItem) => {
                const isActive = record.status === "AC";
                return (
                    <Badge
                        variant="outline"
                        className={
                            isActive
                                ? "bg-green-500/10 text-green-500"
                                : "bg-red-500/10 text-red-500"
                        }
                    >
                        {status_name}
                    </Badge>
                );
            },
        },
        {
            title: t("Email"),
            dataIndex: "email",
            key: "email",
            sorter: (a: UserListItem, b: UserListItem) =>
                a.email.localeCompare(b.email),
        },
        {
            title: t("Username"),
            dataIndex: "user_name",
            key: "user_name",
            sorter: (a: UserListItem, b: UserListItem) =>
                a.user_name.localeCompare(b.user_name),
        },
        {
            title: t("First Name"),
            dataIndex: "first_name",
            key: "first_name",
        },
        {
            title: t("Last Name"),
            dataIndex: "last_name",
            key: "last_name",
        },
        {
            title: t("Roles"),
            dataIndex: "role",
            key: "role",
            render: (roles: string[]) => (
                <div className="flex flex-wrap gap-1">
                    {roles.map((role) => (
                        <Badge
                            key={role}
                            variant="secondary"
                            className="text-xs"
                        >
                            {role}
                        </Badge>
                    ))}
                </div>
            ),
        },
        {
            title: t("Hubs"),
            dataIndex: "hubs",
            key: "hubs",
            ellipsis: true,
        },
        {
            title: t("Gender"),
            dataIndex: "gender",
            key: "gender",
            width: 80,
            render: (gender: string) =>
                gender === "MALE" ? t("Male") : t("Female"),
        },
        {
            title: t("Contact Phone"),
            dataIndex: "contact_phone",
            key: "contact_phone",
        },
        {
            title: t("Contact Email"),
            dataIndex: "contact_email",
            key: "contact_email",
        },
        {
            title: t("Created At"),
            dataIndex: "created_at",
            key: "created_at",
            width: 160,
            sorter: (a: UserListItem, b: UserListItem) =>
                dayjs(a.created_at).unix() - dayjs(b.created_at).unix(),
            render: (date: string) => dayjs(date).format("DD/MM/YYYY HH:mm"),
        },
    ];

    return (
        <div className="space-y-4">
            {/* Search Box */}
            <Card className="search-box grid grid-cols-6 gap-4 p-4">
                <div className="flex flex-col">
                    <Label>{t("Email")}</Label>
                    <Input
                        placeholder={t("Search")}
                        value={searchParams.email}
                        onChange={(e) =>
                            handleInputChange("email", e.target.value)
                        }
                    />
                </div>
                <div className="flex flex-col">
                    <Label>{t("Username")}</Label>
                    <Input
                        placeholder={t("Search")}
                        value={searchParams.user_name}
                        onChange={(e) =>
                            handleInputChange("user_name", e.target.value)
                        }
                    />
                </div>
                <div className="flex flex-col">
                    <Label>{t("First Name")}</Label>
                    <Input
                        placeholder={t("Search")}
                        value={searchParams.first_name}
                        onChange={(e) =>
                            handleInputChange("first_name", e.target.value)
                        }
                    />
                </div>
                <div className="flex flex-col">
                    <Label>{t("Last Name")}</Label>
                    <Input
                        placeholder={t("Search")}
                        value={searchParams.last_name}
                        onChange={(e) =>
                            handleInputChange("last_name", e.target.value)
                        }
                    />
                </div>
                <div className="flex flex-col">
                    <Label>{t("Status")}</Label>
                    <Input
                        placeholder={t("Search")}
                        value={searchParams.status}
                        onChange={(e) =>
                            handleInputChange("status", e.target.value)
                        }
                    />
                </div>
                <div className="flex flex-col">
                    <Label>{t("Contact Phone")}</Label>
                    <Input
                        placeholder={t("Search")}
                        value={searchParams.contact_phone}
                        onChange={(e) =>
                            handleInputChange("contact_phone", e.target.value)
                        }
                    />
                </div>
                <div className="flex flex-col">
                    <Label>{t("Contact Email")}</Label>
                    <Input
                        placeholder={t("Search")}
                        value={searchParams.contact_email}
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
                    <Button variant="default">
                        <Search />
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
                dataSource={users}
                loading={isLoading}
                rowKey="id"
                scroll={{ x: "max-content", y: 80 * 5 }}
                hideLeftFooter={true}
                paginationMeta={data?.meta?.pagination}
                onPageChange={(p) => setPage(p)}
                pageSize={limit}
                onPageSizeChange={(size) => {
                    setLimit(size);
                    setPage(1);
                }}
                rowSelection={rowSelection}
            />
        </div>
    );
}

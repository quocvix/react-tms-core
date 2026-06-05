import { AntdTable } from "@/components/table/antd-table";
import { Badge } from "@/components/ui/badge"; // Vẫn dùng Badge của Shadcn bình thường
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { t } from "i18next";
import { Plus, RotateCcw, Search } from "lucide-react";

// 1. Định nghĩa cấu trúc dữ liệu Chuyến xe
interface OrderData {
    key: string;
    code: string;
    driver: string;
    weight: number;
    status: "pending" | "shipping" | "done";
}

export default function UserListPage() {
    // 2. Cấu hình các cột (Kèm logic Sắp xếp & Lọc ăn liền của Antd)
    const columns = [
        {
            title: "Mã Vận Đơn",
            dataIndex: "code",
            key: "code",
            sorter: (a: OrderData, b: OrderData) =>
                a.code.localeCompare(b.code),
        },
        {
            title: "Tài Xế",
            dataIndex: "driver",
            key: "driver",
        },
        {
            title: "Khối Lượng (kg)",
            dataIndex: "weight",
            key: "weight",
            // Logic sắp xếp số thực tế của Antd
            sorter: (a: OrderData, b: OrderData) => a.weight - b.weight,
        },
        {
            title: "Trạng Thái",
            dataIndex: "status",
            key: "status",
            // Logic Bộ lọc (Filter) bấm cái ăn ngay tại đầu cột của Antd
            filters: [
                { text: "Chờ tài", value: "pending" },
                { text: "Đang chạy", value: "shipping" },
                { text: "Hoàn thành", value: "done" },
            ],
            onFilter: (value: any, record: OrderData) =>
                record.status === value,
            // Kết hợp bọc Component Badge của Shadcn UI vào trong ô của Antd
            render: (status: OrderData["status"]) => {
                if (status === "shipping")
                    return (
                        <Badge
                            variant="outline"
                            className="bg-blue-500/10 text-blue-500"
                        >
                            Đang chạy
                        </Badge>
                    );
                if (status === "done")
                    return (
                        <Badge
                            variant="outline"
                            className="bg-green-500/10 text-green-500"
                        >
                            Hoàn thành
                        </Badge>
                    );
                return <Badge variant="secondary">Chờ tài</Badge>;
            },
        },
    ];

    // 3. Dữ liệu giả lập
    const data: OrderData[] = [
        {
            key: "1",
            code: "ORD-992",
            driver: "Nguyễn Văn A",
            weight: 1500,
            status: "shipping",
        },
        {
            key: "2",
            code: "ORD-102",
            driver: "Trần Văn B",
            weight: 800,
            status: "pending",
        },
        {
            key: "3",
            code: "ORD-504",
            driver: "Lê Văn C",
            weight: 2300,
            status: "done",
        },
    ];

    return (
        <div className="space-y-4">
            {/* Search Box */}
            <Card className="search-box grid grid-cols-6 gap-4 p-4">
                <div className="flex flex-col">
                    <Label>{t("Code")}</Label>
                    <Input placeholder="Search" />
                </div>
                <div className="flex flex-col">
                    <Label>{t("Driver")}</Label>
                    <Input placeholder="Search" />
                </div>
                <div className="flex flex-col">
                    <Label>{t("Weight")}</Label>
                    <Input placeholder="Search" />
                </div>
                <div className="flex flex-col">
                    <Label>{t("Status")}</Label>
                    <Input placeholder="Search" />
                </div>
                <div className="flex flex-col">
                    <Label>{t("Code")}</Label>
                    <Input placeholder="Search" />
                </div>
                <div className="flex flex-col">
                    <Label>{t("Code")}</Label>
                    <Input placeholder="Search" />
                </div>
                <div className="flex flex-col">
                    <Label>{t("Code")}</Label>
                    <Input placeholder="Search" />
                </div>
                <div className="flex items-end justify-start space-x-2">
                    <Button variant="outline">
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
                columns={columns}
                dataSource={data}
                // pagination={{ pageSize: 2 }} // Tự động chia 2 dòng/trang
            />
        </div>
    );
}

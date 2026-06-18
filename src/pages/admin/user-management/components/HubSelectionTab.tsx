import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { AntdTable } from "@/components/table/antd-table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import hubService, { type HubItem } from "@/services/hubService";

interface HubSelectionTabProps {
    selectedHubs: HubItem[];
    onChange: (hubs: HubItem[]) => void;
}

export const HubSelectionTab: React.FC<HubSelectionTabProps> = ({
    selectedHubs,
    onChange,
}) => {
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [dialogSelectedIds, setDialogSelectedIds] = useState<number[]>([]);
    const [mainSelectedIds, setMainSelectedIds] = useState<number[]>([]);

    const { data: hubsResponse, isLoading } = useQuery({
        queryKey: ["hubs"],
        queryFn: () => hubService.getAllHub(),
    });

    const hubs = React.useMemo(
        () => hubsResponse?.data?.data || hubsResponse?.data || [],
        [hubsResponse],
    );

    const filteredHubs = React.useMemo(() => {
        if (!search.trim()) return hubs;
        return hubs.filter(
            (hub: any) =>
                hub.name?.toLowerCase().includes(search.toLowerCase()) ||
                hub.code?.toLowerCase().includes(search.toLowerCase()),
        );
    }, [hubs, search]);

    const handleAdd = () => {
        const selected = hubs.filter((h: any) =>
            dialogSelectedIds.includes(h.id),
        );
        const newHubs = [...selectedHubs];
        selected.forEach((h: any) => {
            if (!newHubs.some((nh) => nh.id === h.id)) {
                newHubs.push(h);
            }
        });
        onChange(newHubs);
        setDialogSelectedIds([]);
        setSearch("");
        setIsAddOpen(false);
    };

    const handleDelete = () => {
        onChange(selectedHubs.filter((h) => !mainSelectedIds.includes(h.id)));
        setMainSelectedIds([]);
    };

    const dialogColumns = React.useMemo(
        () => [
            {
                title: (
                    <Checkbox
                        checked={
                            dialogSelectedIds.length === filteredHubs.length &&
                            filteredHubs.length > 0
                        }
                        onCheckedChange={(checked) => {
                            if (checked) {
                                setDialogSelectedIds(
                                    filteredHubs.map((h: any) => h.id),
                                );
                            } else {
                                setDialogSelectedIds([]);
                            }
                        }}
                    />
                ),
                dataIndex: "checkbox",
                key: "checkbox",
                width: 60,
                align: "center" as const,
                render: (_: any, hub: any) => (
                    <Checkbox
                        checked={dialogSelectedIds.includes(hub.id)}
                        onCheckedChange={(checked) => {
                            if (checked) {
                                setDialogSelectedIds((prev) => [
                                    ...prev,
                                    hub.id,
                                ]);
                            } else {
                                setDialogSelectedIds((prev) =>
                                    prev.filter((id) => id !== hub.id),
                                );
                            }
                        }}
                    />
                ),
            },
            {
                title: "Mã",
                dataIndex: "code",
                key: "code",
            },
            {
                title: "Tên",
                dataIndex: "name",
                key: "name",
            },
            {
                title: "Địa Chỉ",
                dataIndex: "full_address",
                key: "full_address",
            },
        ],
        [dialogSelectedIds, filteredHubs],
    );

    const mainColumns = React.useMemo(
        () => [
            {
                title: (
                    <Checkbox
                        checked={
                            mainSelectedIds.length === selectedHubs.length &&
                            selectedHubs.length > 0
                        }
                        onCheckedChange={(checked) => {
                            if (checked) {
                                setMainSelectedIds(
                                    selectedHubs.map((h: any) => h.id),
                                );
                            } else {
                                setMainSelectedIds([]);
                            }
                        }}
                    />
                ),
                dataIndex: "checkbox",
                key: "checkbox",
                width: 60,
                align: "center" as const,
                render: (_: any, hub: any) => (
                    <Checkbox
                        checked={mainSelectedIds.includes(hub.id)}
                        onCheckedChange={(checked) => {
                            if (checked) {
                                setMainSelectedIds((prev) => [...prev, hub.id]);
                            } else {
                                setMainSelectedIds((prev) =>
                                    prev.filter((id) => id !== hub.id),
                                );
                            }
                        }}
                    />
                ),
            },
            {
                title: "Mã",
                dataIndex: "code",
                key: "code",
            },
            {
                title: "Tên",
                dataIndex: "name",
                key: "name",
            },
            {
                title: "Địa Chỉ",
                dataIndex: "full_address",
                key: "full_address",
            },
        ],
        [mainSelectedIds, selectedHubs],
    );

    return (
        <>
            {/* Action buttons */}
            <div className="absolute top-0 right-0 flex justify-end gap-2">
                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogTrigger asChild>
                        <Button type="button">Thêm</Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-6xl sm:max-w-4xl max-h-[85vh] flex flex-col">
                        <DialogHeader>
                            <div className="flex flex-col items-center justify-center gap-2 mb-2">
                                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                                        <polyline points="9 22 9 12 15 12 15 22" />
                                    </svg>
                                </div>
                                <DialogTitle className="text-xl text-blue-600 font-semibold">
                                    Thêm Kho
                                </DialogTitle>
                            </div>
                        </DialogHeader>

                        <div className="flex items-end gap-4 py-2">
                            <div className="flex-1 max-w-sm space-y-2">
                                <Label>Tên Kho</Label>
                                <Input
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                            <Button
                                type="button"
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                                onClick={() => {
                                    setSearch("");
                                    setDialogSelectedIds([]);
                                }}
                            >
                                Đặt Lại
                            </Button>
                        </div>

                        <div className="flex-1 min-h-[300px]">
                            <AntdTable
                                borderless
                                columns={dialogColumns}
                                dataSource={filteredHubs}
                                rowKey="id"
                                loading={isLoading}
                                hideActionTable
                                hideFooterTable
                                scroll={{ y: 300 }}
                            />
                        </div>

                        <DialogFooter className="mt-4 flex justify-center sm:justify-center gap-4">
                            <Button
                                type="button"
                                variant="outline"
                                className="w-32"
                                onClick={() => setIsAddOpen(false)}
                            >
                                Huỷ
                            </Button>
                            <Button
                                type="button"
                                className="w-32"
                                onClick={handleAdd}
                            >
                                Thêm
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
                <Button
                    type="button"
                    variant="outline"
                    className="border-destructive text-destructive hover:bg-destructive/10"
                    onClick={handleDelete}
                    disabled={mainSelectedIds.length === 0}
                >
                    Xóa
                </Button>
            </div>

            {/* Main table */}
            <AntdTable
                borderless
                columns={mainColumns}
                dataSource={selectedHubs}
                rowKey="id"
                hideActionTable
                hideFooterTable
                scroll={{ y: 300 }}
            />
        </>
    );
};

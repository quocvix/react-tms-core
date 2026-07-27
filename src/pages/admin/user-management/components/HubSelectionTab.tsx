import React, { useState, useMemo } from "react";
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
import { t } from "i18next";

interface HubSelectionTabProps {
    selectedHubs: HubItem[];
    onChange: (hubs: HubItem[]) => void;
    disabled?: boolean;
}

export const HubSelectionTab: React.FC<HubSelectionTabProps> = ({
    selectedHubs,
    onChange,
    disabled = false,
}) => {
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [dialogSelectedIds, setDialogSelectedIds] = useState<number[]>([]);
    const [mainSelectedIds, setMainSelectedIds] = useState<number[]>([]);

    const { data: hubsResponse, isLoading } = useQuery({
        queryKey: ["hubs"],
        queryFn: () => hubService.getAllHub(),
    });

    const hubs = useMemo(
        () => hubsResponse?.data?.data || hubsResponse?.data || [],
        [hubsResponse],
    );

    const filteredHubs = useMemo(() => {
        const availableHubs = hubs.filter(
            (hub: HubItem) => !selectedHubs.some((sh) => sh.id === hub.id),
        );
        if (!search.trim()) return availableHubs;
        const searchLower = search.toLowerCase();
        return availableHubs.filter(
            (hub: HubItem) =>
                hub.name?.toLowerCase().includes(searchLower) ||
                hub.code?.toLowerCase().includes(searchLower),
        );
    }, [hubs, selectedHubs, search]);

    const handleAdd = () => {
        const selected = hubs.filter((h: HubItem) =>
            dialogSelectedIds.includes(h.id),
        );
        const newHubs = [...selectedHubs];
        selected.forEach((h: HubItem) => {
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
        const remaining = selectedHubs.filter(
            (h) => !mainSelectedIds.includes(h.id),
        );
        onChange(remaining);
        setMainSelectedIds([]);
    };

    const handleSelectAllDialog = (checked: boolean) => {
        if (checked) {
            setDialogSelectedIds(filteredHubs.map((h: HubItem) => h.id));
        } else {
            setDialogSelectedIds([]);
        }
    };

    const handleSelectOneDialog = (id: number, checked: boolean) => {
        if (checked) {
            setDialogSelectedIds((prev) => [...prev, id]);
        } else {
            setDialogSelectedIds((prev) => prev.filter((item) => item !== id));
        }
    };

    const handleSelectAllMain = (checked: boolean) => {
        if (checked) {
            setMainSelectedIds(selectedHubs.map((h) => h.id));
        } else {
            setMainSelectedIds([]);
        }
    };

    const handleSelectOneMain = (id: number, checked: boolean) => {
        if (checked) {
            setMainSelectedIds((prev) => [...prev, id]);
        } else {
            setMainSelectedIds((prev) => prev.filter((item) => item !== id));
        }
    };

    const isAllDialogSelected =
        filteredHubs.length > 0 &&
        filteredHubs.every((h: HubItem) => dialogSelectedIds.includes(h.id));

    const isAllMainSelected =
        selectedHubs.length > 0 &&
        selectedHubs.every((h) => mainSelectedIds.includes(h.id));

    const dialogColumns = useMemo(
        () => [
            {
                title: (
                    <Checkbox
                        checked={isAllDialogSelected}
                        onCheckedChange={handleSelectAllDialog}
                    />
                ),
                key: "selection",
                width: 50,
                render: (_: unknown, record: unknown) => {
                    const h = record as HubItem;
                    return (
                        <Checkbox
                            checked={dialogSelectedIds.includes(h.id)}
                            onCheckedChange={(checked) =>
                                handleSelectOneDialog(h.id, !!checked)
                            }
                        />
                    );
                },
            },
            {
                title: t("Code", "Mã Kho"),
                dataIndex: "code",
                key: "code",
                width: 150,
            },
            {
                title: t("Hub Name", "Tên Kho"),
                dataIndex: "name",
                key: "name",
                width: 200,
            },
            {
                title: t("Phone", "SĐT"),
                dataIndex: "phone",
                key: "phone",
                width: 150,
            },
            {
                title: t("Address", "Địa Chỉ"),
                dataIndex: "full_address",
                key: "full_address",
            },
        ],
        [isAllDialogSelected, dialogSelectedIds, filteredHubs],
    );

    const mainColumns = useMemo(
        () => [
            ...(!disabled
                ? [
                      {
                          title: (
                              <Checkbox
                                  checked={isAllMainSelected}
                                  onCheckedChange={handleSelectAllMain}
                              />
                          ),
                          key: "selection",
                          width: 50,
                          render: (_: unknown, record: unknown) => {
                              const h = record as HubItem;
                              return (
                                  <Checkbox
                                      checked={mainSelectedIds.includes(h.id)}
                                      onCheckedChange={(checked) =>
                                          handleSelectOneMain(h.id, !!checked)
                                      }
                                  />
                              );
                          },
                      },
                  ]
                : []),
            {
                title: t("Code", "Mã Kho"),
                dataIndex: "code",
                key: "code",
                width: 150,
            },
            {
                title: t("Hub Name", "Tên Kho"),
                dataIndex: "name",
                key: "name",
                width: 200,
            },
            {
                title: t("Phone", "SĐT"),
                dataIndex: "phone",
                key: "phone",
                width: 150,
            },
            {
                title: t("Address", "Địa Chỉ"),
                dataIndex: "full_address",
                key: "full_address",
            },
        ],
        [mainSelectedIds, selectedHubs, disabled],
    );

    return (
        <>
            {/* Action buttons */}
            {!disabled && (
                <div className="absolute top-0 right-0 flex justify-end gap-2">
                    <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                        <DialogTrigger asChild>
                            <Button type="button">{t("Add", "Thêm")}</Button>
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
                                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                            <circle cx="12" cy="7" r="4" />
                                        </svg>
                                    </div>
                                    <DialogTitle className="text-xl text-blue-600 font-semibold">
                                        {t("Add Hub", "Thêm Kho")}
                                    </DialogTitle>
                                </div>
                            </DialogHeader>

                            <div className="flex items-end gap-4 py-2">
                                <div className="flex-1 max-w-sm space-y-2">
                                    <Label>{t("Search Hub", "Tìm kiếm Kho")}</Label>
                                    <Input
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder={t("Enter code or hub name...", "Nhập mã hoặc tên kho...")}
                                    />
                                </div>
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
                                    {t("Cancel", "Hủy")}
                                </Button>
                                <Button
                                    type="button"
                                    className="w-32"
                                    onClick={handleAdd}
                                >
                                    {t("Add", "Thêm")}
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
                        {t("Delete", "Xóa")}
                    </Button>
                </div>
            )}

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

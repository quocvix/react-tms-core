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
import permissionService from "@/services/permissionService";
import type { RoleItem } from "@/types/role-permission";
import { t } from "i18next";

interface RoleSelectionTabProps {
    selectedRoles: RoleItem[];
    onChange: (roles: RoleItem[]) => void;
    disabled?: boolean;
}

export const RoleSelectionTab: React.FC<RoleSelectionTabProps> = ({
    selectedRoles,
    onChange,
    disabled = false,
}) => {
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [dialogSelectedIds, setDialogSelectedIds] = useState<number[]>([]);
    const [mainSelectedIds, setMainSelectedIds] = useState<number[]>([]);

    const {
        data: rolesResponse,
        isLoading,
        refetch,
    } = useQuery({
        queryKey: ["roles"],
        queryFn: () => permissionService.getRoles(),
    });

    const roles = useMemo(
        () => rolesResponse?.data || [],
        [rolesResponse],
    );

    const filteredRoles = useMemo(() => {
        const availableRoles = roles.filter(
            (role) => !selectedRoles.some((sr) => sr.id === role.id),
        );
        if (!search.trim()) return availableRoles;
        return availableRoles.filter((role) =>
            role.name.toLowerCase().includes(search.toLowerCase()),
        );
    }, [roles, selectedRoles, search]);

    const handleAdd = () => {
        const selected = roles.filter((r) => dialogSelectedIds.includes(r.id));
        const newRoles = [...selectedRoles];
        selected.forEach((r) => {
            if (!newRoles.some((nr) => nr.id === r.id)) {
                newRoles.push(r);
            }
        });
        onChange(newRoles);
        setDialogSelectedIds([]);
        setSearch("");
        setIsAddOpen(false);
    };

    const handleDelete = () => {
        onChange(selectedRoles.filter((r) => !mainSelectedIds.includes(r.id)));
        setMainSelectedIds([]);
    };

    const dialogColumns = useMemo(
        () => [
            {
                title: (
                    <Checkbox
                        checked={
                            dialogSelectedIds.length === filteredRoles.length &&
                            filteredRoles.length > 0
                        }
                        onCheckedChange={(checked) => {
                            if (checked) {
                                setDialogSelectedIds(
                                    filteredRoles.map((r) => r.id),
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
                render: (_: any, role: RoleItem) => (
                    <Checkbox
                        checked={dialogSelectedIds.includes(role.id)}
                        onCheckedChange={(checked) => {
                            if (checked) {
                                setDialogSelectedIds((prev) => [
                                    ...prev,
                                    role.id,
                                ]);
                            } else {
                                setDialogSelectedIds((prev) =>
                                    prev.filter((id) => id !== role.id),
                                );
                            }
                        }}
                    />
                ),
            },
            {
                title: "Role Name",
                dataIndex: "name",
                key: "name",
            },
        ],
        [dialogSelectedIds, filteredRoles],
    );

    const mainColumns = useMemo(
        () => [
            ...(!disabled
                ? [
                      {
                          title: (
                              <Checkbox
                                  checked={
                                      mainSelectedIds.length === selectedRoles.length &&
                                      selectedRoles.length > 0
                                  }
                                  onCheckedChange={(checked) => {
                                      if (checked) {
                                          setMainSelectedIds(
                                              selectedRoles.map((r) => r.id),
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
                          render: (_: any, role: RoleItem) => (
                              <Checkbox
                                  checked={mainSelectedIds.includes(role.id)}
                                  onCheckedChange={(checked) => {
                                      if (checked) {
                                          setMainSelectedIds((prev) => [
                                              ...prev,
                                              role.id,
                                          ]);
                                      } else {
                                          setMainSelectedIds((prev) =>
                                              prev.filter((id) => id !== role.id),
                                          );
                                      }
                                  }}
                              />
                          ),
                      },
                  ]
                : []),
            {
                title: "Tên Vai Trò",
                dataIndex: "name",
                key: "name",
            },
        ],
        [mainSelectedIds, selectedRoles, disabled],
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
                        <DialogContent className="max-w-5xl sm:max-w-4xl max-h-[85vh] flex flex-col">
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
                                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                                            <circle cx="9" cy="7" r="4" />
                                            <line x1="19" x2="19" y1="8" y2="14" />
                                            <line x1="22" x2="16" y1="11" y2="11" />
                                        </svg>
                                    </div>
                                    <DialogTitle className="text-xl text-blue-600 font-semibold">
                                        {t("Add Role", "Thêm Vai Trò")}
                                    </DialogTitle>
                                </div>
                            </DialogHeader>

                            <div className="flex items-end gap-4 py-2">
                                <div className="flex-1 max-w-sm space-y-2">
                                    <Label>{t("Role Name", "Tên Vai Trò")}</Label>
                                    <Input
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                </div>
                                <Button
                                    type="button"
                                    className="bg-blue-600 hover:bg-blue-700 text-white"
                                    onClick={() => refetch()}
                                >
                                    {t("Refresh", "Làm mới")}
                                </Button>
                            </div>

                            <div className="flex-1 min-h-[300px]">
                                <AntdTable
                                    borderless
                                    columns={dialogColumns}
                                    dataSource={filteredRoles}
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
                dataSource={selectedRoles}
                rowKey="id"
                hideActionTable
                hideFooterTable
                scroll={{ y: 300 }}
            />
        </>
    );
};

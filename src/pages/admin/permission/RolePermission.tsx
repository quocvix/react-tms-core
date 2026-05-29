import { Plus, Pencil, Trash2, Search, Save, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { t } from "i18next";
import { useRef, useState, useEffect, useCallback } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import permissionService from "@/services/permissionService";
import type { RoleItem, PermissionGroup } from "@/types/role-permission";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { toast } from "sonner";

export default function PermissionSettings() {
    const mainRef = useRef<HTMLElement>(null);
    const headerRef = useRef<HTMLElement>(null);
    const footerRef = useRef<HTMLDivElement>(null);
    const [scrollHeight, setScrollHeight] = useState(600);
    const [rolesList, setRolesList] = useState<RoleItem[]>([]);
    const [isLoadingRoles, setIsLoadingRoles] = useState(false);
    const [activeRoleId, setActiveRoleId] = useState<string>("");
    const [permissionGroupsList, setPermissionGroupsList] = useState<PermissionGroup[]>([]);
    const [isLoadingPermissions, setIsLoadingPermissions] = useState(false);
    const [assignedPermissionIds, setAssignedPermissionIds] = useState<string[]>([]);
    const [isSaving, setIsSaving] = useState(false);

    const activeRole =
        rolesList.find((r) => String(r.id) === activeRoleId) || rolesList[0];

    const fetchRoles = useCallback(async () => {
        setIsLoadingRoles(true);
        try {
            const res = await permissionService.getRoles();
            const fetchedRoles = res.data || [];
            setRolesList(fetchedRoles);
            if (fetchedRoles.length > 0) {
                setActiveRoleId(String(fetchedRoles[0].id));
            }
        } catch (error) {
            console.error("Failed to fetch roles:", error);
        } finally {
            setIsLoadingRoles(false);
        }
    }, []);

    const fetchRoleDetail = useCallback(async (roleId: number) => {
        if (!roleId) return;
        try {
            const res = await permissionService.getRoleDetail(roleId);
            setAssignedPermissionIds(res.permission_ids || []);
        } catch (error) {
            console.error("Failed to fetch role detail:", error);
        }
    }, []);

    const fetchPermissions = useCallback(async (roleId: string) => {
        if (!roleId) return;
        setIsLoadingPermissions(true);
        try {
            const res = await permissionService.getPermission(
                `?role_id=${roleId}`,
            );
            setPermissionGroupsList(res.data || []);
            await fetchRoleDetail(Number(roleId));
        } catch (error) {
            console.error("Failed to fetch permissions:", error);
        } finally {
            setIsLoadingPermissions(false);
        }
    }, [fetchRoleDetail]);

    useEffect(() => {
        fetchRoles();
    }, [fetchRoles]);

    useEffect(() => {
        if (activeRoleId) {
            fetchPermissions(activeRoleId);
        }
    }, [activeRoleId, fetchPermissions]);

    const handleSavePermissions = async () => {
        if (!activeRoleId) return;
        setIsSaving(true);
        try {
            await permissionService.givePermission(Number(activeRoleId), assignedPermissionIds);
            toast.success(t("Save permissions successfully"));
        } catch (error) {
            console.error("Failed to save permissions:", error);
            toast.error(t("Failed to save permissions"));
        } finally {
            setIsSaving(false);
        }
    };

    const calcHeight = useCallback(() => {
        const mainH = mainRef.current?.clientHeight ?? 0;
        const headerH = headerRef.current?.clientHeight ?? 0;
        const footerH = footerRef.current?.clientHeight ?? 0;
        const available = mainH - headerH - footerH;
        setScrollHeight(available > 0 ? available : 300);
    }, []);

    useEffect(() => {
        calcHeight();
        window.addEventListener("resize", calcHeight);
        return () => window.removeEventListener("resize", calcHeight);
    }, [calcHeight, activeRoleId, rolesList, permissionGroupsList, assignedPermissionIds]);

    return (
        <Tabs
            value={activeRoleId}
            onValueChange={setActiveRoleId}
            orientation="vertical"
            className="flex flex-row gap-0 h-full w-full bg-background text-foreground overflow-hidden rounded-md"
        >
            {/* SIDEBAR BÊN TRÁI */}
            <aside className="w-64 border-r bg-card flex flex-col shrink-0">
                <div className="p-4 flex flex-row gap-3 items-center justify-between">
                    <div className="flex items-center gap-2 text-lg font-bold tracking-tight">
                        <Shield className="h-4 w-4" />
                        <span>{t("Roles")}</span>
                    </div>
                    <Button className="h-8 justify-center gap-2">
                        <Plus className="h-4 w-4" />
                        {t("Add")}
                    </Button>
                </div>
                <Separator />
                <ScrollArea className="p-2" style={{ height: scrollHeight }}>
                    {isLoadingRoles ? (
                        <LoadingSpinner />
                    ) : rolesList.length === 0 ? (
                        <div className="text-center py-8 text-sm text-muted-foreground">
                            {t("No roles found")}
                        </div>
                    ) : (
                        <TabsList className="flex flex-col items-stretch justify-start bg-transparent p-0 gap-1 border-none w-full">
                            {rolesList.map((role) => (
                                <TabsTrigger
                                    key={role.id}
                                    value={String(role.id)}
                                    asChild
                                >
                                    <div
                                        className="group flex items-center p-2 rounded-md text-sm font-medium cursor-pointer transition-colors bg-transparent data-[state=active]:bg-primary/10 data-[state=active]:text-primary text-muted-foreground hover:text-foreground hover:bg-accent/50 data-[state=active]:hover:bg-primary/10 border-none justify-start h-auto w-full text-left shadow-none data-[state=active]:shadow-none select-none"
                                        role="tab"
                                    >
                                        <span>{t(role.name)}</span>
                                        {/* Các nút hành động ẩn, chỉ hiện khi hover nhóm */}
                                        {role.is_edit === 1 ? (
                                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 data-[state=active]:group-hover:opacity-100 transition-opacity ml-auto shrink-0">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-7 w-7"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                    }}
                                                >
                                                    <Pencil className="h-3 w-3" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-7 w-7 text-destructive hover:text-destructive"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                    }}
                                                >
                                                    <Trash2 className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        ) : null}
                                    </div>
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    )}
                </ScrollArea>
            </aside>

            {/* NỘI DUNG CHÍNH BÊN PHẢI */}
            <main
                ref={mainRef}
                className="flex-1 flex flex-col h-full min-h-0 "
            >
                {/* HEADER */}
                <header
                    ref={headerRef}
                    className="p-4 border-b bg-card flex items-center justify-between"
                >
                    <div className="space-y-0.5 flex items-center gap-2">
                        <h1 className="text-lg font-bold tracking-tight">
                            {t("Permission")}
                        </h1>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{t("Đang chỉnh sửa:")}</span>
                            <Badge
                                variant="secondary"
                                className="rounded-sm px-1.5 font-semibold text-primary"
                            >
                                {t(activeRole?.name)}
                            </Badge>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative w-64 hidden md:block">
                            <Search className="absolute left-2.5 top-2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Tìm nhanh quyền..."
                                className="pl-8 h-8 text-sm"
                            />
                        </div>
                    </div>
                </header>

                {/* VÙNG DANH SÁCH QUYỀN HẠN (COLLAPSIBLE) */}
                <ScrollArea style={{ height: scrollHeight }}>
                    <div className="max-w-full mx-auto p-6">
                        {isLoadingPermissions ? (
                            <LoadingSpinner />
                        ) : permissionGroupsList.length === 0 ? (
                            <div className="text-center py-12 text-sm text-muted-foreground bg-card border rounded-xl p-6 shadow-sm">
                                {t("No permissions found")}
                            </div>
                        ) : (
                            <Accordion
                                key={activeRoleId}
                                type="multiple"
                                defaultValue={permissionGroupsList.map(
                                    (g) => g.group,
                                )}
                                className="space-y-4"
                            >
                                {permissionGroupsList.map((group) => (
                                    <AccordionItem
                                        key={group.group}
                                        value={group.group}
                                        className="border rounded-xl bg-card overflow-hidden shadow-sm transition-all data-[state=open]:shadow-md data-[state=open]:border-primary/20"
                                    >
                                        {/* HEADER CỦA NHÓM QUYỀN */}
                                        <div className="flex items-center w-full px-4 bg-muted hover:bg-muted/80 transition-colors">
                                            {/* Checkbox tách riêng, không nằm trong AccordionTrigger (button) */}
                                            <div
                                                className="flex items-center py-3 pr-3"
                                                onClick={(e) =>
                                                    e.stopPropagation()
                                                }
                                            >
                                                <Checkbox
                                                    id={`all-${group.group}`}
                                                    checked={group.permissions.every((perm) => assignedPermissionIds.includes(String(perm.id)))}
                                                    onCheckedChange={(checked) => {
                                                        const permIds = group.permissions.map((p) => String(p.id));
                                                        if (checked) {
                                                            setAssignedPermissionIds((prev) => {
                                                                const next = new Set([...prev, ...permIds]);
                                                                return Array.from(next);
                                                            });
                                                        } else {
                                                            setAssignedPermissionIds((prev) => prev.filter((id) => !permIds.includes(id)));
                                                        }
                                                    }}
                                                />
                                            </div>

                                            <AccordionTrigger className="flex-1 py-3 hover:no-underline text-sm font-semibold group">
                                                <div className="flex items-center gap-3">
                                                    <span className="group-data-[state=open]:text-primary transition-colors">
                                                        {group.group}
                                                    </span>
                                                    <Badge
                                                        variant="outline"
                                                        className="mx-2 bg-background font-normal"
                                                    >
                                                        Đã chọn {
                                                            group.permissions.filter((p) => assignedPermissionIds.includes(String(p.id))).length
                                                        }/
                                                        {
                                                            group.permissions.length
                                                        }
                                                    </Badge>
                                                </div>
                                            </AccordionTrigger>
                                        </div>

                                        {/* NỘI DUNG QUYỀN CON KHI MỞ RA */}
                                        <AccordionContent className="border-t  p-4">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                                {group.permissions.map(
                                                    (perm) => (
                                                        <div
                                                            key={perm.id}
                                                            className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-card hover:shadow-sm transition-all bg-background/60 group"
                                                        >
                                                            <Checkbox
                                                                id={`${group.group}-${perm.id}`}
                                                                checked={assignedPermissionIds.includes(String(perm.id))}
                                                                onCheckedChange={(checked) => {
                                                                    if (checked) {
                                                                        setAssignedPermissionIds((prev) => [...prev, String(perm.id)]);
                                                                    } else {
                                                                        setAssignedPermissionIds((prev) => prev.filter((id) => id !== String(perm.id)));
                                                                    }
                                                                }}
                                                            />
                                                            <label
                                                                htmlFor={`${group.group}-${perm.id}`}
                                                                className="text-sm font-medium leading-tight cursor-pointer text-muted-foreground group-hover:text-foreground select-none transition-colors"
                                                            >
                                                                <code className="block text-[13px] text-foreground">
                                                                    {t(
                                                                        perm.name,
                                                                    )}
                                                                </code>
                                                            </label>
                                                        </div>
                                                    ),
                                                )}
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        )}
                    </div>
                </ScrollArea>

                {/* Footer info (Tùy chọn) */}
                <div
                    ref={footerRef}
                    className="px-6 py-3 border-t bg-card text-[11px] text-muted-foreground flex justify-end"
                >
                    <Button className="gap-2 px-4" onClick={handleSavePermissions} disabled={isSaving}>
                        <Save className="h-4 w-4" /> {t("Save")}
                    </Button>
                </div>
            </main>
        </Tabs>
    );
}

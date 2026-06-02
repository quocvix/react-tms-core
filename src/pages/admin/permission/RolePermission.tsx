import {
    Plus,
    Pencil,
    Trash2,
    Search,
    Save,
    Shield,
    ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { t } from "i18next";
import {
    memo,
    useState,
    useEffect,
    useCallback,
    useMemo,
    useRef,
    useSyncExternalStore,
} from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import permissionService from "@/services/permissionService";
import type {
    RoleItem,
    PermissionGroup,
    PermissionItem,
} from "@/types/role-permission";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { toast } from "sonner";
import { useVirtualizer } from "@tanstack/react-virtual";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useTranslation } from "react-i18next";

// ─── Permission Store (external store, bypasses React state) ────────
type Listener = () => void;

function createPermissionStore() {
    let ids = new Set<number>();
    const listeners = new Set<Listener>();

    function subscribe(listener: Listener) {
        listeners.add(listener);
        return () => {
            listeners.delete(listener);
        };
    }

    function emitChange() {
        for (const listener of listeners) {
            listener();
        }
    }

    function getSnapshot() {
        return ids;
    }

    function toggle(id: number, checked: boolean) {
        const next = new Set(ids);
        if (checked) next.add(id);
        else next.delete(id);
        ids = next;
        emitChange();
    }

    function toggleGroup(permIds: number[], checked: boolean) {
        const next = new Set(ids);
        if (checked) permIds.forEach((pid) => next.add(pid));
        else permIds.forEach((pid) => next.delete(pid));
        ids = next;
        emitChange();
    }

    function reset(newIds: Set<number>) {
        ids = newIds;
        emitChange();
    }

    return { subscribe, getSnapshot, toggle, toggleGroup, reset };
}

type PermissionStore = ReturnType<typeof createPermissionStore>;

// ─── Group-level subscription hook ──────────────────────────────────

function useGroupFingerprint(
    store: PermissionStore,
    permissionIds: number[],
): string {
    const idsRef = useRef(permissionIds);
    idsRef.current = permissionIds;

    return useSyncExternalStore(
        store.subscribe,
        useCallback(() => {
            const snapshot = store.getSnapshot();
            let fp = "";
            for (const id of idsRef.current) {
                fp += snapshot.has(id) ? "1" : "0";
            }
            return fp;
        }, [store]),
    );
}

// ─── PermissionCheckbox (pure memo, NO subscriptions) ───────────────

interface PermissionCheckboxProps {
    perm: PermissionItem;
    groupName: string;
    checked: boolean;
    onToggle: (id: number, checked: boolean) => void;
}

const PermissionCheckbox = memo(
    ({ perm, groupName, checked, onToggle }: PermissionCheckboxProps) => {
        const checkboxId = `${groupName}-${perm.id}`;
        const handleChange = useCallback(
            (val: boolean | "indeterminate") => onToggle(perm.id, !!val),
            [perm.id, onToggle],
        );

        return (
            <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-card hover:shadow-sm transition-shadow transition-colors bg-background/60 group">
                <Checkbox
                    id={checkboxId}
                    checked={checked}
                    onCheckedChange={handleChange}
                />
                <label
                    htmlFor={checkboxId}
                    className="text-sm font-medium leading-tight cursor-pointer text-muted-foreground group-hover:text-foreground select-none transition-colors"
                >
                    <code className="block text-[13px] text-foreground">
                        {t(perm.name)}
                    </code>
                </label>
            </div>
        );
    },
);

PermissionCheckbox.displayName = "PermissionCheckbox";

// ─── Virtual list item types ────────────────────────────────────────

type VirtualRow =
    | {
          type: "group-header";
          key: string;
          group: PermissionGroup;
          groupIndex: number;
      }
    | {
          type: "permission-row";
          key: string;
          group: PermissionGroup;
          groupIndex: number;
          startIdx: number;
          isFirstRow: boolean;
          isLastRow: boolean;
      }
    | {
          type: "group-spacer";
          key: string;
          groupIndex: number;
      };

const COLS = 3;
const ROW_HEIGHT = 52;
const HEADER_HEIGHT = 48;
const SPACER_HEIGHT = 16;

// ─── GroupHeader ────────────────────────────────────────────────────

interface GroupHeaderProps {
    group: PermissionGroup;
    store: PermissionStore;
    isOpen: boolean;
    groupName: string;
    onToggleGroupOpen: (name: string) => void;
}

const GroupHeader = memo(
    ({
        group,
        store,
        isOpen,
        groupName,
        onToggleGroupOpen,
    }: GroupHeaderProps) => {
        const permissionIds = useMemo(
            () => group.permissions.map((p) => p.id),
            [group.permissions],
        );

        const fingerprint = useGroupFingerprint(store, permissionIds);

        let checkedCount = 0;
        for (let i = 0; i < fingerprint.length; i++) {
            if (fingerprint[i] === "1") checkedCount++;
        }
        const isAllChecked =
            checkedCount === group.permissions.length &&
            group.permissions.length > 0;

        const handleToggleAll = useCallback(
            (checked: boolean | "indeterminate") => {
                store.toggleGroup(permissionIds, !!checked);
            },
            [store, permissionIds],
        );

        const handleToggleOpen = useCallback(() => {
            onToggleGroupOpen(groupName);
        }, [onToggleGroupOpen, groupName]);

        return (
            <div
                className={`flex items-center w-full px-4 bg-muted rounded-xl border transition-colors ${
                    isOpen
                        ? "rounded-b-none border-primary/20 shadow-md"
                        : "hover:bg-muted/80 shadow-sm"
                }`}
            >
                {/* Select-all checkbox */}
                <div
                    className="flex items-center py-3 pr-3"
                    onClick={(e) => e.stopPropagation()}
                >
                    <Checkbox
                        id={`all-${group.group}`}
                        checked={isAllChecked}
                        onCheckedChange={handleToggleAll}
                    />
                </div>

                {/* Clickable trigger area */}
                <button
                    type="button"
                    onClick={handleToggleOpen}
                    className="flex-1 flex items-center justify-between py-3 text-sm font-semibold cursor-pointer select-none"
                >
                    <div className="flex items-center gap-3">
                        <span
                            className={
                                isOpen ? "text-primary" : "text-foreground"
                            }
                        >
                            {group.group}
                        </span>
                        <Badge
                            variant="outline"
                            className="mx-2 bg-background font-normal"
                        >
                            Đã chọn {checkedCount}/{group.permissions.length}
                        </Badge>
                    </div>
                    <ChevronDown
                        className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ${
                            isOpen ? "rotate-180" : ""
                        }`}
                    />
                </button>
            </div>
        );
    },
);

GroupHeader.displayName = "GroupHeader";

// ─── PermissionRow (pure memo, subscribes to group fingerprint) ─────

interface PermissionRowProps {
    group: PermissionGroup;
    startIdx: number;
    store: PermissionStore;
    isFirstRow?: boolean;
    isLastRow?: boolean;
}

const PermissionRow = memo(
    ({ group, startIdx, store, isFirstRow, isLastRow }: PermissionRowProps) => {
        const endIdx = Math.min(startIdx + COLS, group.permissions.length);
        const rowPerms = useMemo(
            () => group.permissions.slice(startIdx, endIdx),
            [group.permissions, startIdx, endIdx],
        );
        const rowPermIds = useMemo(() => rowPerms.map((p) => p.id), [rowPerms]);

        // Chỉ subscribe vào những ID có trong row này (tối đa 3 IDs)
        // -> Khi toggle 1 quyền, CHỈ DUY NHẤT row chứa quyền đó re-render
        const fingerprint = useGroupFingerprint(store, rowPermIds);

        let containerClass =
            "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 px-4 bg-card border-x border-primary/20 h-full w-full";
        if (isFirstRow) containerClass += " border-t pt-4";
        if (isLastRow) containerClass += " border-b rounded-b-xl pb-4";

        return (
            <div className={containerClass}>
                {rowPerms.map((perm, i) => (
                    <PermissionCheckbox
                        key={perm.id}
                        perm={perm}
                        groupName={group.group}
                        checked={fingerprint[i] === "1"}
                        onToggle={store.toggle}
                    />
                ))}
            </div>
        );
    },
);

PermissionRow.displayName = "PermissionRow";

// ─── Role Dialog ────────────────────────────────────────────────────

interface RoleDialogState {
    open: boolean;
    mode: "add" | "edit";
    role?: RoleItem;
}

interface RoleDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    mode: "add" | "edit";
    initialName?: string;
    onSave: (name: string) => Promise<void>;
}

const RoleDialog = memo(
    ({
        open,
        onOpenChange,
        mode,
        initialName = "",
        onSave,
    }: RoleDialogProps) => {
        const { t } = useTranslation();
        const [name, setName] = useState(initialName);
        const [isSaving, setIsSaving] = useState(false);

        useEffect(() => {
            if (open) {
                setName(initialName);
            }
        }, [open, initialName]);

        const handleSave = async () => {
            if (!name.trim()) return;
            setIsSaving(true);
            try {
                await onSave(name);
                onOpenChange(false);
            } catch (error) {
                // Lỗi đã được xử lý (toast) ở parent, chỉ cần dừng loading
            } finally {
                setIsSaving(false);
            }
        };

        return (
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {mode === "add" ? t("Add Role") : t("Edit Role")}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <div className="space-y-2">
                            <label
                                htmlFor="role-name-input"
                                className="text-sm font-medium"
                            >
                                {t("Name")}{" "}
                                <span className="text-destructive">*</span>
                            </label>
                            <Input
                                id="role-name-input"
                                placeholder={t("Nhập tên nhóm quyền...")}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") handleSave();
                                }}
                                required
                                autoFocus
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            {t("Cancel")}
                        </Button>
                        <Button
                            onClick={handleSave}
                            disabled={isSaving || !name.trim()}
                        >
                            {isSaving ? <LoadingSpinner /> : null}
                            {t("Save")}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        );
    },
);

RoleDialog.displayName = "RoleDialog";

// ─── Main Component ─────────────────────────────────────────────────

export default function PermissionSettings() {
    const [rolesList, setRolesList] = useState<RoleItem[]>([]);
    const [isLoadingRoles, setIsLoadingRoles] = useState(false);
    const [activeRoleId, setActiveRoleId] = useState<string>("");
    const [permissionGroupsList, setPermissionGroupsList] = useState<
        PermissionGroup[]
    >([]);
    const [isLoadingPermissions, setIsLoadingPermissions] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [openGroups, setOpenGroups] = useState<Set<string>>(new Set());

    const [dialogState, setDialogState] = useState<RoleDialogState>({
        open: false,
        mode: "add",
    });

    const [deletingRole, setDeletingRole] = useState<RoleItem | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Stable store instance
    const storeRef = useRef<PermissionStore | null>(null);
    if (!storeRef.current) {
        storeRef.current = createPermissionStore();
    }
    const store = storeRef.current;

    const activeRole =
        rolesList.find((r) => String(r.id) === activeRoleId) || rolesList[0];

    // Auto-open all groups when permission list changes
    useEffect(() => {
        setOpenGroups(new Set(permissionGroupsList.map((g) => g.group)));
    }, [permissionGroupsList]);

    const toggleGroupOpen = useCallback((groupName: string) => {
        setOpenGroups((prev) => {
            const next = new Set(prev);
            if (next.has(groupName)) {
                next.delete(groupName);
            } else {
                next.add(groupName);
            }
            return next;
        });
    }, []);

    // ─── Flatten groups into virtual rows (stable keys) ─────────────
    const virtualRows: VirtualRow[] = useMemo(() => {
        const rows: VirtualRow[] = [];
        permissionGroupsList.forEach((group, gi) => {
            rows.push({
                type: "group-header",
                key: `h-${group.group}`,
                group,
                groupIndex: gi,
            });
            if (openGroups.has(group.group)) {
                const totalRows = Math.ceil(group.permissions.length / COLS);
                for (let i = 0; i < group.permissions.length; i += COLS) {
                    const rowIndex = Math.floor(i / COLS);
                    rows.push({
                        type: "permission-row",
                        key: `r-${group.group}-${i}`,
                        group,
                        groupIndex: gi,
                        startIdx: i,
                        isFirstRow: rowIndex === 0,
                        isLastRow: rowIndex === totalRows - 1,
                    });
                }
            }
            rows.push({
                type: "group-spacer",
                key: `s-${gi}`,
                groupIndex: gi,
            });
        });
        return rows;
    }, [permissionGroupsList, openGroups]);

    // ─── Virtualizer with stable keys ───────────────────────────────
    const scrollRef = useRef<HTMLDivElement>(null);

    const estimateSize = useCallback(
        (index: number) => {
            const row = virtualRows[index];
            if (row.type === "group-header") return HEADER_HEIGHT;
            if (row.type === "group-spacer") return SPACER_HEIGHT;

            let height = ROW_HEIGHT;
            if (row.type === "permission-row") {
                if (row.isFirstRow) height += 16;
                if (row.isLastRow) height += 16;
            }
            return height;
        },
        [virtualRows],
    );

    const getItemKey = useCallback(
        (index: number) => virtualRows[index].key,
        [virtualRows],
    );

    const virtualizer = useVirtualizer({
        count: virtualRows.length,
        getScrollElement: () => scrollRef.current,
        estimateSize,
        getItemKey,
        overscan: 5,
    });

    // ─── Data fetching ──────────────────────────────────────────────
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

    const fetchRoleDetail = useCallback(
        async (roleId: number) => {
            if (!roleId) return;
            try {
                const res = await permissionService.getRoleDetail(roleId);
                const ids = new Set(res.data.permission_ids || []);
                store.reset(ids);
            } catch (error) {
                console.error("Failed to fetch role detail:", error);
            }
        },
        [store],
    );

    const fetchPermissions = useCallback(
        async (roleId: string) => {
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
        },
        [fetchRoleDetail],
    );

    useEffect(() => {
        fetchRoles();
    }, [fetchRoles]);

    useEffect(() => {
        if (activeRoleId) {
            fetchPermissions(activeRoleId);
        }
    }, [activeRoleId, fetchPermissions]);

    const handleSavePermissions = useCallback(async () => {
        if (!activeRoleId) return;
        setIsSaving(true);
        try {
            await permissionService.givePermission(Number(activeRoleId), {
                permission_ids: Array.from(store.getSnapshot()),
            });
            toast.success(t("Save permissions successfully"));
        } catch (error) {
            console.error("Failed to save permissions:", error);
            toast.error(t("Failed to save permissions"));
        } finally {
            setIsSaving(false);
        }
    }, [activeRoleId, store]);

    const handleSaveRole = useCallback(
        async (name: string) => {
            try {
                if (dialogState.mode === "add") {
                    await permissionService.createRole({ name });
                    toast.success(t("Tạo nhóm quyền thành công"));
                } else if (dialogState.mode === "edit" && dialogState.role) {
                    await permissionService.updateRole(dialogState.role.id, {
                        name,
                    });
                    toast.success(t("Cập nhật nhóm quyền thành công"));
                }
                fetchRoles();
            } catch (error) {
                console.error("Failed to save role:", error);
                toast.error(
                    dialogState.mode === "add"
                        ? t("Tạo nhóm quyền thất bại")
                        : t("Cập nhật nhóm quyền thất bại"),
                );
                throw error; // Ném lỗi để RoleDialog không đóng popup
            }
        },
        [dialogState, fetchRoles, t],
    );

    const handleDeleteRole = useCallback(async () => {
        if (!deletingRole) return;
        setIsDeleting(true);
        try {
            await permissionService.deleteRole(deletingRole.id);
            toast.success(t("Xoá nhóm quyền thành công"));
            if (activeRoleId === String(deletingRole.id)) {
                setActiveRoleId("");
            }
            setDeletingRole(null);
            fetchRoles();
        } catch (error) {
            console.error("Failed to delete role:", error);
            toast.error(t("Xoá nhóm quyền thất bại"));
        } finally {
            setIsDeleting(false);
        }
    }, [deletingRole, activeRoleId, fetchRoles, t]);

    return (
        <Tabs
            value={activeRoleId}
            onValueChange={setActiveRoleId}
            orientation="vertical"
            className="flex flex-row gap-0 h-[calc(100vh-140px)] w-full bg-background text-foreground overflow-hidden rounded-md border"
        >
            {/* SIDEBAR BÊN TRÁI */}
            <aside className="w-64 border-r bg-card flex flex-col shrink-0 h-full">
                <div className="p-4 flex flex-row gap-3 items-center justify-between shrink-0">
                    <div className="flex items-center gap-2 text-lg font-bold tracking-tight">
                        <Shield className="h-4 w-4" />
                        <span>{t("Roles")}</span>
                    </div>
                    <Button
                        className="h-8 justify-center gap-2"
                        onClick={() =>
                            setDialogState({ open: true, mode: "add" })
                        }
                    >
                        <Plus className="h-4 w-4" />
                        {t("Add")}
                    </Button>
                </div>
                <Separator className="shrink-0" />
                <div className="flex-1 min-h-0 p-2 overflow-y-auto">
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
                                        {role.is_edit === 1 ? (
                                            <div
                                                className="flex items-center gap-1 opacity-0 group-hover:opacity-100 data-[state=active]:group-hover:opacity-100 transition-opacity ml-auto shrink-0"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                }}
                                                onPointerDown={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                }}
                                                onMouseDown={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                }}
                                                onMouseUp={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                }}
                                            >
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-7 w-7"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        setDialogState({
                                                            open: true,
                                                            mode: "edit",
                                                            role,
                                                        });
                                                    }}
                                                >
                                                    <Pencil className="h-3 w-3" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-7 w-7 text-destructive hover:text-destructive"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        setDeletingRole(role);
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
                </div>
            </aside>

            {/* NỘI DUNG CHÍNH BÊN PHẢI */}
            <main className="flex-1 flex flex-col h-full min-h-0">
                {/* HEADER */}
                <header className="p-4 border-b bg-card flex items-center justify-between shrink-0">
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

                {/* VÙNG DANH SÁCH QUYỀN HẠN — VIRTUALIZED */}
                <div
                    ref={scrollRef}
                    className="flex-1 min-h-0 overflow-y-auto max-h-[calc(100vh-160px)]"
                >
                    <div className="max-w-full mx-auto p-6">
                        {isLoadingPermissions ? (
                            <LoadingSpinner />
                        ) : permissionGroupsList.length === 0 ? (
                            <div className="text-center py-12 text-sm text-muted-foreground bg-card border rounded-xl p-6 shadow-sm">
                                {t("No permissions found")}
                            </div>
                        ) : (
                            <div
                                style={{
                                    height: `${virtualizer.getTotalSize()}px`,
                                    width: "100%",
                                    position: "relative",
                                }}
                            >
                                {virtualizer
                                    .getVirtualItems()
                                    .map((virtualItem) => {
                                        const row =
                                            virtualRows[virtualItem.index];

                                        return (
                                            <div
                                                key={virtualItem.key}
                                                style={{
                                                    position: "absolute",
                                                    top: 0,
                                                    left: 0,
                                                    width: "100%",
                                                    height: `${virtualItem.size}px`,
                                                    transform: `translateY(${virtualItem.start}px)`,
                                                }}
                                            >
                                                {row.type ===
                                                    "group-header" && (
                                                    <GroupHeader
                                                        group={row.group}
                                                        store={store}
                                                        isOpen={openGroups.has(
                                                            row.group.group,
                                                        )}
                                                        groupName={
                                                            row.group.group
                                                        }
                                                        onToggleGroupOpen={
                                                            toggleGroupOpen
                                                        }
                                                    />
                                                )}
                                                {row.type ===
                                                    "permission-row" && (
                                                    <PermissionRow
                                                        group={row.group}
                                                        startIdx={row.startIdx}
                                                        store={store}
                                                        isFirstRow={
                                                            row.isFirstRow
                                                        }
                                                        isLastRow={
                                                            row.isLastRow
                                                        }
                                                    />
                                                )}
                                            </div>
                                        );
                                    })}
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-3 border-t bg-card text-[11px] text-muted-foreground flex justify-end shrink-0">
                    <Button
                        className="gap-2 px-4"
                        onClick={handleSavePermissions}
                        disabled={isSaving}
                    >
                        <Save className="h-4 w-4" /> {t("Save")}
                    </Button>
                </div>
            </main>

            {/* SHARED DIALOG */}
            <RoleDialog
                open={dialogState.open}
                onOpenChange={(open) =>
                    setDialogState((prev) => ({ ...prev, open }))
                }
                mode={dialogState.mode}
                initialName={dialogState.role?.name || ""}
                onSave={handleSaveRole}
            />

            {/* DELETE ALERT DIALOG */}
            <AlertDialog
                open={!!deletingRole}
                onOpenChange={(open) => {
                    if (!open && !isDeleting) setDeletingRole(null);
                }}
            >
                <AlertDialogContent size="sm">
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {t("Xoá nhóm quyền")}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {t("Bạn có chắc chắn muốn xoá nhóm quyền")}{" "}
                            <strong>{deletingRole?.name}</strong>?{" "}
                            {t("Hành động này không thể hoàn tác.")}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>
                            {t("Huỷ")}
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={(e) => {
                                e.preventDefault();
                                handleDeleteRole();
                            }}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            disabled={isDeleting}
                        >
                            {isDeleting ? <LoadingSpinner /> : null}
                            {t("Xoá")}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </Tabs>
    );
}

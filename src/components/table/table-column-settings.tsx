import { useState, useEffect, useMemo } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SlidersHorizontal, ArrowUp, ArrowDown, PanelLeft, PanelRight, RotateCcw } from "lucide-react";
import { useTranslation } from "react-i18next";
import { getColumnKey, type ExtendedColumnType } from "@/hooks/useTableColumns";
import type { TableColumnUserSetting, ColumnFixedType } from "@/types/table-config";

interface TableColumnSettingsProps<T extends object> {
    tableId: string;
    baseColumns: ExtendedColumnType<T>[];
    userSettings?: TableColumnUserSetting[];
    onSave: (settings: TableColumnUserSetting[]) => void;
    onReset: () => void;
    isUpdating?: boolean;
}

interface InternalColumnItem {
    key: string;
    title: string;
    hidden: boolean;
    order: number;
    fixed: ColumnFixedType;
}

export function TableColumnSettings<T extends object>({
    baseColumns,
    userSettings = [],
    onSave,
    onReset,
    isUpdating = false,
}: TableColumnSettingsProps<T>) {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);
    const [items, setItems] = useState<InternalColumnItem[]>([]);

    // Sync internal state when popover opens or settings change
    useEffect(() => {
        if (!open) return;

        const settingsMap = new Map<string, TableColumnUserSetting>();
        userSettings.forEach((setting) => {
            if (setting.key) settingsMap.set(setting.key, setting);
        });

        const initialItems: InternalColumnItem[] = baseColumns.map((col, index) => {
            const key = getColumnKey(col);
            const title = typeof col.title === "string" ? col.title : key;
            const setting = settingsMap.get(key);

            return {
                key,
                title,
                hidden: setting?.hidden ?? false,
                order: setting?.order ?? index * 100,
                fixed: setting?.fixed ?? (col.fixed as ColumnFixedType),
            };
        });

        // Sắp xếp theo order
        initialItems.sort((a, b) => a.order - b.order);
        setItems(initialItems);
    }, [open, baseColumns, userSettings]);

    const handleToggleHide = (key: string) => {
        setItems((prev) =>
            prev.map((item) => (item.key === key ? { ...item, hidden: !item.hidden } : item))
        );
    };

    const handleToggleFixed = (key: string, fixedType: ColumnFixedType) => {
        setItems((prev) =>
            prev.map((item) => {
                if (item.key === key) {
                    const newFixed = item.fixed === fixedType ? undefined : fixedType;
                    return { ...item, fixed: newFixed };
                }
                return item;
            })
        );
    };

    const handleMove = (index: number, direction: "up" | "down") => {
        const targetIndex = direction === "up" ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= items.length) return;

        const newItems = [...items];
        const [movedItem] = newItems.splice(index, 1);
        newItems.splice(targetIndex, 0, movedItem);

        // Reassign orders
        const reordered = newItems.map((item, idx) => ({
            ...item,
            order: idx * 100,
        }));
        setItems(reordered);
    };

    const handleSave = () => {
        const payload: TableColumnUserSetting[] = items.map((item, idx) => ({
            key: item.key,
            hidden: item.hidden,
            order: idx * 100,
            fixed: item.fixed,
        }));
        onSave(payload);
        setOpen(false);
    };

    const handleReset = () => {
        onReset();
        setOpen(false);
    };

    const visibleCount = useMemo(() => items.filter((i) => !i.hidden).length, [items]);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                    <SlidersHorizontal className="size-3.5" />
                    <span>{t("Columns")}</span>
                </Button>
            </PopoverTrigger>

            <PopoverContent align="end" className="w-80 p-3 shadow-lg">
                <div className="flex items-center justify-between border-b pb-2 mb-2">
                    <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-sm">{t("Cấu hình cột")}</span>
                        <span className="text-xs text-muted-foreground">
                            ({visibleCount}/{items.length})
                        </span>
                    </div>

                    <Button
                        variant="ghost"
                        size="xs"
                        onClick={handleReset}
                        disabled={isUpdating}
                        className="text-xs text-muted-foreground hover:text-foreground gap-1"
                    >
                        <RotateCcw className="size-3" />
                        {t("Mặc định")}
                    </Button>
                </div>

                <ScrollArea className="h-64 pr-2">
                    <div className="space-y-1.5">
                        {items.map((item, index) => (
                            <div
                                key={item.key}
                                className="flex items-center justify-between p-1.5 rounded-md hover:bg-muted/50 transition-colors text-xs"
                            >
                                <div className="flex items-center gap-2 overflow-hidden mr-2">
                                    <Checkbox
                                        checked={!item.hidden}
                                        onCheckedChange={() => handleToggleHide(item.key)}
                                        id={`col-check-${item.key}`}
                                    />
                                    <label
                                        htmlFor={`col-check-${item.key}`}
                                        className="cursor-pointer truncate font-medium select-none"
                                        title={item.title}
                                    >
                                        {item.title}
                                    </label>
                                </div>

                                <div className="flex items-center gap-1 shrink-0">
                                    {/* Pin left/right */}
                                    <Button
                                        variant={item.fixed === "left" ? "secondary" : "ghost"}
                                        size="icon-xs"
                                        title={t("Ghim bên trái")}
                                        onClick={() => handleToggleFixed(item.key, "left")}
                                    >
                                        <PanelLeft className="size-3" />
                                    </Button>

                                    <Button
                                        variant={item.fixed === "right" ? "secondary" : "ghost"}
                                        size="icon-xs"
                                        title={t("Ghim bên phải")}
                                        onClick={() => handleToggleFixed(item.key, "right")}
                                    >
                                        <PanelRight className="size-3" />
                                    </Button>

                                    {/* Reorder Up/Down */}
                                    <Button
                                        variant="ghost"
                                        size="icon-xs"
                                        disabled={index === 0}
                                        onClick={() => handleMove(index, "up")}
                                    >
                                        <ArrowUp className="size-3" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon-xs"
                                        disabled={index === items.length - 1}
                                        onClick={() => handleMove(index, "down")}
                                    >
                                        <ArrowDown className="size-3" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>

                <div className="flex justify-end gap-2 border-t pt-2 mt-2">
                    <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
                        {t("Hủy")}
                    </Button>
                    <Button size="sm" onClick={handleSave} disabled={isUpdating}>
                        {t("Lưu cấu hình")}
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    );
}

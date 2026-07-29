import { useEffect, useState } from "react";
import { useForm, Controller, type DefaultValues } from "react-hook-form";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RotateCcw, Search } from "lucide-react";
import { t } from "i18next";
import {
    SelectBox,
    type ComboOption,
} from "@/components/select-box/select-box";
import { SelectSearchBox } from "@/components/select-box/select-search-box";
import AutocompleteWithAsync from "@/components/autocomplete/autocomplete-async";

// ─── Field Config Types ──────────────────────────────────────────────────────

export type SearchFieldType = "text" | "select" | "select-search" | "autocomplete-async";

export interface SearchFieldConfig {
    /** Key để map với object form (vd: "email", "role_id") */
    name: string;
    /** Nhãn hiển thị (vd: "Email", "Role") */
    label: string;
    /** Loại input */
    type: SearchFieldType;
    /** Placeholder */
    placeholder?: string;
    /** Các option tĩnh (dùng cho select / select-search) */
    options?: ComboOption[];
    /**
     * Hàm fetch option từ API (dùng cho select / select-search).
     * Nếu có, sẽ ghi đè lên `options` tĩnh sau khi fetch xong.
     */
    fetchOptions?: () => Promise<ComboOption[]>;
    /** Hàm fetch option bất đồng bộ theo từ khoá nhập (dùng cho autocomplete-async) */
    fetchAsyncOptions?: (query: string) => Promise<any[]>;
    /** Hàm custom lấy value cho autocomplete-async */
    getValue?: (item: any) => string;
    /** Hàm custom lấy label cho autocomplete-async */
    getLabel?: (item: any) => string;
    /** Clearable cho select-search */
    clearable?: boolean;
    /** Disabled */
    disabled?: boolean;
    /** Chiếm bao nhiêu cột trên grid (mặc định 1) */
    colSpan?: number;
}

// ─── Component Props ─────────────────────────────────────────────────────────

export interface DynamicSearchBoxProps<T extends Record<string, any>> {
    /** Mảng cấu hình các trường tìm kiếm */
    fields: SearchFieldConfig[];
    /** Giá trị mặc định cho toàn bộ form */
    defaultValues: DefaultValues<T>;
    /** Callback khi nhấn "Search" */
    onSearch: (values: T) => void;
    /** Callback khi nhấn "Reset" */
    onReset: () => void;
    /** Ẩn/hiện search box */
    isCollapsed?: boolean;
    /** Số cột trong grid layout (mặc định 6) */
    columns?: number;
    /** className bổ sung cho Card wrapper */
    className?: string;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function DynamicSearchBox<T extends Record<string, any>>({
    fields,
    defaultValues,
    onSearch,
    onReset,
    isCollapsed = false,
    columns = 6,
    className,
}: DynamicSearchBoxProps<T>) {
    const { register, handleSubmit, reset, control } = useForm<T>({
        defaultValues,
    });

    // State lưu trữ options động từ API
    const [dynamicOptions, setDynamicOptions] = useState<
        Record<string, ComboOption[]>
    >({});

    // Fetch options động khi mount
    useEffect(() => {
        fields.forEach((field) => {
            if (field.fetchOptions) {
                field
                    .fetchOptions()
                    .then((opts) => {
                        setDynamicOptions((prev) => ({
                            ...prev,
                            [field.name]: opts,
                        }));
                    })
                    .catch((err) =>
                        console.error(
                            `Error fetching options for ${field.name}:`,
                            err,
                        ),
                    );
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleReset = () => {
        reset(defaultValues);
        onReset();
    };

    const getOptions = (field: SearchFieldConfig): ComboOption[] => {
        return dynamicOptions[field.name] || field.options || [];
    };

    const renderField = (field: SearchFieldConfig) => {
        switch (field.type) {
            case "text":
                return (
                    <Input
                        {...register(field.name as any)}
                        placeholder={field.placeholder}
                        disabled={field.disabled}
                    />
                );

            case "select":
                return (
                    <Controller
                        name={field.name as any}
                        control={control}
                        render={({ field: { onChange, value } }) => (
                            <SelectBox
                                value={value ?? ""}
                                options={getOptions(field)}
                                onChange={onChange}
                                placeholder={field.placeholder}
                            />
                        )}
                    />
                );

            case "select-search":
                return (
                    <Controller
                        name={field.name as any}
                        control={control}
                        render={({ field: { onChange, value } }) => (
                            <SelectSearchBox
                                value={value ?? ""}
                                options={getOptions(field)}
                                onChange={onChange}
                                placeholder={field.placeholder}
                                clearable={field.clearable}
                                disabled={field.disabled}
                            />
                        )}
                    />
                );

            case "autocomplete-async":
                return (
                    <Controller
                        name={field.name as any}
                        control={control}
                        render={({ field: { onChange, value } }) => (
                            <AutocompleteWithAsync
                                value={value ?? ""}
                                onChange={onChange}
                                placeholder={field.placeholder}
                                fetchOptions={field.fetchAsyncOptions}
                                getValue={field.getValue}
                                getLabel={field.getLabel}
                                disabled={field.disabled}
                                showClear={field.clearable ?? false}
                            />
                        )}
                    />
                );

            default:
                return null;
        }
    };

    return (
        <Card
            className={`search-box grid gap-4 p-4 transition-all duration-300 overflow-hidden ${
                isCollapsed ? "hidden" : `grid-cols-${columns}`
            } ${className ?? ""}`}
        >
            {fields.map((field) => (
                <div
                    key={field.name}
                    className={`flex flex-col gap-2 ${
                        field.colSpan ? `col-span-${field.colSpan}` : ""
                    }`}
                >
                    <Label>{field.label}</Label>
                    {renderField(field)}
                </div>
            ))}

            {/* Action Buttons */}
            <div className="flex items-end justify-start space-x-2">
                <Button type="button" variant="outline" onClick={handleReset}>
                    <RotateCcw />
                    {t("Reset")}
                </Button>
                <Button
                    type="button"
                    variant="default"
                    onClick={handleSubmit((data) => onSearch(data as T))}
                >
                    <Search />
                    {t("Search")}
                </Button>
            </div>
        </Card>
    );
}

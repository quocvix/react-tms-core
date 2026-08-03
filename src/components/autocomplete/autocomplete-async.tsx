"use client";

import type { ReactNode } from "react";
import { useEffect, useState, useCallback } from "react";
import { motion } from "motion/react";
import { LoaderCircleIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Autocomplete,
    AutocompleteContent,
    AutocompleteInput,
    AutocompleteItem,
    AutocompleteList,
    AutocompleteStatus,
} from "@/components/ui/autocomplete";
import { useTranslation } from "react-i18next";

export interface AutocompleteOption {
    id?: string | number;
    value?: string | number;
    label?: string;
    name?: string;
    title?: string;
    code?: string;
    description?: string;
    position?: string;
    subtext?: string;
    avatar?: string;
    image?: string;
    [key: string]: any;
}

export interface AutocompleteWithAsyncProps<T = any> {
    value?: string | null;
    onChange?: (val: string | null, option?: T | null) => void;
    onSelectOption?: (option: T | null) => void;
    placeholder?: string;
    fetchOptions?: (query: string) => Promise<T[]>;
    getValue?: (item: T) => string;
    getLabel?: (item: T) => string;
    getDescription?: (item: T) => string | undefined;
    getAvatar?: (item: T) => string | undefined;
    renderItem?: (item: T, index: number) => ReactNode;
    debounceMs?: number;
    disabled?: boolean;
    showClear?: boolean;
    showTrigger?: boolean;
    className?: string;
}

const SPRING = { type: "spring", bounce: 0.15, duration: 0.3 } as const;

export default function AutocompleteWithAsync<T = AutocompleteOption>({
    value,
    onChange,
    onSelectOption,
    placeholder = "Autocomplete...",
    fetchOptions,
    getValue,
    getLabel,
    getDescription,
    getAvatar,
    renderItem,
    debounceMs = 300,
    disabled = false,
    showClear = false,
    showTrigger = false,
    className,
}: AutocompleteWithAsyncProps<T>) {
    const { t } = useTranslation();
    const [inputValue, setInputValue] = useState(value ?? "");
    const [isLoading, setIsLoading] = useState(false);
    const [results, setResults] = useState<T[]>([]);
    const [error, setError] = useState<string | null>(null);

    // Sync external controlled value
    useEffect(() => {
        if (value !== undefined) {
            setInputValue(value ?? "");
            if (!value) {
                setResults([]);
                setError(null);
                setIsLoading(false);
            }
        }
    }, [value]);

    // Default helper extractors
    const defaultGetValue = useCallback(
        (item: any): string => {
            if (getValue) return getValue(item);
            if (item == null) return "";
            return String(item.value ?? item.id ?? item.item_id ?? item.code ?? item.name ?? item.item_name ?? item);
        },
        [getValue],
    );

    const defaultGetLabel = useCallback(
        (item: any): string => {
            if (getLabel) return getLabel(item);
            if (item == null) return "";
            return String(item.label ?? item.item_name ?? item.name ?? item.title ?? item.code ?? item);
        },
        [getLabel],
    );

    const defaultGetDescription = useCallback(
        (item: any): string | undefined => {
            if (getDescription) return getDescription(item);
            if (item == null || typeof item !== "object") return undefined;
            return item.description ?? item.position ?? item.subtext ?? undefined;
        },
        [getDescription],
    );

    const defaultGetAvatar = useCallback(
        (item: any): string | undefined => {
            if (getAvatar) return getAvatar(item);
            if (item == null || typeof item !== "object") return undefined;
            return item.avatar ?? item.image ?? undefined;
        },
        [getAvatar],
    );

    // Fetch options with debounce
    useEffect(() => {
        if (!inputValue || !fetchOptions) {
            setResults([]);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError(null);
        let ignore = false;

        const timer = setTimeout(async () => {
            try {
                const data = await fetchOptions(inputValue);
                if (!ignore) {
                    setResults(Array.isArray(data) ? data : []);
                }
            } catch (err: any) {
                if (!ignore) {
                    setError(err?.message || t("Failed to fetch suggestions."));
                    setResults([]);
                }
            } finally {
                if (!ignore) setIsLoading(false);
            }
        }, debounceMs);

        return () => {
            clearTimeout(timer);
            ignore = true;
        };
    }, [inputValue, fetchOptions, debounceMs, t]);

    const handleInputValueChange = (val: string) => {
        setInputValue(val);
        const selected = results.find((r) => defaultGetValue(r) === val || defaultGetLabel(r) === val);
        onChange?.(val, selected ?? null);
        onSelectOption?.(selected ?? null);
    };

    const handleValueChange = (val: string | null) => {
        const selected = results.find((r) => defaultGetValue(r) === val || defaultGetLabel(r) === val);
        onChange?.(val, selected ?? null);
        onSelectOption?.(selected ?? null);
    };

    let status: ReactNode = null;
    if (isLoading) {
        status = (
            <div className="flex items-center gap-2">
                <LoaderCircleIcon className="size-4 animate-spin" />
                {t("Loading...")}
            </div>
        );
    } else if (error) {
        status = error;
    } else if (inputValue && fetchOptions && results.length === 0) {
        status = t('No results found for "{{inputValue}}"', { inputValue });
    } else if (results.length > 0) {
        status = t("{{count}} results found", { count: results.length });
    }

    return (
        <div className={`w-full ${className ?? ""}`}>
            <Autocomplete
                value={value}
                onValueChange={handleValueChange}
                onInputValueChange={handleInputValueChange}
                disabled={disabled}
            >
                <div className="flex flex-col items-start gap-2">
                    <AutocompleteInput placeholder={t(placeholder)} showTrigger={showTrigger} showClear={showClear} />
                </div>

                {inputValue && fetchOptions && (
                    <AutocompleteContent>
                        {status && <AutocompleteStatus>{status}</AutocompleteStatus>}
                        <AutocompleteList>
                            {results.map((item, idx) => {
                                const itemVal = defaultGetValue(item);
                                const itemLabel = defaultGetLabel(item);
                                const itemDesc = defaultGetDescription(item);
                                const itemAvatar = defaultGetAvatar(item);

                                return (
                                    <AutocompleteItem
                                        key={itemVal || idx}
                                        value={itemVal || itemLabel}
                                        label={itemLabel}
                                        className="rounded-lg py-1.5"
                                    >
                                        {renderItem ? (
                                            renderItem(item, idx)
                                        ) : (
                                            <motion.div
                                                initial={{ opacity: 0, x: -16 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ ...SPRING, delay: idx * 0.04 }}
                                                className="flex w-full items-center gap-2.5"
                                            >
                                                {itemAvatar && (
                                                    <Avatar className="size-8 shrink-0">
                                                        <AvatarImage src={itemAvatar} alt={itemLabel} />
                                                        <AvatarFallback>
                                                            {itemLabel
                                                                .split(" ")
                                                                .map((n) => n[0])
                                                                .join("")}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                )}
                                                <div className="min-w-0 flex-1">
                                                    <p className="truncate text-sm font-medium">{itemLabel}</p>
                                                    {itemDesc && (
                                                        <p className="text-muted-foreground truncate text-xs">
                                                            {itemDesc}
                                                        </p>
                                                    )}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AutocompleteItem>
                                );
                            })}
                        </AutocompleteList>
                    </AutocompleteContent>
                )}
            </Autocomplete>
        </div>
    );
}

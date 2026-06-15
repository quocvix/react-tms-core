import * as React from "react";
import { cn } from "@/lib/utils";
import { t } from "i18next";
import { Check, ChevronDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { type ComboOption } from "@/components/select-box/select-box";

export interface SelectSearchBoxProps {
    value: string;
    options: ComboOption[];
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
    clearable?: boolean;
    disabled?: boolean;
}

export function SelectSearchBox({
    value,
    options,
    onChange,
    placeholder = "Select...",
    className,
    clearable = false,
    disabled = false,
}: SelectSearchBoxProps) {
    const [open, setOpen] = React.useState(false);

    const selectedOption = options.find((o) => o.value === value);

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange("");
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    disabled={disabled}
                    className={cn(
                        "w-full justify-between bg-transparent hover:bg-transparent font-normal",
                        !value && "text-muted-foreground",
                        className,
                    )}
                >
                    <div className="flex items-center truncate text-foreground">
                        {selectedOption ? (
                            <>
                                {selectedOption.icon && (
                                    <selectedOption.icon className="mr-2 h-4 w-4 shrink-0" />
                                )}
                                <span className="truncate">
                                    {t(selectedOption.label)}
                                </span>
                            </>
                        ) : (
                            <span className="truncate">{placeholder}</span>
                        )}
                    </div>
                    <div className="flex items-center shrink-0 ml-2">
                        {value && clearable && (
                            <>
                                <div
                                    role="button"
                                    tabIndex={0}
                                    className="p-1 hover:bg-muted rounded-full"
                                    onClick={handleClear}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter")
                                            handleClear(e as any);
                                    }}
                                >
                                    <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                                </div>
                                <Separator
                                    orientation="vertical"
                                    className="mx-1 mt-1 h-4"
                                />
                            </>
                        )}
                        <ChevronDown className="h-4 w-4 opacity-50 shrink-0" />
                    </div>
                </Button>
            </PopoverTrigger>
            <PopoverContent
                className="w-(--radix-popover-trigger-width) p-0"
                align="start"
            >
                <Command className="**:data-[slot=input-group]:bg-transparent">
                    <CommandInput placeholder={t("Search...")} />
                    <CommandList>
                        <CommandEmpty>{t("No data available")}</CommandEmpty>
                        <CommandGroup className="max-h-60 overflow-auto">
                            {options.map((option) => (
                                <CommandItem
                                    key={option.value}
                                    value={t(option.label)}
                                    onSelect={() => {
                                        onChange(option.value);
                                        setOpen(false);
                                    }}
                                    data-checked={value === option.value}
                                    className="data-selected:bg-accent data-selected:text-accent-foreground"
                                >
                                    {option.icon && (
                                        <option.icon className="mr-2 h-4 w-4 text-muted-foreground shrink-0" />
                                    )}
                                    <span className="truncate">
                                        {t(option.label)}
                                    </span>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}

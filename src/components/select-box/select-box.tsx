import { cn } from "@/lib/utils";
import { t } from "i18next";
import {
    Combobox,
    ComboboxInput,
    ComboboxContent,
    ComboboxList,
    ComboboxItem,
    ComboboxEmpty,
} from "@/components/ui/combobox";

export interface ComboOption {
    label: string;
    value: string;
    icon?: React.ComponentType<{ className?: string }>;
}

export interface SelectBoxProps {
    value: string;
    options: ComboOption[];
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
    disabled?: boolean;
}

export function SelectBox({
    value,
    options,
    onChange,
    placeholder = "Select...",
    className,
    disabled = false,
}: SelectBoxProps) {
    const getLabel = (val: string) => {
        return options.find((o) => o.value === val)?.label ?? val;
    };

    return (
        <Combobox
            value={value}
            onValueChange={(val) => onChange(val ?? "")}
            itemToStringLabel={getLabel}
            items={options}
            filter={() => true}
            disabled={disabled}
        >
            <ComboboxInput
                placeholder={t(placeholder)}
                className={cn(
                    "w-full [&_input]:cursor-pointer [&_input]:select-none [&_input]:caret-transparent",
                    className,
                )}
                readOnly
            />
            <ComboboxContent>
                <ComboboxEmpty>{t("No data available")}</ComboboxEmpty>
                <ComboboxList>
                    {options.map((option) => (
                        <ComboboxItem key={option.value} value={option.value}>
                            {t(option.label)}
                        </ComboboxItem>
                    ))}
                </ComboboxList>
            </ComboboxContent>
        </Combobox>
    );
}

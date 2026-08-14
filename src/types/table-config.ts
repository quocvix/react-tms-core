export type ColumnFixedType = "left" | "right" | "start" | "end" | boolean | undefined;

export interface TableColumnUserSetting {
    key: string;
    width?: number;
    hidden?: boolean;
    order?: number;
    fixed?: ColumnFixedType;
}

export interface TableUserConfig {
    tableId: string;
    version?: number;
    columns: TableColumnUserSetting[];
}

export type RoleItem = {
    id: number;
    name: string;
    is_edit: number;
};

export type RolesResponse = {
    data: RoleItem[];
};

export type RoleItemResponse = {
    id: number;
    name: string;
    permission_ids: number[];
    permissions: string[];
};

export type RoleDetailResponse = {
    data: RoleItemResponse;
};

export type PermissionItem = {
    id: number;
    name: string;
    guard_name: string;
    created_at: string;
    updated_at: string;
    group: string;
};

export type PermissionGroup = {
    group: string;
    permissions: PermissionItem[];
};

export type PermissionResponse = {
    data: PermissionGroup[];
};

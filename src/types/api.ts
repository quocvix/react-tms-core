export interface PaginationMeta {
    total: number;
    count: number;
    per_page: number;
    current_page: number;
    total_pages: number;
    links?: {
        next?: string;
        previous?: string;
    };
}

export interface ApiResponseMeta {
    pagination?: PaginationMeta;
}

export interface ApiListResponse<T> {
    data: T[];
    meta?: ApiResponseMeta;
}

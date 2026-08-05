import API from "@/lib/api";
import api from "@/lib/axios";
import type { PaginationMeta } from "@/types/api";

export interface LanguageResponse {
    data: Record<string, string>;
}

export interface LanguageQueryParams {
    message?: string;
    translate?: string;
    lg_type?: string;
    language_code?: string;
    limit?: number;
    page?: number;
}

export interface LanguageItem {
    lg_id: number;
    lg_dtl_id: number;
    message: string;
    language_code: string;
    translate: string;
    created_at: string;
}

export interface LanguageTableResponse {
    data: LanguageItem[];
    meta: {
        pagination: PaginationMeta;
    };
}

const languageService = {
    getAllLanguages: async (language_code: string) => {
        const res = await api.get<LanguageResponse>(
            API.URL_MASTER_DATA_V1 +
                `/languages/all-messages?language_code=${language_code}`,
        );
        return res.data;
    },
    
    getLanguagesTable: async (params: LanguageQueryParams) => {
        const res = await api.get<LanguageTableResponse>(
            API.URL_MASTER_DATA_V1 + "/languages",
            { params }
        );
        return res.data;
    }
};

export default languageService;

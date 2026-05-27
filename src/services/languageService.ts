import API from "@/lib/api";
import api from "@/lib/axios";

export interface LanguageResponse {
    data: Record<string, string>;
}

const languageService = {
    getAllLanguages: async (language_code: string) => {
        const res = await api.get<LanguageResponse>(
            API.URL_MASTER_DATA_V1 +
                `/languages/all-messages?language_code=${language_code}`,
        );
        return res.data;
    },
};

export default languageService;

import i18n from "@/lib/i18n";
import languageService from "@/services/languageService";
import type { LanguageState } from "@/types/store";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useLanguageStore = create<LanguageState>()(
    persist(
        (set, get) => ({
            language: "vi",
            isLoadingLanguage: false,

            setLanguage: async (lang: string) => {
                set({ language: lang });
                i18n.changeLanguage(lang);
                // Tự động fetch translations từ API khi đổi ngôn ngữ
                await get().fetchLanguages(lang);
            },

            fetchLanguages: async (langCode?: string) => {
                const code = langCode || get().language;
                set({ isLoadingLanguage: true });
                try {
                    const res = await languageService.getAllLanguages(code);
                    const translations = res.data;

                    // Ghi đè lên resource hiện tại (vi.json/en.json)
                    // deep: true → merge sâu, overwrite: true → ưu tiên data API
                    i18n.addResourceBundle(
                        code,
                        "translation",
                        translations,
                        true,
                        true,
                    );
                } catch (error) {
                    // Nếu API lỗi → giữ nguyên data từ vi.json/en.json (fallback)
                    console.warn(
                        `[i18n] Failed to fetch languages from API for "${code}", using local fallback.`,
                        error,
                    );
                } finally {
                    set({ isLoadingLanguage: false });
                }
            },
        }),
        {
            name: "language-storage",
        },
    ),
);

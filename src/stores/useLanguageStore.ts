import i18n from "@/lib/i18n";
import type { LanguageState } from "@/types/store";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useLanguageStore = create<LanguageState>()(
    persist(
        (set) => ({
            language: "vi",

            setLanguage: (lang: string) => {
                set({ language: lang });
                i18n.changeLanguage(lang);
            },
        }),
        {
            name: "language-storage",
        },
    ),
);

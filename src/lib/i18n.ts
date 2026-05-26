import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import vi from "@/locales/vi.json";
import en from "@/locales/en.json";

const savedLanguage = localStorage.getItem("language-storage");
let defaultLang = "vi";

if (savedLanguage) {
    try {
        const parsed = JSON.parse(savedLanguage);
        if (parsed?.state?.language) {
            defaultLang = parsed.state.language;
        }
    } catch {
        // ignore parse errors
    }
}

i18n.use(initReactI18next).init({
    resources: {
        vi: { translation: vi },
        en: { translation: en },
    },
    lng: defaultLang,
    fallbackLng: "en",
    keySeparator: false,
    interpolation: {
        escapeValue: false,
    },
});

export default i18n;

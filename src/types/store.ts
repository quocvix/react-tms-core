import type { User, CurrentHub } from "./user";

export interface AuthState {
    user: User | null;
    accessToken: string | null;
    loading: boolean;
    hasCheckedToken: boolean;

    setAccessToken: (accessToken: string) => void;

    clearState: () => void;

    signIn: (email: string, password: string, platform: string, device_id: string) => Promise<void>;

    signOut: () => Promise<void>;
    
    fetchMe: () => Promise<void>;

    setCurrentHub: (hub: CurrentHub) => void;
}

export interface ThemeState {
    isDark: boolean;
    toggleTheme: () => void;
    setTheme: (dark: boolean) => void;
}

export interface LanguageState {
    language: string;
    setLanguage: (lang: string) => void;
}

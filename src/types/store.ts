import type { User } from "./user";

export interface AuthState {
    user: User | null;
    accessToken: string | null;
    loading: boolean;

    setAccessToken: (accessToken: string) => void;

    clearState: () => void;

    signIn: (username: string, password: string) => Promise<void>;

    signOut: () => Promise<void>;
    
    fetchMe: () => Promise<void>;
}

export interface ThemeState {
    isDark: boolean;
    toggleTheme: () => void;
    setTheme: (dark: boolean) => void;
}

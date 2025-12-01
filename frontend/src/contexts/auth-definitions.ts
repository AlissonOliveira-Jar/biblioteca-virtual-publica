import { createContext } from 'react';
import type {UserProfile} from "../services/userService.ts";

export interface AuthContextType {
    isAuthenticated: boolean;
    userName: string | null;
    userId: string | null;
    roles: string[];
    user: UserProfile | null;
    isLoading: boolean;
    login: (token: string) => void;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);
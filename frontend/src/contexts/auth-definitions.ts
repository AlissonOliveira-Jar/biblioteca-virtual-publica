import { createContext } from 'react';

export interface AuthContextType {
  isAuthenticated: boolean;
  userName: string | null;
  login: (token: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

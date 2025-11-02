import { createContext } from 'react';

export interface AuthContextType {
  isAuthenticated: boolean;
  userName: string | null;
  userId: string | null;
  roles: string[];
  isLoading: boolean;
  login: (token: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

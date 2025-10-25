import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './auth-definitions';

import type { ReactNode } from 'react';
import type { AuthContextType } from './auth-definitions';

interface DecodedToken {
  sub: string;
  exp: number;
  name: string;
  roles: string[];
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [roles, setRoles] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true); 
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true); 
    const token = localStorage.getItem('authToken');
    try {
      if (token) {
        const decodedToken = jwtDecode<DecodedToken>(token);
        if (decodedToken.exp * 1000 > Date.now()) {
          setIsAuthenticated(true);
          setUserName(decodedToken.name);
          setUserId(decodedToken.sub);
          setRoles(decodedToken.roles);
        } else {
          localStorage.removeItem('authToken');
          setIsAuthenticated(false); 
          setUserName(null);
          setUserId(null);
          setRoles([]);
        }
      } else {
         setIsAuthenticated(false);
         setUserName(null);
         setUserId(null);
         setRoles([]);
      }
    } catch (error) {
      console.error("Token inválido ao carregar:", error);
      localStorage.removeItem('authToken');
      setIsAuthenticated(false);
      setUserName(null);
      setUserId(null);
      setRoles([]);
    } finally {
      setIsLoading(false); 
    }
  }, []); 

  const login = (token: string) => {
    localStorage.setItem('authToken', token);
    try {
      const decodedToken = jwtDecode<DecodedToken>(token);
      setIsAuthenticated(true);
      setUserName(decodedToken.name);
      setUserId(decodedToken.sub);
      setRoles(decodedToken.roles);
      setIsLoading(false); 
      navigate('/home');
    } catch (error) {
      console.error("Erro ao decodificar token no login:", error);
      logout();
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
    setUserName(null);
    setUserId(null);
    setRoles([]);
    setIsLoading(false); 
    navigate('/login');
  };

  const contextValue: AuthContextType = {
    isAuthenticated,
    userName,
    userId,
    roles,
    isLoading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

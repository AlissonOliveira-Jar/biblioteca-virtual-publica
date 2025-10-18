import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './auth-definitions';

import type { ReactNode } from 'react';

interface DecodedToken {
  sub: string;
  exp: number;
  name: string;
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userName, setUserName] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const decodedToken = jwtDecode<DecodedToken>(token);
        if (decodedToken.exp * 1000 > Date.now()) {
          setIsAuthenticated(true);
          setUserName(decodedToken.name); 
        } else {
          localStorage.removeItem('authToken');
        }
      } catch (error) {
        console.error("Token inválido:", error);
        localStorage.removeItem('authToken');
      }
    }
  }, []);

  const login = (token: string) => {
    localStorage.setItem('authToken', token);
    try {
      const decodedToken = jwtDecode<DecodedToken>(token);
      setIsAuthenticated(true);
      setUserName(decodedToken.name); 
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
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userName, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

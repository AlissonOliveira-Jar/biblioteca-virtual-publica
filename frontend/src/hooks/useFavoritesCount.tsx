import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { favoritoService, type FavoritoResponse } from '../services/favoritoService'; 
import { useAuth } from '../hooks/useAuth'; 

interface FavoritesContextType {
  favoriteIds: string[];
  isLoading: boolean;
  updateFavorites: (livroId: string, isFavoriting: boolean) => void;
  refetchFavorites: () => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

interface FavoritesProviderProps {
  children: ReactNode;
}

export const FavoritesProvider: React.FC<FavoritesProviderProps> = ({ children }) => {
  const { isAuthenticated, userId, isLoading: isAuthLoading } = useAuth(); 
  
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [isLoadingFavs, setIsLoadingFavs] = useState(true); 

  const isLoading = isAuthLoading || isLoadingFavs;

  const fetchFavorites = useCallback(async () => {
    if (!isAuthenticated || !userId) {
      setFavoriteIds([]);
      setIsLoadingFavs(false); 
      return;
    }
    
    setIsLoadingFavs(true);
    try {
      const favsResponse: FavoritoResponse[] = await favoritoService.listar(); 
      
      const ids = favsResponse
        .map(f => f.livro.id) 
        .filter((id): id is string => id !== undefined);

      setFavoriteIds(Array.from(new Set(ids)));
    } catch (error) {
      console.error("Erro ao carregar favoritos (Auth OK):", error);
      setFavoriteIds([]);
    } finally {
      setIsLoadingFavs(false);
    }
  }, [isAuthenticated, userId]);

  useEffect(() => {
    fetchFavorites();
  }, [isAuthenticated, userId, fetchFavorites]);

  const updateFavorites = useCallback((livroId: string, isFavoriting: boolean) => {
    setFavoriteIds(prevIds => {
      if (isFavoriting) {
        return prevIds.includes(livroId) ? prevIds : [...prevIds, livroId];
      } else {
        return prevIds.filter(id => id !== livroId);
      }
    });
  }, []);

  const contextValue = {
    favoriteIds,
    isLoading,
    updateFavorites,
    refetchFavorites: fetchFavorites,
  };

  return (
    <FavoritesContext.Provider value={contextValue}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavoritesCount = (): FavoritesContextType => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavoritesCount must be used within a FavoritesProvider');
  }
  return context;
};

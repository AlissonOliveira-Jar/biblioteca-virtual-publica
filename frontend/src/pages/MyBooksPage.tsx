import { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { FaBook, FaSpinner, FaSadTear } from 'react-icons/fa';
import { livroService } from '../services/livroService';
import { favoritoService } from '../services/favoritoService';
import type { Livro } from '../types/livro';
import BookCard from '../components/BookCard';
import { useFavoritesCount } from '../hooks/useFavoritesCount';

const MyBooksPage = () => {
  const { favoriteIds, updateFavorites, isLoading: isContextLoading } = useFavoritesCount(); 
  
  const [favoriteLivros, setFavoriteLivros] = useState<Livro[]>([]);
  const [loading, setLoading] = useState(true);

  const toggleFavorito = useCallback(async (livroId: string) => {
    const isCurrentlyFavorite = favoriteIds.includes(livroId);
    
    updateFavorites(livroId, !isCurrentlyFavorite);
    
    if (isCurrentlyFavorite) {
        setFavoriteLivros(prev => prev.filter(l => l.id !== livroId));
    }
    
    try {
      if (isCurrentlyFavorite) {
        await favoritoService.remover(livroId);
        toast("Livro removido da sua estante.", { icon: '💔' });
      } else {
        await favoritoService.adicionar(livroId);
        toast.success("Livro adicionado aos favoritos!");
      }
    } catch {
      updateFavorites(livroId, isCurrentlyFavorite); 
      if (isCurrentlyFavorite) {
      }
      toast.error("Erro ao atualizar favorito. Tente novamente.");
    }
  }, [favoriteIds, updateFavorites]);

  const fetchFavoriteLivros = useCallback(async () => {
    if (favoriteIds.length === 0) {
        setFavoriteLivros([]);
        setLoading(false);
        return;
    }

    setLoading(true);
    try {
      const allLivros = await livroService.getAllLivros();
      const filteredLivros = allLivros.filter(livro => livro.id && favoriteIds.includes(livro.id));

      setFavoriteLivros(filteredLivros);

    } catch (error) {
      toast.error("Não foi possível carregar seus livros favoritos.");
      console.error("Erro ao buscar livros favoritos:", error);
    } finally {
      setLoading(false);
    }
  }, [favoriteIds]);

  useEffect(() => {
    if (!isContextLoading) {
        fetchFavoriteLivros();
    }
  }, [isContextLoading, favoriteIds, fetchFavoriteLivros]);

  if (loading || isContextLoading) {
    return (
      <div className="grow flex items-center justify-center h-64">
        <FaSpinner className="animate-spin text-4xl text-violet-500" />
        <p className="ml-4 text-gray-400">Carregando seus favoritos...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto py-8">
      {/* Cabeçalho Padronizado */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-purple-800 to-violet-500 flex items-center gap-3">
          <FaBook className="text-violet-500" /> Minha Estante
        </h1>
      </div>

      {/* --- Renderização da Lista Vazia --- */}
      {favoriteLivros.length === 0 && (
        <div className="text-center py-16 bg-zinc-800/50 rounded-xl border border-zinc-700">
           <FaSadTear className="mx-auto text-6xl text-zinc-600 mb-4" />
          <h2 className="text-2xl font-bold text-zinc-400 mb-2">Estante Vazia</h2>
          <p className="text-zinc-500 max-w-md mx-auto">
            Você ainda não favoritou nenhum livro. Acesse a página <strong>Descobrir Livros</strong> para encontrar novos títulos.
          </p>
        </div>
      )}

      {/* --- Grid de Livros Favoritos --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {favoriteLivros.map((livro) => (
          <BookCard 
            key={livro.id}
            livro={livro}
            isFavorite={true}
            onToggleFavorite={toggleFavorito}
          />
        ))}
      </div>
    </div>
  );
};

export default MyBooksPage;

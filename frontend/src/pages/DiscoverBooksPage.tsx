import { useEffect, useState, useCallback } from "react";
import { livroService } from "../services/livroService";
import { favoritoService } from "../services/favoritoService";
import type { Livro } from "../types/livro";
import { FaSpinner, FaBookOpen, FaSadTear } from "react-icons/fa";
import toast from "react-hot-toast";
import BookCard from "../components/BookCard";
import { useFavoritesCount } from '../hooks/useFavoritesCount';
import axios from 'axios';

const DiscoverBooksPage = () => {
  const { favoriteIds, updateFavorites, isLoading: isContextLoading } = useFavoritesCount(); 
  
  const [livros, setLivros] = useState<Livro[]>([]);
  const [loading, setLoading] = useState(true);

  const toggleFavorito = useCallback(async (livroId: string) => {
    const isCurrentlyFavorite = favoriteIds.includes(livroId);
    
    updateFavorites(livroId, !isCurrentlyFavorite);
    
    try {
      if (isCurrentlyFavorite) {
        await favoritoService.remover(livroId);
        toast("Removido dos favoritos", { icon: '💔' });
      } else {
        await favoritoService.adicionar(livroId);
        toast.success("Adicionado aos favoritos!");
      }
    } catch (error) {
      const isConflictWhileAdding = 
        !isCurrentlyFavorite && 
        axios.isAxiosError(error) && 
        error.response?.status === 409;

      if (isConflictWhileAdding) {
        toast.success("Livro já estava nos favoritos!", { icon: '✅' });
      } else {
        updateFavorites(livroId, isCurrentlyFavorite); 
        toast.error("Erro ao atualizar favorito. Tente novamente.");
        console.error("Erro de API inesperado:", error);
      }
    }
  }, [favoriteIds, updateFavorites]);

  useEffect(() => {
    const loadLivros = async () => {
      setLoading(true);
      try {
        const todos = await livroService.getAllLivros();
        setLivros(todos);
      } catch (e) {
        console.error("Erro ao carregar livros:", e);
        toast.error("Erro ao carregar livros.");
      } finally {
        setLoading(false);
      }
    };
    if (!isContextLoading) {
      loadLivros();
    }
  }, [isContextLoading]);


  if (loading || isContextLoading)
    return (
      <div className="flex justify-center p-10 grow items-center">
        <FaSpinner className="animate-spin text-4xl text-violet-500" />
        <p className="ml-4 text-gray-400">Buscando novos livros...</p>
      </div>
    );

  return (
    <div className="w-full max-w-7xl mx-auto py-8">
      {/* Cabeçalho Padronizado */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-purple-800 to-violet-500 flex items-center gap-3">
          <FaBookOpen className="text-violet-500" /> Descobrir Livros
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {livros.map(livro => (
          <BookCard
            key={livro.id}
            livro={livro}
            isFavorite={favoriteIds.includes(livro.id!)}
            onToggleFavorite={toggleFavorito}
          />
        ))}
      </div>
      
      {livros.length === 0 && !loading && (
          <div className="text-center py-16 bg-zinc-800/50 rounded-xl border border-zinc-700">
            <FaSadTear className="mx-auto text-6xl text-zinc-600 mb-4" />
            <p className="text-zinc-500">Nenhum livro encontrado para exibir.</p>
          </div>
      )}
    </div>
  );
};

export default DiscoverBooksPage;

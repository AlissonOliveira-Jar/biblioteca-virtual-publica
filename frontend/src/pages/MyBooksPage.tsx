import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaBook, FaSpinner, FaEye, FaInfoCircle, FaSadTear } from 'react-icons/fa';
import { livroService } from '../services/livroService';
import type { Livro } from '../types/livro';

const MyBooksPage = () => {
  const [livros, setLivros] = useState<Livro[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLivros = async () => {
      setLoading(true);
      try {
        const data = await livroService.getAllLivros();
        setLivros(data);
      } catch (error) {
        toast.error("Não foi possível carregar a estante de livros.");
        console.error("Erro ao buscar todos os livros:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLivros();
  }, []);

  if (loading) {
    return (
      <div className="grow flex items-center justify-center h-64">
        <FaSpinner className="animate-spin text-primary text-4xl" />
        <p className="ml-4 text-gray-400">Carregando estante...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto py-8">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-purple-800 to-violet-500 flex items-center gap-3">
          <FaBook /> Minha Estante
        </h1>
      </div>

      {/* --- Renderização da Lista Vazia --- */}
      {!loading && livros.length === 0 && (
        <div className="text-center py-16 bg-zinc-800/50 rounded-lg border border-zinc-700">
           <FaSadTear className="mx-auto text-6xl text-zinc-600 mb-4" />
          <h2 className="text-2xl font-bold text-zinc-400 mb-2">Estante Vazia</h2>
          <p className="text-zinc-500">Ainda não há livros cadastrados no sistema.</p>
        </div>
      )}

      {/* --- Grid de Livros --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {livros.map((livro) => (
          <div 
            key={livro.id} 
            className="bg-zinc-800 border border-zinc-700 rounded-lg shadow-lg flex flex-col justify-between overflow-hidden"
          >
            {/* Seção de Conteúdo */}
            <div className="p-5">
              <h2 className="text-xl font-bold text-white truncate mb-2" title={livro.titulo}>
                {livro.titulo}
              </h2>
              <p className="text-gray-400 text-sm mb-1">
                ISBN: {livro.isbn}
              </p>
              {/* NOTA: O objeto 'livro' aqui (de getAllLivros) 
                provavelmente não tem o nome do autor, só o 'autorId'.
                Se quiséssemos o nome, teríamos que buscá-lo ou mudar o DTO do backend.
                Por enquanto, vamos omitir o nome do autor nesta view.
              */}
            </div>
            
            <div className="grid grid-cols-2 border-t border-zinc-700">
              {livro.googleDriveFileId ? (
                <Link
                  to={`/livros/${livro.id}/ler`}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-primary/20 text-primary 
                             hover:bg-primary hover:text-white transition-colors font-medium"
                >
                  <FaEye />
                  Ler Agora
                </Link>
              ) : (
                <span 
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-zinc-700/30 text-zinc-500 
                             cursor-not-allowed"
                  title="Nenhum arquivo digital disponível"
                >
                  <FaEye />
                  Ler Agora
                </span>
              )}

              {/* Botão de Detalhes */}
              <Link
                to={`/livros/${livro.id}`}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-zinc-700/30 text-gray-300 
                           hover:bg-zinc-600 transition-colors font-medium border-l border-zinc-700"
              >
                <FaInfoCircle />
                Detalhes
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyBooksPage;

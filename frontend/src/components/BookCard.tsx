import React from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaBookReader, FaInfoCircle } from 'react-icons/fa';
import type { Livro } from '../types/livro';

interface BookCardProps {
  livro: Livro;
  isFavorite: boolean;
  onToggleFavorite: (livroId: string) => void;
}

const BookCard: React.FC<BookCardProps> = ({ livro, isFavorite, onToggleFavorite }) => {
  const livroId = livro.id!;

  const isReaderAvailable = !!livro.googleDriveFileId;

  return (
    <div className="bg-zinc-800 border border-zinc-700 rounded-xl shadow-2xl hover:shadow-violet-500/30 transition-shadow duration-300 flex flex-col justify-between overflow-hidden">
      
      {/* Corpo do Card */}
      <div className="p-5 grow">
        <div className="flex justify-between items-start mb-3">
            <h2 
                className="text-xl font-bold text-white leading-snug max-w-[85%] line-clamp-2" 
                title={livro.titulo}
            >
                {livro.titulo}
            </h2>
            
            {/* Botão de Favorito */}
            <button
                className="text-2xl transition-transform transform hover:scale-110 active:scale-95 z-10 p-1 -mt-1 -mr-1"
                onClick={() => onToggleFavorite(livroId)}
                aria-label={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
            >
                {isFavorite 
                    ? <FaHeart className="text-red-500 shadow-sm drop-shadow-md" /> 
                    : <FaRegHeart className="text-gray-400 hover:text-red-400" />}
            </button>
        </div>
        
        {/* Metadados */}
        <p className="text-gray-400 text-sm mb-1">
            <span className="font-semibold text-zinc-300">Gênero:</span> {livro.genero || 'Não Informado'}
        </p>
        <p className="text-gray-400 text-xs mt-2 italic">
             ISBN: {livro.isbn}
        </p>
      </div>

      {/* Seção de Ações */}
      <div className="grid grid-cols-2 border-t border-zinc-700">
        
        {/* Botão Ler Agora */}
        {isReaderAvailable ? (
          <Link
            to={`/livros/${livroId}/ler`}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-violet-600/20 text-violet-300 
                       hover:bg-violet-700 hover:text-white transition-colors font-medium border-r border-zinc-700"
          >
            <FaBookReader size={18} />
            Ler Agora
          </Link>
        ) : (
          <span 
            className="flex items-center justify-center gap-2 px-4 py-3 bg-zinc-700/30 text-zinc-500 
                       cursor-not-allowed border-r border-zinc-700"
            title="Nenhum arquivo digital disponível para leitura"
          >
            <FaBookReader size={18} />
            Não Disponível
          </span>
        )}

        {/* Botão Detalhes */}
        <Link
          to={`/livros/${livroId}`}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-zinc-700/30 text-gray-300 
                     hover:bg-zinc-600 transition-colors font-medium"
        >
          <FaInfoCircle size={18} />
          Detalhes
        </Link>
      </div>
    </div>
  );
};

export default BookCard;

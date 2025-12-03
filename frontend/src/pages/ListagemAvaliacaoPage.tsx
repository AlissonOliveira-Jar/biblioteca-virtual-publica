import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';
import toast from 'react-hot-toast';

type LivroAvaliacao = {
  id: string;
  titulo: string;
  autor: string;
  avaliado: boolean;
  nota?: number;
  comentario?: string;
};

const ListagemAvaliacaoPage = () => {
  const { userId } = useAuth();
  const navigate = useNavigate();
  const [livros, setLivros] = useState<LivroAvaliacao[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    api.get(`/avaliacao/catalogo?usuarioId=${userId}`)
      .then(res => setLivros(res.data))
      .catch(() => toast.error('Erro ao carregar catálogo'))
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) {
    return <p className="text-center mt-10">Carregando...</p>;
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 min-h-screen bg-zinc-950">
      <h1 className="text-3xl font-bold mb-8 text-violet-700 text-center">
        Avaliação de Livros
      </h1>

      <div className="space-y-4">
        {livros.map(livro => (
          <div
            key={livro.id}
            className="flex justify-between items-center p-6 rounded-xl
                                  bg-zinc-900 border border-zinc-800
                                  shadow-sm hover:shadow-zinc-800/40 transition"
          >
            <div>
              <h2 className="text-xl font-semibold text-zinc-100">{livro.titulo}</h2>
              <p className="text-zinc-400">Autor: {livro.autor}</p>

              {livro.avaliado ? (
                <p className="mt-2 text-yellow-600 font-medium">
                  ⭐ Nota: {livro.nota}
                  {livro.comentario && (
                    <span className="text-zinc-500 italic ml-2">
                      — “{livro.comentario}”
                    </span>
                  )}
                </p>
              ) : (
                <p className="mt-2 text-zinc-400">
                  Ainda não avaliado
                </p>
              )}
            </div>

            <button
              onClick={() => navigate(`/livros/${livro.id}/avaliacao`)}
              className={`px-5 py-2 rounded-lg font-semibold transition
                ${livro.avaliado
                  ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                  : 'bg-violet-600 hover:bg-violet-700 text-white'
                }`}
            >
              {livro.avaliado ? 'Reavaliar' : 'Avaliar'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListagemAvaliacaoPage;

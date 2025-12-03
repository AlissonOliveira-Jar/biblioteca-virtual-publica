import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import StarRating from '../components/StarRating';

const LoadingMessage = ({ message }: { message: string }) => (
    <div className="max-w-lg mx-auto p-6 text-white text-center rounded-xl bg-zinc-800 mt-8">
        <p className="animate-pulse text-violet-400">{message}</p>
    </div>
);

const AvaliacaoPage = () => {
  const { userId, isLoading, isAuthenticated } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();

  const [nota, setNota] = useState(0);
  const [comentario, setComentario] = useState('');
  const [titulo, setTitulo] = useState('');
  const [isBookDataLoading, setIsBookDataLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

      useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            toast.error('Você precisa estar logado para avaliar um livro.');
            navigate('/login');
        }
      }, [isLoading, isAuthenticated, navigate]);

     useEffect(() => {
         if (isLoading) return;

         if (!isAuthenticated || !id || !userId) {
           setIsBookDataLoading(false);
           return;
         }

         setIsBookDataLoading(true);
         api.get(`/livros/${id}`)
           .then(res => setTitulo(res.data.titulo))
           .catch(() => toast.error('Erro ao carregar livro'))
           .finally(() => setIsBookDataLoading(false));
       }, [id, userId, isLoading, isAuthenticated]);

       const handleSubmit = async () => {
         if (nota === 0) {
                 toast.error('Por favor, selecione uma nota válida (1 a 5).');
                 return;
         }

         if (isSubmitting) return;

         if (!userId) {
             toast.error('Erro: ID do usuário ausente. Tente fazer login novamente.');
             return;
         }

         try {
           setIsSubmitting(true);

           await api.post('/avaliacao', {
             titulo,
             idUsuario: userId,
             nota,
             comentario,
           });

           toast.success('Avaliação registrada com sucesso!');
           navigate(`/livros/${id}`);
         } catch (err) {
           toast.error('Erro ao enviar avaliação. Verifique sua conexão ou status de login.');
           console.error(err);
         } finally {
           setIsSubmitting(false);
         }
       };

       const isFormReady = !isBookDataLoading && !!id && !!userId;

       if (isLoading) {
           return <LoadingMessage message="Verificando seu status de login..." />;
       }

       if (isBookDataLoading) {
           return <LoadingMessage message="Carregando dados do livro..." />;
       }

       if (!isFormReady) {
          if (!id) {
              return <LoadingMessage message="Erro: ID do livro ausente na URL. Por favor, volte para a lista de livros." />;
          }
          if (!userId) {
              return <LoadingMessage message="Erro: ID do usuário (ID de Login) ausente. Por favor, tente fazer login novamente." />;
          }

          return <LoadingMessage message="Erro inesperado. Tente recarregar a página." />;
       }

    return (
      <div className="max-w-lg mx-auto bg-zinc-800 p-6 rounded-xl text-white shadow-xl">
        <h1 className="text-2xl font-bold mb-2 text-violet-400">
          Avaliar Livro
        </h1>

        <p className="text-zinc-300 mb-6 font-medium">
          {titulo}
        </p>

        {/* ⭐ ESTRELAS */}
        <div className="mb-4">
          <p className="mb-2 font-semibold">Sua nota</p>
          <StarRating value={nota} onChange={setNota} />
        </div>

        {/* 📝 COMENTÁRIO */}
        <textarea
          value={comentario}
          onChange={e => setComentario(e.target.value)}
          placeholder="Escreva um comentário (opcional)"
          className="w-full p-3 rounded bg-zinc-700 text-white mt-4 border border-zinc-600 focus:border-violet-500 outline-none"
          maxLength={500}
          rows={4}
        />

        {/* ✅ BOTÃO (usando isSubmitting e isFormReady) */}
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || !isFormReady || nota === 0}
          className="mt-6 w-full bg-violet-600 hover:bg-violet-700 transition py-2 rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting
              ? 'Enviando...'
              : nota === 0
              ? 'Selecione uma Nota'
              : 'Enviar Avaliação'}
        </button>
      </div>
    );
  };
export default AvaliacaoPage;

import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { 
    FaUserTie, FaGlobe, FaBirthdayCake, 
    FaBookOpen, FaArrowLeft, FaSpinner
} from 'react-icons/fa';

import { autorService } from '../services/autorService';
import { livroService } from '../services/livroService';

import type { Autor } from '../types/autor';
import type { Livro } from '../types/livro';

const AuthorDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate(); 
  
  const [autor, setAutor] = useState<Autor | null>(null);
  const [livros, setLivros] = useState<Livro[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAutor = async () => {
      if (!id) {
        toast.error("ID do autor não encontrado.");
        navigate('/home');
        return;
      }
      
      setLoading(true);
      try {
        const autorPromise = autorService.getAutorById(id);
        const livrosPromise = livroService.findByAutor(id);

        const [autorData, livrosData] = await Promise.all([autorPromise, livrosPromise]);
        
        setAutor(autorData);
        setLivros(livrosData);

      } catch (error) {
        toast.error("Não foi possível carregar os detalhes do autor.");
        console.error(error);
        navigate('/home');
      } finally {
        setLoading(false);
      }
    };

    fetchAutor();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center h-64">
        <FaSpinner className="animate-spin text-primary text-4xl" />
        <p className="ml-4 text-gray-400">Carregando dados do autor...</p>
      </div>
    );
  }

  if (!autor) {
    return (
      <div className="text-center text-gray-400">
        <h1 className="text-2xl font-bold">Autor não encontrado</h1>
        <Link to="/home" className="text-primary hover:underline">
          Voltar para a Home
        </Link>
      </div>
    );
  }

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "?";
    return new Date(dateString + 'T00:00:00').toLocaleDateString('pt-BR');
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-primary hover:text-purple-400 transition-colors mb-4"
      >
        <FaArrowLeft />
        Voltar
      </button>
      
      <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6 md:p-8">
        {/* Cabeçalho */}
        <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
          <div className="flex-shrink-0 p-5 bg-zinc-900 rounded-full border border-primary">
            <FaUserTie size={48} className="text-primary" />
          </div>
          <div>
            <h1 className="text-4xl font-extrabold text-white">{autor.nome}</h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-gray-400 mt-2">
              {autor.nacionalidade && (
                <span className="flex items-center gap-2">
                  <FaGlobe /> {autor.nacionalidade}
                </span>
              )}
              {autor.dataNascimento && (
                <span className="flex items-center gap-2">
                  <FaBirthdayCake /> {formatDate(autor.dataNascimento)}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Biografia */}
        {autor.biografia && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-3">Biografia</h2>
            <p className="text-gray-300 leading-relaxed whitespace-pre-line">
              {autor.biografia}
            </p>
          </div>
        )}

        {/* Seção de Livros */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Livros deste Autor</h2>
          
          {livros.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {livros.map(livro => (
                <Link 
                  key={livro.id} 
                  to={`/livros/${livro.id}`}
                  className="p-4 bg-zinc-900/50 rounded-lg border border-zinc-700 hover:border-primary transition-colors group"
                >
                  <h3 className="text-lg font-bold text-gray-100 group-hover:text-primary">{livro.titulo}</h3>
                  <p className="text-gray-400 text-sm">ISBN: {livro.isbn}</p>
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-6 bg-zinc-900/50 rounded-lg text-center text-gray-500">
              <FaBookOpen size={32} className="mx-auto mb-2" />
              Nenhum livro encontrado para este autor.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthorDetailPage;

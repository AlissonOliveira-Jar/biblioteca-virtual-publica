import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { 
    FaBook, FaUserTie, FaBuilding, FaArrowLeft, 
    FaSpinner, FaBarcode, FaCalendarAlt, FaLayerGroup,
    FaBookOpen
} from 'react-icons/fa';

import { FaFileLines } from "react-icons/fa6";

import type { Livro } from '../types/livro';
import type { Autor } from '../types/autor';
import type { Editora } from '../types/editora';
import { livroService } from '../services/livroService';
import { autorService } from '../services/autorService';
import { editoraService } from '../services/editoraService';

const BookDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate(); 
  
  const [livro, setLivro] = useState<Livro | null>(null);
  const [autor, setAutor] = useState<Autor | null>(null);
  const [editora, setEditora] = useState<Editora | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLivroDetalhes = async () => {
      if (!id) {
        toast.error("ID do livro não encontrado.");
        navigate('/home');
        return;
      }
      
      setLoading(true);
      try {
        const livroData = await livroService.getLivroById(id);
        setLivro(livroData);

        if (livroData.autorId) {
            try {
                const autorData = await autorService.getAutorById(livroData.autorId);
                setAutor(autorData);
            } catch (error) {
                console.error("Erro ao carregar autor:", error);
            }
        }

        if (livroData.editoraId) {
            try {
                const editoraData = await editoraService.getEditoraById(livroData.editoraId);
                setEditora(editoraData);
            } catch (error) {
                console.error("Erro ao carregar editora:", error);
            }
        }

      } catch (error) {
        toast.error("Não foi possível carregar o livro.");
        console.error(error);
        navigate('/home');
      } finally {
        setLoading(false);
      }
    };

    fetchLivroDetalhes();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center h-64">
        <FaSpinner className="animate-spin text-primary text-4xl" />
        <p className="ml-4 text-gray-400">Carregando dados do livro...</p>
      </div>
    );
  }

  if (!livro) {
    return (
      <div className="text-center text-gray-400">
        <h1 className="text-2xl font-bold">Livro não encontrado</h1>
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
            <FaBook size={48} className="text-primary" />
          </div>
          <div>
            <h1 className="text-4xl font-extrabold text-white">{livro.titulo}</h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-gray-400 mt-2">
              
              {/* Exibe o Autor usando o estado 'autor' */}
              {autor ? (
                <Link 
                  to={`/autores/${autor.id}`} 
                  className="flex items-center gap-2 hover:text-primary transition-colors"
                >
                  <FaUserTie /> {autor.nome}
                </Link>
              ) : (
                <span className="flex items-center gap-2">
                  <FaUserTie /> Autor desconhecido
                </span>
              )}

              {/* Exibe a Editora usando o estado 'editora' */}
              {editora && (
                <Link 
                  to={`/editoras/${editora.id}`} 
                  className="flex items-center gap-2 hover:text-primary transition-colors"
                >
                  <FaBuilding /> {editora.nome}
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Resumo */}
        {livro.resumo && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-3">Resumo</h2>
            <p className="text-gray-300 leading-relaxed whitespace-pre-line">
              {livro.resumo}
            </p>
          </div>
        )}

        {/* Detalhes Adicionais */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Detalhes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-zinc-900/50 rounded-lg">
            
            <InfoItem icon={<FaBarcode />} label="ISBN" value={livro.isbn} />
            <InfoItem icon={<FaLayerGroup />} label="Gênero" value={livro.genero} />
            <InfoItem icon={<FaCalendarAlt />} label="Publicação" value={formatDate(livro.dataPublicacao)} />
            <InfoItem icon={<FaBookOpen />} label="Edição" value={livro.edicao ? `${livro.edicao}ª` : 'N/A'} />
            <InfoItem icon={<FaFileLines />} label="Páginas" value={livro.numeroPaginas} />
            
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoItem = ({ icon, label, value }: { icon: React.ReactNode, label: string, value?: string | number | null }) => {
  if (!value) return null;
  return (
    <div className="flex items-center gap-3">
      <div className="text-primary">{icon}</div>
      <div>
        <span className="text-sm text-gray-400">{label}</span>
        <p className="text-white font-medium">{value}</p>
      </div>
    </div>
  );
};

export default BookDetailPage;

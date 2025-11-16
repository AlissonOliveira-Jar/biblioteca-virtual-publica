import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { 
    FaBuilding, FaGlobe, FaCalendarAlt, FaLink, 
    FaBookOpen, FaArrowLeft, FaSpinner 
} from 'react-icons/fa';
import { editoraService } from '../services/editoraService';
import { livroService } from '../services/livroService';

import type { Editora } from '../types/editora';
import type { Livro } from '../types/livro';

const PublisherDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate(); 
  
  const [editora, setEditora] = useState<Editora | null>(null);
  const [livros, setLivros] = useState<Livro[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEditora = async () => {
      if (!id) {
        toast.error("ID da editora não encontrado.");
        navigate('/home');
        return;
      }
      
      setLoading(true);
      try {
        const editoraPromise = editoraService.getEditoraById(id);
        const livrosPromise = livroService.findByEditora(id);

        const [editoraData, livrosData] = await Promise.all([editoraPromise, livrosPromise]);
        
        setEditora(editoraData);
        setLivros(livrosData);

      } catch (error) {
        toast.error("Não foi possível carregar a editora.");
        console.error(error);
        navigate('/home');
      } finally {
        setLoading(false);
      }
    };

    fetchEditora();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center h-64">
        <FaSpinner className="animate-spin text-primary text-4xl" />
        <p className="ml-4 text-gray-400">Carregando dados da editora...</p>
      </div>
    );
  }

  if (!editora) {
    return (
      <div className="text-center text-gray-400">
        <h1 className="text-2xl font-bold">Editora não encontrada</h1>
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
            <FaBuilding size={48} className="text-primary" />
          </div>
          <div>
            <h1 className="text-4xl font-extrabold text-white">{editora.nome}</h1>
            
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-gray-400 mt-2">
              {editora.pais && (
                <span className="flex items-center gap-2">
                  <FaGlobe /> {editora.pais}
                </span>
              )}
              {editora.dataFundacao && (
                <span className="flex items-center gap-2">
                  <FaCalendarAlt /> Fundada em {formatDate(editora.dataFundacao)}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Detalhes Adicionais */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Detalhes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-zinc-900/50 rounded-lg">
            {editora.website && (
              <InfoItem 
                icon={<FaLink />} 
                label="Website" 
                value={
                  <a 
                    href={editora.website.startsWith('http') ? editora.website : `//${editora.website}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-white font-medium hover:text-primary transition-colors hover:underline"
                  >
                    {editora.website}
                  </a>
                } 
              />
            )}
          </div>
        </div>

        {/* Seção de Livros */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-white mb-4">Livros desta Editora</h2>
          
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
              Nenhum livro encontrado desta editora.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const InfoItem = ({ icon, label, value }: { icon: React.ReactNode, label: string, value?: React.ReactNode | string | number | null }) => {
  if (!value) return null;
  return (
    <div className="flex items-center gap-3">
      <div className="text-primary">{icon}</div>
      <div>
        <span className="text-sm text-gray-400">{label}</span>
        {typeof value === 'string' || typeof value === 'number' ? (
          <p className="text-white font-medium">{value}</p>
        ) : (
          value
        )}
      </div>
    </div>
  );
};

export default PublisherDetailPage;

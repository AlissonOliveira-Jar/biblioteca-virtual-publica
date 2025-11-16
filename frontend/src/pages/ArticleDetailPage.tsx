import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { 
    FaNewspaper, FaUserTie, FaArrowLeft, FaSpinner, 
    FaBarcode, FaCalendarAlt, FaBook, FaTags, 
    FaBookOpen
} from 'react-icons/fa';

import type { Artigo } from '../types/artigo';
import { artigoService } from '../services/artigoService';
import { FaFileLines } from 'react-icons/fa6';

const ArticleDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate(); 
  
  const [artigo, setArtigo] = useState<Artigo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtigo = async () => {
      if (!id) {
        toast.error("ID do artigo não encontrado.");
        navigate('/home');
        return;
      }
      
      setLoading(true);
      try {
        const data = await artigoService.getArtigoById(id);
        setArtigo(data);
      } catch (error) {
        toast.error("Não foi possível carregar o artigo.");
        console.error(error);
        navigate('/home');
      } finally {
        setLoading(false);
      }
    };

    fetchArtigo();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center h-64">
        <FaSpinner className="animate-spin text-primary text-4xl" />
        <p className="ml-4 text-gray-400">Carregando dados do artigo...</p>
      </div>
    );
  }

  if (!artigo) {
    return (
      <div className="text-center text-gray-400">
        <h1 className="text-2xl font-bold">Artigo não encontrado</h1>
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
            <FaNewspaper size={48} className="text-primary" />
          </div>
          <div>
            <h1 className="text-4xl font-extrabold text-white">{artigo.titulo}</h1>
            
            {/* Informações dos Autores (Lista) */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-gray-400 mt-2">
              <FaUserTie className="text-gray-500" />
              {artigo.autores && artigo.autores.length > 0 ? (
                artigo.autores.map((autor, index) => (
                  <span key={autor.id}>
                    <Link 
                      to={`/autores/${autor.id}`} 
                      className="hover:text-primary transition-colors"
                    >
                      {autor.nome}
                    </Link>
                    {/* Adiciona vírgula se não for o último */}
                    {index < artigo.autores!.length - 1 && ', '}
                  </span>
                ))
              ) : (
                <span>Autor desconhecido</span>
              )}
            </div>
          </div>
        </div>

        {/* Resumo */}
        {artigo.resumo && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-3">Resumo</h2>
            <p className="text-gray-300 leading-relaxed whitespace-pre-line">
              {artigo.resumo}
            </p>
          </div>
        )}

        {/* Detalhes Adicionais */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Detalhes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-zinc-900/50 rounded-lg">
            
            <InfoItem icon={<FaBarcode />} label="DOI" value={artigo.doi} />
            <InfoItem icon={<FaBook />} label="Revista" value={artigo.revista} />
            <InfoItem icon={<FaCalendarAlt />} label="Publicação" value={formatDate(artigo.dataPublicacao)} />
            <InfoItem icon={<FaTags />} label="Palavras-chave" value={artigo.palavrasChave} />
            <InfoItem icon={<FaBookOpen />} label="Volume" value={artigo.volume} />
            <InfoItem icon={<FaFileLines />} label="Páginas" value={
              artigo.paginaInicial && artigo.paginaFinal 
                ? `${artigo.paginaInicial} - ${artigo.paginaFinal}` 
                : artigo.paginaInicial
            } />
            
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

export default ArticleDetailPage;

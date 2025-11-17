import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
    FaSearch, FaBook, FaUser, FaNewspaper, 
    FaBuilding, FaUserTie, FaSadTear
} from 'react-icons/fa';
import { searchGlobal } from '../services/searchService';
import toast from 'react-hot-toast';

import type { SearchResult } from '../services/searchService';

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');

  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query || query.trim() === "") {
        setResults([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const data = await searchGlobal(query);
        setResults(data);
      } catch (error) {
        console.error("Erro na busca:", error);
        toast.error("Erro ao realizar a busca.");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  const getIconForType = (tipo: SearchResult['tipo']) => {
    switch (tipo) {
      case 'Livro': return <FaBook className="text-blue-500" />;
      case 'Autor': return <FaUserTie className="text-green-500" />;
      case 'Artigo': return <FaNewspaper className="text-yellow-500" />;
      case 'Editora': return <FaBuilding className="text-purple-500" />;
      case 'Usuário': return <FaUser className="text-gray-400" />;
      default: return <FaSearch className="text-primary" />;
    }
  };

  const getLinkForType = (tipo: SearchResult['tipo'], id: string) => {
    switch (tipo) {
      case 'Livro': return `/livros/${id}`;
      case 'Autor': return `/autores/${id}`;
      case 'Artigo': return `/artigos/${id}`;
      case 'Editora': return `/editoras/${id}`;
      case 'Usuário': return `/users/${id}`;
      default: return '#';
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <FaSearch className="text-primary" />
          Resultados para: <span className="text-primary">"{query}"</span>
        </h1>
      </header>

      {/* --- ESTADO DE LOADING --- */}
      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      )}

      {/* --- ESTADO VAZIO --- */}
      {!loading && results.length === 0 && (
        <div className="text-center py-16 bg-zinc-800/50 rounded-lg border border-zinc-700">
           <FaSadTear className="mx-auto text-6xl text-zinc-600 mb-4" />
          <h2 className="text-2xl font-bold text-zinc-400 mb-2">Nenhum resultado encontrado</h2>
          <p className="text-zinc-500">Tente usar outros termos ou verifique a ortografia.</p>
        </div>
      )}

      {!loading && results.length > 0 && (
        <div className="grid gap-4">
          {results.map((result) => (
            <Link 
              to={getLinkForType(result.tipo, result.id)}
              key={result.id}
              className="p-4 bg-zinc-800 rounded-lg border border-zinc-700 hover:border-primary 
                         transition-all flex items-center gap-4 group"
            >
              <div className="p-3 bg-zinc-900 rounded-full group-hover:bg-zinc-700 transition-colors">
                {getIconForType(result.tipo)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-gray-100 group-hover:text-primary transition-colors">
                      {result.tituloPrincipal}
                    </h3>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-700 text-zinc-300">
                        {result.tipo}
                    </span>
                </div>
                <p className="text-gray-400">{result.descricao}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResultsPage;

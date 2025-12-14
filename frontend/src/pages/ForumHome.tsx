import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaPlus, FaEye, FaComments, FaLock, FaFilter } from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth';
import type {ForumCategory, ForumTopicList} from "../types/forum.ts";
import forumService from "../services/forumService.ts";

const ForumHome = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [categories, setCategories] = useState<ForumCategory[]>([]);
    const [topics, setTopics] = useState<ForumTopicList[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(false);

    const isUserBanned = user?.isCommentBanned || false;

    useEffect(() => {
        loadCategories();
    }, []);

    useEffect(() => {
        loadTopics();
    }, [selectedCategory, page]);

    const loadCategories = async () => {
        try {
            const data = await forumService.getCategories();
            setCategories(data);
        } catch (error) {
            console.error('Erro ao carregar categorias:', error);
        }
    };

    const loadTopics = async () => {
        setLoading(true);
        try {
            const response = await forumService.getTopics(
                page,
                20,
                selectedCategory || undefined
            );
            setTopics(response.topics);
            setHasMore(response.hasNext);
        } catch (error) {
            console.error('Erro ao carregar tópicos:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCategoryFilter = (categoryId: string | null) => {
        setSelectedCategory(categoryId);
        setPage(0);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMins < 60) return `${diffMins}min atrás`;
        if (diffHours < 24) return `${diffHours}h atrás`;
        if (diffDays < 7) return `${diffDays}d atrás`;
        return date.toLocaleDateString('pt-BR');
    };

    return (
        <div className="w-full max-w-6xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-violet-600">
                        Fórum da Comunidade
                    </h1>
                    {!isUserBanned ? (
                        <button
                            onClick={() => navigate('/forum/new')}
                            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-lg hover:from-purple-700 hover:to-violet-700 transition-all"
                        >
                            <FaPlus /> Criar Tópico
                        </button>
                    ) : (
                        <div className="px-6 py-3 bg-red-900/20 border border-red-500 text-red-400 rounded-lg">
                            Você está impedido de criar tópicos
                        </div>
                    )}
                </div>
                <p className="text-gray-400">
                    Compartilhe ideias, faça perguntas e participe de discussões sobre livros e leitura.
                </p>
            </div>

            {/* Filtros de Categoria */}
            <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                    <FaFilter className="text-gray-400" />
                    <span className="text-gray-300 font-semibold">Filtrar por categoria:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => handleCategoryFilter(null)}
                        className={`px-4 py-2 rounded-lg transition-all ${
                            selectedCategory === null
                                ? 'bg-purple-600 text-white'
                                : 'bg-zinc-800 text-gray-300 hover:bg-zinc-700'
                        }`}
                    >
                        Todas
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => handleCategoryFilter(cat.id)}
                            className={`px-4 py-2 rounded-lg transition-all ${
                                selectedCategory === cat.id
                                    ? 'bg-purple-600 text-white'
                                    : 'bg-zinc-800 text-gray-300 hover:bg-zinc-700'
                            }`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Lista de Tópicos */}
            {loading ? (
                <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
                    <p className="text-gray-400 mt-4">Carregando tópicos...</p>
                </div>
            ) : topics.length === 0 ? (
                <div className="text-center py-12 bg-zinc-800/50 rounded-lg border border-zinc-700">
                    <p className="text-gray-400 text-lg">Nenhum tópico encontrado nesta categoria.</p>
                    {!isUserBanned && (
                        <button
                            onClick={() => navigate('/forum/new')}
                            className="mt-4 text-purple-400 hover:text-purple-300"
                        >
                            Seja o primeiro a criar um!
                        </button>
                    )}
                </div>
            ) : (
                <div className="space-y-4">
                    {topics.map((topic) => (
                        <Link
                            key={topic.id}
                            to={`/forum/topics/${topic.id}`}
                            className="block bg-zinc-800 rounded-lg border border-zinc-700 hover:border-purple-600 transition-all p-5 group"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                    <span className="px-3 py-1 bg-purple-900/30 text-purple-300 text-xs rounded-full">
                      {topic.category.name}
                    </span>
                                        {topic.isClosed && (
                                            <span className="flex items-center gap-1 text-red-400 text-xs">
                        <FaLock /> Fechado
                      </span>
                                        )}
                                    </div>
                                    <h3 className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors mb-2">
                                        {topic.title}
                                    </h3>
                                    <div className="flex items-center gap-4 text-sm text-gray-400">
                                        <span>por {topic.author.username}</span>
                                        <span>•</span>
                                        <span>{formatDate(topic.createdAt)}</span>
                                    </div>
                                </div>
                                <div className="flex gap-4 text-gray-400 text-sm">
                                    <div className="flex items-center gap-1">
                                        <FaEye /> {topic.viewCount}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <FaComments /> {topic.replyCount}
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            {/* Paginação */}
            {topics.length > 0 && (
                <div className="flex justify-center gap-4 mt-8">
                    <button
                        onClick={() => setPage(p => Math.max(0, p - 1))}
                        disabled={page === 0}
                        className="px-6 py-2 bg-zinc-800 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-700"
                    >
                        Anterior
                    </button>
                    <span className="px-4 py-2 text-gray-400">Página {page + 1}</span>
                    <button
                        onClick={() => setPage(p => p + 1)}
                        disabled={!hasMore}
                        className="px-6 py-2 bg-zinc-800 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-700"
                    >
                        Próxima
                    </button>
                </div>
            )}
        </div>
    );
};

export default ForumHome;
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaCalendarAlt, FaReply, FaLock, FaFlag, FaPaperPlane } from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth';
import forumService from '../services/forumService';
import UserAvatar from '../components/UserAvatar';
import ReportModal from '../components/ReportModal';
import toast from 'react-hot-toast';
import type { ForumTopicDetail, ForumPost } from '../types/forum';

const TopicDetail = () => {
    const { topicId } = useParams<{ topicId: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [topic, setTopic] = useState<ForumTopicDetail | null>(null);
    const [posts, setPosts] = useState<ForumPost[]>([]);
    const [replyContent, setReplyContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [reportTarget, setReportTarget] = useState<{ type: 'TOPIC' | 'POST', id: string } | null>(null);

    const isUserBanned = user?.isCommentBanned || false;

    useEffect(() => {
        if (topicId) loadTopicAndPosts();
    }, [topicId, page]);

    const loadTopicAndPosts = async () => {
        if (!topicId) return;
        try {
            const topicData = await forumService.getTopicById(topicId);
            setTopic(topicData);
            const postsData = await forumService.getTopicPosts(topicId, page, 20);
            setPosts(postsData.posts);
            setTotalPages(postsData.totalPages);
        } catch {
            toast.error('Erro ao carregar tópico');
            navigate('/forum');
        } finally {
            setLoading(false);
        }
    };

    const handleReply = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!replyContent.trim()) return;
        if (!topicId) return;

        setSending(true);
        try {
            await forumService.replyToTopic(topicId, { content: replyContent });
            toast.success('Resposta enviada! +20 XP');
            setReplyContent('');
            loadTopicAndPosts();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Erro ao enviar resposta.');
        } finally {
            setSending(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleOpenReport = (type: 'TOPIC' | 'POST', id: string) => {
        setReportTarget({ type, id });
        setIsReportModalOpen(true);
    };

    if (loading) {
        return (
            <div className="flex justify-center h-screen items-center">
                <div className="animate-spin h-10 w-10 border-4 border-purple-500 rounded-full border-t-transparent"></div>
            </div>
        );
    }

    if (!topic) return null;

    return (
        <div className="w-full max-w-5xl mx-auto px-4 py-8">
            <button
                onClick={() => navigate('/forum')}
                className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
            >
                <FaArrowLeft /> Voltar ao Fórum
            </button>

            <div className="bg-zinc-800 rounded-lg border border-zinc-700 overflow-hidden mb-8">
                <div className="bg-zinc-900/50 p-6 border-b border-zinc-700">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="px-3 py-1 bg-purple-900/30 text-purple-300 text-sm rounded-full border border-purple-500/30">
                            {topic.category.name}
                        </span>
                        {topic.isClosed && (
                            <span className="flex items-center gap-1 px-3 py-1 bg-red-900/30 text-red-400 text-sm rounded-full border border-red-500/30">
                                <FaLock size={12} /> Fechado
                            </span>
                        )}
                    </div>

                    <h1 className="text-3xl font-bold text-white mb-4">
                        {topic.title}
                    </h1>

                    <div className="flex items-center justify-between gap-4 flex-wrap">
                        <span className="text-gray-500 text-sm flex items-center gap-2">
                            <FaCalendarAlt /> {formatDate(topic.createdAt)}
                        </span>
                            <button
                                onClick={() => handleOpenReport('TOPIC', topic.id)}
                                className="flex items-center gap-2 text-gray-400 hover:text-red-500 transition-colors text-sm px-3 py-2 rounded-lg hover:bg-zinc-800/50 border border-zinc-700"
                                title="Denunciar Tópico"
                            >
                                <FaFlag size={14} />
                                <span>Denunciar</span>
                            </button>
                    </div>
                </div>

                <div className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                        <div className="flex-shrink-0 md:w-48 flex flex-col items-center text-center p-4 bg-zinc-900/30 rounded-lg h-fit">
                            <UserAvatar
                                username={topic.author.username}
                                avatarUrl={topic.author.avatarUrl}
                                size="lg"
                                level={topic.author.level}
                                showLevel={true}
                            />
                            <p className="mt-2 text-gray-400 text-xs">Autor do Tópico</p>
                        </div>
                        <div className="flex-grow">
                            <div className="prose prose-invert max-w-none text-gray-300 whitespace-pre-wrap leading-relaxed">
                                {topic.content}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-6 mb-12">
                <h2 className="text-xl font-bold text-gray-200 border-l-4 border-purple-500 pl-4">
                    Respostas ({posts.length})
                </h2>

                {posts.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 bg-zinc-900/30 rounded-lg border border-zinc-800 border-dashed">
                        Nenhuma resposta ainda. Seja o primeiro a responder!
                    </div>
                ) : (
                    posts.map((post) => (
                        <div key={post.id} className="bg-zinc-800 rounded-lg border border-zinc-700 p-6">
                            <div className="flex flex-col md:flex-row gap-6">
                                <div className="flex-shrink-0 md:w-32 flex flex-col items-center text-center">
                                    <UserAvatar
                                        username={post.author.username}
                                        avatarUrl={post.author.avatarUrl}
                                        size="md"
                                        level={post.author.level}
                                        showLevel={true}
                                    />
                                </div>
                                <div className="flex-grow">
                                    <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                                        <span className="text-purple-400 font-semibold text-sm">
                                            {post.author.username}
                                        </span>

                                        <div className="flex items-center gap-3">
                                            <span className="text-gray-500 text-xs">
                                                {formatDate(post.createdAt)}
                                            </span>
                                                <button
                                                    onClick={() => handleOpenReport('POST', post.id)}
                                                    className="flex items-center gap-1 text-gray-400 hover:text-red-500 transition-colors text-xs px-2 py-1 rounded hover:bg-zinc-700/50 border border-zinc-600"
                                                    title="Denunciar Resposta"
                                                >
                                                    <FaFlag size={12} />
                                                    <span>Denunciar</span>
                                                </button>
                                        </div>
                                    </div>
                                    <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                                        {post.content}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {totalPages > 1 && (
                <div className="flex justify-center gap-4 mb-8">
                    <button
                        onClick={() => setPage(p => Math.max(0, p - 1))}
                        disabled={page === 0}
                        className="px-4 py-2 bg-zinc-700 text-white rounded hover:bg-zinc-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Anterior
                    </button>
                    <span className="text-gray-400 py-2">
                        Página {page + 1} de {totalPages}
                    </span>
                    <button
                        onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                        disabled={page >= totalPages - 1}
                        className="px-4 py-2 bg-zinc-700 text-white rounded hover:bg-zinc-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Próxima
                    </button>
                </div>
            )}

            <div className="bg-zinc-800 rounded-lg border border-zinc-700 p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <FaReply className="text-purple-500" /> Responder
                </h3>
                {isUserBanned ? (
                    <div className="bg-red-900/20 border border-red-500 text-red-400 p-4 rounded-lg flex items-center gap-3">
                        <FaLock /> Você está bloqueado de participar do fórum.
                    </div>
                ) : topic.isClosed ? (
                    <div className="bg-yellow-900/20 border border-yellow-500 text-yellow-400 p-4 rounded-lg flex items-center gap-3">
                        <FaLock /> Este tópico está fechado para novas respostas.
                    </div>
                ) : (
                    <form onSubmit={handleReply}>
                        <textarea
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            placeholder="Escreva sua resposta..."
                            className="w-full bg-zinc-900 text-white rounded-lg p-4 border border-zinc-700 focus:border-purple-500 focus:outline-none min-h-[120px] mb-4 resize-none"
                            disabled={sending}
                            maxLength={5000}
                        />
                        <div className="flex justify-between items-center">
                            <span className="text-gray-500 text-sm">
                                {replyContent.length}/5000 caracteres
                            </span>
                            <button
                                type="submit"
                                disabled={sending || !replyContent.trim()}
                                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-lg hover:from-purple-700 hover:to-violet-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-semibold"
                            >
                                {sending ? (
                                    <>
                                        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                                        Enviando...
                                    </>
                                ) : (
                                    <>
                                        <FaPaperPlane /> Enviar Resposta
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                )}
            </div>

            <ReportModal
                isOpen={isReportModalOpen}
                onClose={() => {
                    setIsReportModalOpen(false);
                    setReportTarget(null);
                }}
                topicId={reportTarget?.type === 'TOPIC' ? reportTarget.id : undefined}
                postId={reportTarget?.type === 'POST' ? reportTarget.id : undefined}
            />
        </div>
    );
};

export default TopicDetail;
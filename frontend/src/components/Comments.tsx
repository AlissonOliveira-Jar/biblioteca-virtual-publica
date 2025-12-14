import { useEffect, useState, useMemo } from "react";
import { FaThumbsUp, FaThumbsDown, FaReply, FaClock, FaFilter, FaFlag, FaBan } from "react-icons/fa";
import toast from "react-hot-toast";
import { commentService } from "../services/commentService";
import type { CommentResponseDTO } from "../types/comment";
import ReportModal from "./ReportModal";
import { useAuth } from "../hooks/useAuth";

interface CommentsProps {
    bookId: string;
}

type FilterType = 'relevant' | 'unpopular' | 'recent' | 'oldest';

const Comments = ({ bookId }: CommentsProps) => {
    const { user } = useAuth();
    const [comments, setComments] = useState<CommentResponseDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [newComment, setNewComment] = useState("");

    const [filter, setFilter] = useState<FilterType>('relevant');

    const loadComments = async () => {
        try {
            const data = await commentService.getComments(bookId);
            setComments(data);
        } catch {
            toast.error("Não foi possível carregar os comentários.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setLoading(true);
        loadComments();
    }, [bookId]);

    const sortedComments = useMemo(() => {
        const sorted = [...comments];

        switch (filter) {
            case 'relevant':
                return sorted.sort((a, b) => {
                    if (b.helpfulCount === a.helpfulCount) {
                        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                    }
                    return b.helpfulCount - a.helpfulCount;
                });
            case 'unpopular':
                return sorted.sort((a, b) => a.helpfulCount - b.helpfulCount);
            case 'recent':
                return sorted.sort((a, b) =>
                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                );
            case 'oldest':
                return sorted.sort((a, b) =>
                    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
                );
            default:
                return sorted;
        }
    }, [comments, filter]);

    const submitComment = async () => {
        if (!newComment.trim()) return;

        try {
            await commentService.createComment(bookId, {
                content: newComment,
                parentCommentId: null
            });
            setNewComment("");
            await loadComments();
            setFilter('recent');
            toast.success("Comentário enviado!");
        } catch (error: any) {
            if (error.response?.status === 403) {
                toast.error(error.response.data.message || "Você está impedido de comentar.", {
                    icon: '🚫',
                    duration: 5000
                });
            } else {
                toast.error("Erro ao enviar comentário.");
            }
        }
    };

    const getBanMessage = () => {
        if (!user?.commentBanExpiresAt) return "Sua conta está banida permanentemente.";

        const date = new Date(user.commentBanExpiresAt).toLocaleDateString('pt-BR', {
            day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
        });
        return `Sua suspensão acaba em: ${date}.`;
    };

    return (
        <div className="mt-10 bg-zinc-800 border border-zinc-700 rounded-lg p-6">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h2 className="text-2xl font-bold text-white">
                    Comentários ({comments.length})
                </h2>

                {comments.length > 0 && (
                    <div className="flex items-center gap-2 bg-zinc-900 px-3 py-2 rounded-lg border border-zinc-700 focus-within:border-primary transition-colors relative">
                        <FaFilter className="text-gray-400 text-sm pointer-events-none z-10" />
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value as FilterType)}
                            className="bg-transparent text-sm text-white outline-none cursor-pointer appearance-none pl-1 pr-2 relative z-20 w-full"
                            style={{ colorScheme: 'dark' }}
                        >
                            <option value="relevant" className="bg-zinc-900 text-gray-200 py-2">Mais Relevantes</option>
                            <option value="recent" className="bg-zinc-900 text-gray-200 py-2">Mais Recentes</option>
                            <option value="unpopular" className="bg-zinc-900 text-gray-200 py-2">Menos Relevantes</option>
                            <option value="oldest" className="bg-zinc-900 text-gray-200 py-2">Mais Antigos</option>
                        </select>
                    </div>
                )}
            </div>

            <div className="mb-8">
                {user?.isCommentBanned ? (
                    <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 md:p-6 flex items-start md:items-center gap-4 text-red-400 animate-in fade-in duration-300">
                        <FaBan className="text-3xl flex-shrink-0 mt-1 md:mt-0" />
                        <div>
                            <h3 className="font-bold text-lg text-red-400">Comentários Bloqueados</h3>
                            <p className="text-sm text-red-300/80 mt-1">
                                Você não pode comentar ou responder no momento devido a infrações das diretrizes.
                                <br />
                                <span className="font-semibold text-red-300 block mt-1">
                                    {getBanMessage()}
                                </span>
                            </p>
                        </div>
                    </div>
                ) : (
                    <>
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            className="w-full p-3 bg-zinc-900 border border-zinc-700 rounded-lg text-white resize-none focus:ring-2 focus:ring-primary outline-none transition placeholder-gray-500"
                            placeholder="O que você achou deste livro?"
                            rows={3}
                        />
                        <div className="flex justify-end mt-2">
                            <button
                                onClick={submitComment}
                                disabled={!newComment.trim()}
                                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-violet-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Publicar
                            </button>
                        </div>
                    </>
                )}
            </div>

            {loading ? (
                <div className="flex justify-center py-4">
                    <p className="text-gray-400 animate-pulse">Carregando discussões...</p>
                </div>
            ) : sortedComments.length === 0 ? (
                <p className="text-gray-500 text-center py-8 bg-zinc-900/30 rounded-lg border border-dashed border-zinc-700">
                    Nenhum comentário ainda. <br /> Seja o primeiro a opinar!
                </p>
            ) : (
                <div className="space-y-6">
                    {sortedComments.map((c) => (
                        <CommentItem
                            key={c.id}
                            comment={c}
                            refresh={loadComments}
                            bookId={bookId}
                            level={0}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

const CommentItem = ({
                         comment,
                         refresh,
                         bookId,
                         level = 0
                     }: {
    comment: CommentResponseDTO;
    refresh: () => void;
    bookId: string;
    level: number;
}) => {
    const { user } = useAuth();
    const [replyText, setReplyText] = useState("");
    const [showReply, setShowReply] = useState(false);
    const [isVoting, setIsVoting] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);

    const vote = async (helpful: boolean) => {
        if (isVoting) return;
        setIsVoting(true);
        try {
            await commentService.voteComment(bookId, comment.id, helpful);
            refresh();
        } catch {
            toast.error("Erro ao votar.");
        } finally {
            setIsVoting(false);
        }
    };

    const submitReply = async () => {
        if (!replyText.trim()) return;
        try {
            await commentService.createComment(bookId, {
                content: replyText,
                parentCommentId: comment.id
            });
            setReplyText("");
            setShowReply(false);
            refresh();
            toast.success("Resposta enviada!");
        } catch (error: any) {
            if (error.response?.status === 403) {
                toast.error(error.response.data.message || "Você está impedido de responder.", { icon: '🚫' });
            } else {
                toast.error("Erro ao responder.");
            }
        }
    };

    const formattedDate = new Date(comment.createdAt).toLocaleDateString('pt-BR', {
        day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    return (
        <div className={`bg-zinc-900/50 border border-zinc-700/50 rounded-lg p-4 ${level > 0 ? 'mt-3' : ''}`}>
            <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm md:text-base">{comment.userName}</span>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                        <FaClock size={10} /> {formattedDate}
                    </span>
                </div>
            </div>

            <p className="text-gray-300 mb-3 text-sm md:text-base whitespace-pre-wrap">
                {comment.content}
            </p>

            <div className="flex items-center gap-4 text-gray-400 text-sm">
                <button
                    className={`flex items-center gap-1.5 transition ${isVoting ? 'opacity-50' : 'hover:text-green-400'}`}
                    onClick={() => vote(true)} disabled={isVoting}
                >
                    <FaThumbsUp /> {comment.helpfulCount}
                </button>
                <button
                    className={`flex items-center gap-1.5 transition ${isVoting ? 'opacity-50' : 'hover:text-red-400'}`}
                    onClick={() => vote(false)} disabled={isVoting}
                >
                    <FaThumbsDown /> {comment.notHelpfulCount}
                </button>

                {/* BLOQUEIO DO BOTÃO RESPONDER */}
                <button
                    className={`flex items-center gap-1.5 transition ${
                        user?.isCommentBanned
                            ? 'opacity-50 cursor-not-allowed text-zinc-600'
                            : 'hover:text-primary'
                    }`}
                    onClick={() => !user?.isCommentBanned && setShowReply(!showReply)}
                    title={user?.isCommentBanned ? "Conta suspensa: você não pode responder." : "Responder"}
                >
                    <FaReply /> Responder
                </button>

                <button
                    className="flex items-center gap-1.5 hover:text-red-500 transition ml-auto opacity-60 hover:opacity-100"
                    onClick={() => setShowReportModal(true)}
                    title="Denunciar comentário"
                >
                    <FaFlag />
                    <span className="hidden md:inline">Denunciar</span>
                </button>
            </div>

            {showReply && (
                <div className="mt-3 animate-in fade-in slide-in-from-top-2 duration-200">
                    <textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        className="w-full p-2 bg-zinc-800 border border-zinc-700 text-white rounded-lg resize-none text-sm focus:border-primary outline-none"
                        rows={2} placeholder={`Respondendo a ${comment.userName}...`} autoFocus
                    />
                    <div className="flex gap-2 mt-2">
                        <button onClick={submitReply} className="px-3 py-1 bg-primary text-white text-sm rounded hover:bg-violet-700">Enviar</button>
                        <button onClick={() => setShowReply(false)} className="px-3 py-1 bg-transparent border border-zinc-600 text-zinc-400 text-sm rounded hover:text-white">Cancelar</button>
                    </div>
                </div>
            )}

            <ReportModal
                isOpen={showReportModal}
                onClose={() => setShowReportModal(false)}
                commentId={comment.id}
            />

            {comment.replies.length > 0 && (
                <div className={`mt-2 ${level < 3 ? 'ml-4 md:ml-8' : 'ml-2'} border-l-2 border-zinc-700 pl-3`}>
                    {comment.replies.map((rep) => (
                        <CommentItem
                            key={rep.id}
                            comment={rep}
                            refresh={refresh}
                            bookId={bookId}
                            level={level + 1}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Comments;
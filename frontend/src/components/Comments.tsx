import { useEffect, useState } from "react";
import { FaThumbsUp, FaThumbsDown, FaReply, FaClock } from "react-icons/fa";
import toast from "react-hot-toast";
import { commentService } from "../services/commentService";
import type { CommentResponseDTO } from "../types/comment";

interface CommentsProps {
    bookId: string;
}

const Comments = ({ bookId }: CommentsProps) => {
    const [comments, setComments] = useState<CommentResponseDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [newComment, setNewComment] = useState("");

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

    const submitComment = async () => {
        if (!newComment.trim()) return;

        try {
            await commentService.createComment(bookId, {
                content: newComment,
                parentCommentId: null
            });
            setNewComment("");
            await loadComments(); // Recarrega a lista
            toast.success("Comentário enviado!");
        } catch {
            toast.error("Erro ao enviar comentário.");
        }
    };

    return (
        <div className="mt-10 bg-zinc-800 border border-zinc-700 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Comentários ({comments.length})</h2>

            <div className="mb-6">
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="w-full p-3 bg-zinc-900 border border-zinc-700 rounded-lg text-white resize-none focus:ring-2 focus:ring-primary outline-none transition"
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
            </div>

            {loading ? (
                <div className="flex justify-center py-4">
                    <p className="text-gray-400 animate-pulse">Carregando discussões...</p>
                </div>
            ) : comments.length === 0 ? (
                <p className="text-gray-500 text-center py-4">Nenhum comentário ainda. Seja o primeiro a opinar!</p>
            ) : (
                <div className="space-y-6">
                    {comments.map((c) => (
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
    const [replyText, setReplyText] = useState("");
    const [showReply, setShowReply] = useState(false);
    const [isVoting, setIsVoting] = useState(false);

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
        } catch {
            toast.error("Erro ao responder.");
        }
    };

    const formattedDate = new Date(comment.createdAt).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    return (
        <div className={`bg-zinc-900/50 border border-zinc-700/50 rounded-lg p-4 ${level > 0 ? 'mt-3' : ''}`}>
            {/* Header do Comentário */}
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
                    onClick={() => vote(true)}
                    disabled={isVoting}
                >
                    <FaThumbsUp /> {comment.helpfulCount}
                </button>

                <button
                    className={`flex items-center gap-1.5 transition ${isVoting ? 'opacity-50' : 'hover:text-red-400'}`}
                    onClick={() => vote(false)}
                    disabled={isVoting}
                >
                    <FaThumbsDown /> {comment.notHelpfulCount}
                </button>

                <button
                    className="flex items-center gap-1.5 hover:text-primary transition"
                    onClick={() => setShowReply(!showReply)}
                >
                    <FaReply /> Responder
                </button>
            </div>

            {showReply && (
                <div className="mt-3 animate-fade-in-down">
                    <textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        className="w-full p-2 bg-zinc-800 border border-zinc-700 text-white rounded-lg resize-none text-sm focus:border-primary outline-none"
                        rows={2}
                        placeholder={`Respondendo a ${comment.userName}...`}
                        autoFocus
                    />
                    <div className="flex gap-2 mt-2">
                        <button
                            onClick={submitReply}
                            className="px-3 py-1 bg-primary text-white text-sm rounded hover:bg-violet-700"
                        >
                            Enviar
                        </button>
                        <button
                            onClick={() => setShowReply(false)}
                            className="px-3 py-1 bg-transparent border border-zinc-600 text-zinc-400 text-sm rounded hover:text-white"
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            )}

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
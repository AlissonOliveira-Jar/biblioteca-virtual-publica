import { useEffect, useState } from "react";
import { FaThumbsUp, FaThumbsDown, FaReply } from "react-icons/fa";
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
            setLoading(true);
            const data = await commentService.getComments(bookId);
            setComments(data);
        } catch {
            toast.error("Não foi possível carregar os comentários.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
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
            loadComments();
            toast.success("Comentário enviado!");
        } catch {
            toast.error("Erro ao enviar comentário.");
        }
    };

    return (
        <div className="mt-10 bg-zinc-800 border border-zinc-700 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Comentários</h2>

            {/* Novo comentário */}
            <div className="mb-6">
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="w-full p-3 bg-zinc-900 border border-zinc-700 rounded-lg text-white resize-none"
                    placeholder="Escreva um comentário..."
                    rows={3}
                />
                <button
                    onClick={submitComment}
                    className="mt-3 px-4 py-2 bg-primary text-white rounded-lg hover:bg-violet-700 transition-colors font-medium"
                >
                    Publicar
                </button>
            </div>

            {/* Lista */}
            {loading ? (
                <p className="text-gray-400">Carregando comentários...</p>
            ) : comments.length === 0 ? (
                <p className="text-gray-500">Nenhum comentário ainda. Seja o primeiro!</p>
            ) : (
                <div className="space-y-6">
                    {comments.map((c) => (
                        <CommentItem
                            key={c.id}
                            comment={c}
                            refresh={loadComments}
                            bookId={bookId}
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
                         bookId
                     }: {
    comment: CommentResponseDTO;
    refresh: () => void;
    bookId: string;
}) => {
    const [replyText, setReplyText] = useState("");
    const [showReply, setShowReply] = useState(false);

    const vote = async (value: boolean) => {
        try {
            await commentService.voteComment(bookId, comment.id, value);
            refresh();
        } catch {
            toast.error("Erro ao votar.");
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
        } catch {
            toast.error("Erro ao responder comentário.");
        }
    };

    return (
        <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-4">
            <p className="text-white mb-1">{comment.content}</p>
            <p className="text-sm text-gray-500 mb-3">Por {comment.userName}</p>

            <div className="flex items-center gap-4 text-gray-400 mb-3">
                <button
                    className="flex items-center gap-2 hover:text-white"
                    onClick={() => vote(true)}
                >
                    <FaThumbsUp /> {comment.helpfulCount}
                </button>

                <button
                    className="flex items-center gap-2 hover:text-white"
                    onClick={() => vote(false)}
                >
                    <FaThumbsDown /> {comment.notHelpfulCount}
                </button>

                <button
                    className="flex items-center gap-2 hover:text-white"
                    onClick={() => setShowReply(!showReply)}
                >
                    <FaReply /> Responder
                </button>
            </div>

            {showReply && (
                <div className="ml-4 mb-3">
                    <textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        className="w-full p-2 bg-zinc-800 border border-zinc-700 text-white rounded-lg resize-none"
                        rows={2}
                    />
                    <button
                        onClick={submitReply}
                        className="mt-2 px-3 py-1 bg-primary text-white rounded-lg hover:bg-violet-700"
                    >
                        Enviar resposta
                    </button>
                </div>
            )}

            {/* Respostas */}
            {comment.replies.length > 0 && (
                <div className="ml-6 mt-4 space-y-4 border-l pl-4 border-zinc-700">
                    {comment.replies.map((rep) => (
                        <CommentItem
                            key={rep.id}
                            comment={rep}
                            refresh={refresh}
                            bookId={bookId}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Comments;

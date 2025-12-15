import { useState } from 'react';
import { FaExclamationTriangle, FaTimes } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { reportService } from '../services/reportService';
import type { ReportReason } from "../types/report.ts";

interface ReportModalProps {
    isOpen: boolean;
    onClose: () => void;
    commentId?: string;
    userId?: string;
    topicId?: string;
    postId?: string;
}

const ReportModal = ({ isOpen, onClose, commentId, userId, topicId, postId }: ReportModalProps) => {
    const [reason, setReason] = useState<ReportReason>('SPAM');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async () => {
        setLoading(true);
        try {
            await reportService.createReport({
                reason,
                reportedCommentId: commentId,
                reportedUserId: userId,
                reportedTopicId: topicId,
                reportedPostId: postId
            });
            toast.success("Denúncia enviada com sucesso!");
            setReason('SPAM');
            onClose();
        } catch (error) {
            toast.error("Erro ao enviar denúncia. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    const getTitle = () => {
        if (topicId) return 'Denunciar Tópico';
        if (postId) return 'Denunciar Resposta';
        if (commentId) return 'Denunciar Comentário';
        if (userId) return 'Denunciar Usuário';
        return 'Denunciar Conteúdo';
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-zinc-800 border border-zinc-700 p-6 rounded-lg w-full max-w-md animate-in fade-in zoom-in duration-200 shadow-2xl">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <FaExclamationTriangle className="text-red-500" />
                        {getTitle()}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <FaTimes />
                    </button>
                </div>

                <p className="text-gray-300 mb-4 text-sm">
                    Selecione o motivo da denúncia. Nossa equipe de moderação irá analisar o caso.
                </p>

                <select
                    value={reason}
                    onChange={(e) => setReason(e.target.value as ReportReason)}
                    className="w-full p-3 mb-6 bg-zinc-900 border border-zinc-700 rounded text-white focus:border-red-500 focus:outline-none transition-colors"
                >
                    <option value="SPAM">Spam ou Propaganda</option>
                    <option value="OFFENSIVE_LANGUAGE">Linguagem Ofensiva</option>
                    <option value="HATE_SPEECH">Discurso de Ódio</option>
                    <option value="FAKE_PROFILE">Perfil Falso</option>
                    <option value="MISINFORMATION">Desinformação</option>
                    <option value="SPOILER">Spoiler sem aviso</option>
                    <option value="OTHER">Outro</option>
                </select>

                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-300 hover:text-white transition-colors border border-transparent hover:border-zinc-600 rounded"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-bold disabled:opacity-50 transition-colors flex items-center gap-2"
                    >
                        {loading && (
                            <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                        )}
                        {loading ? 'Enviando...' : 'Denunciar'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReportModal;
import { useState } from 'react';
import { FaExclamationTriangle, FaTimes } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { reportService } from '../services/reportService';
import { ReportReason } from '../types/report';

interface ReportModalProps {
    isOpen: boolean;
    onClose: () => void;
    commentId?: string;
    userId?: string;
}

const ReportModal = ({ isOpen, onClose, commentId, userId }: ReportModalProps) => {
    const [reason, setReason] = useState<ReportReason>(ReportReason.SPAM);
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async () => {
        setLoading(true);
        try {
            await reportService.createReport({
                reportedCommentId: commentId,
                reportedUserId: userId,
                reason
            });
            toast.success("Denúncia enviada. Obrigado!");
            onClose();
        } catch {
            toast.error("Erro ao enviar denúncia.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-zinc-800 border border-zinc-700 p-6 rounded-lg w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <FaExclamationTriangle className="text-red-500" />
                        Denunciar {commentId ? 'Comentário' : 'Usuário'}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <FaTimes />
                    </button>
                </div>

                <p className="text-gray-300 mb-4 text-sm">
                    Selecione o motivo da denúncia. Nossa equipe irá analisar.
                </p>

                <select
                    value={reason}
                    onChange={(e) => setReason(e.target.value as ReportReason)}
                    className="w-full p-2 mb-6 bg-zinc-900 border border-zinc-600 rounded text-white"
                >
                    <option value="SPAM">Spam ou Propaganda</option>
                    <option value="OFFENSIVE_LANGUAGE">Linguagem Ofensiva</option>
                    <option value="HATE_SPEECH">Discurso de ódio</option>
                    <option value="FAKE_PROFILE">Perfil Falso</option>
                    <option value="OTHER">Outro</option>
                </select>

                <div className="flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-300 hover:text-white"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-bold"
                    >
                        {loading ? 'Enviando...' : 'Denunciar'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReportModal;
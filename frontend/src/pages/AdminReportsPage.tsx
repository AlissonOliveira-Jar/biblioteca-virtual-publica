import { useEffect, useState } from 'react';
import { FaTrash, FaBan, FaCheck, FaUserSecret, FaSpinner, FaExclamationTriangle } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { reportService } from '../services/reportService';
import type { ReportDTO } from "../types/report.ts";

const AdminReportsPage = () => {
    const [reports, setReports] = useState<ReportDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);

    const loadReports = async () => {
        try {
            const data = await reportService.getPendingReports();
            setReports(data);
        } catch (error) {
            console.error(error);
            toast.error("Erro ao carregar denúncias.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadReports();
    }, []);

    const handleAction = async (reportId: string, action: string) => {
        if (!window.confirm("Tem certeza que deseja tomar essa ação?")) return;

        setProcessingId(reportId);
        try {
            await reportService.resolveReport(reportId, action);
            toast.success("Ação realizada com sucesso!");
            setReports(prev => prev.filter(r => r.id !== reportId));
        } catch (error) {
            toast.error("Erro ao processar ação.");
        } finally {
            setProcessingId(null);
        }
    };

    const translateReason = (reason: string) => {
        const map: Record<string, string> = {
            'SPAM': 'Spam / Propaganda',
            'OFFENSIVE_LANGUAGE': 'Linguagem Ofensiva',
            'HATE_SPEECH': 'Discurso de Ódio',
            'FAKE_PROFILE': 'Perfil Falso',
            'OTHER': 'Outro'
        };
        return map[reason] || reason;
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-zinc-900">
                <FaSpinner className="animate-spin text-primary text-4xl" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-900 p-6 md:p-10">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
                    <FaUserSecret className="text-red-500" />
                    Painel de Moderação
                </h1>

                {reports.length === 0 ? (
                    <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-10 text-center">
                        <FaCheck className="text-green-500 text-5xl mx-auto mb-4" />
                        <h2 className="text-xl text-white font-bold">Tudo limpo!</h2>
                        <p className="text-gray-400">Não há denúncias pendentes no momento.</p>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {reports.map((report) => (
                            <div key={report.id} className="bg-zinc-800 border border-zinc-700 rounded-lg p-6 shadow-lg">

                                {/* CABEÇALHO */}
                                <div className="flex justify-between items-start mb-4 border-b border-zinc-700 pb-4">
                                    <div>
                                        <span className="bg-red-500/10 text-red-400 px-3 py-1 rounded-full text-xs font-bold uppercase border border-red-500/20">
                                            {translateReason(report.reason)}
                                        </span>
                                        <p className="text-gray-400 text-sm mt-2">
                                            Denunciado por <span className="text-white font-medium">{report.reporter.name}</span> em {new Date(report.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <FaExclamationTriangle className="text-yellow-500 text-xl" />
                                </div>

                                {/* CONTEÚDO */}
                                <div className="bg-zinc-900/50 p-4 rounded mb-6 border border-zinc-700/50">
                                    {report.reportedComment ? (
                                        <>
                                            <p className="text-xs text-purple-400 font-bold mb-1">COMENTÁRIO DE: {report.reportedComment.user.name}</p>
                                            <p className="text-white italic">"{report.reportedComment.content}"</p>
                                        </>
                                    ) : report.reportedUser ? (
                                        <>
                                            <p className="text-xs text-purple-400 font-bold mb-1">PERFIL DE USUÁRIO</p>
                                            <p className="text-white font-bold text-lg">{report.reportedUser.name}</p>
                                            <p className="text-gray-400">{report.reportedUser.email}</p>
                                        </>
                                    ) : (
                                        <p className="text-red-400">Conteúdo não encontrado (pode ter sido apagado)</p>
                                    )}
                                </div>

                                {/* BOTÕES DE AÇÃO */}
                                <div className="flex flex-wrap gap-3 justify-end">

                                    {/* 1. Botão Ignorar (Para todos) */}
                                    <button
                                        onClick={() => handleAction(report.id, 'REJECT')}
                                        disabled={!!processingId}
                                        className="px-4 py-2 border border-zinc-600 text-gray-300 rounded hover:bg-zinc-700 transition flex items-center gap-2"
                                    >
                                        <FaCheck /> Ignorar Denúncia
                                    </button>

                                    {/* 2. Botões se for COMENTÁRIO */}
                                    {report.reportedComment && (
                                        <>
                                            <button
                                                onClick={() => handleAction(report.id, 'DELETE_COMMENT')}
                                                disabled={!!processingId}
                                                className="px-4 py-2 bg-orange-600/20 text-orange-400 border border-orange-600/50 rounded hover:bg-orange-600/40 transition flex items-center gap-2"
                                            >
                                                <FaTrash /> Apagar Comentário
                                            </button>

                                            <button
                                                onClick={() => handleAction(report.id, 'BAN_USER_COMMENT')}
                                                disabled={!!processingId}
                                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition flex items-center gap-2 font-bold"
                                            >
                                                <FaBan /> Bloquear Comentários
                                            </button>

                                            <button
                                                onClick={() => handleAction(report.id, 'DELETE_USER')}
                                                disabled={!!processingId}
                                                className="px-4 py-2 bg-red-800 text-white border border-red-500 rounded hover:bg-red-900 transition flex items-center gap-2 font-bold"
                                                title="Apaga a conta do autor do comentário permanentemente"
                                            >
                                                <FaUserSecret /> Apagar Conta
                                            </button>
                                        </>
                                    )}

                                    {/* 3. Botões se for PERFIL DE USUÁRIO (Fora do bloco de comentário) */}
                                    {report.reportedUser && (
                                        <button
                                            onClick={() => handleAction(report.id, 'DELETE_USER')}
                                            disabled={!!processingId}
                                            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition flex items-center gap-2 font-bold"
                                        >
                                            <FaBan /> Apagar Usuário
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminReportsPage;
import { useEffect, useState } from 'react';
import {
    FaTrash, FaBan, FaCheck, FaUserSecret, FaSpinner,
    FaExclamationTriangle, FaComments, FaFileAlt, FaClock,
    FaChevronDown, FaUnlock, FaTimes
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import { reportService } from '../services/reportService';
import type { ReportDTO } from "../types/report.ts";

const AdminReportsPage = () => {
    const [reports, setReports] = useState<ReportDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);

    const [openBanMenuId, setOpenBanMenuId] = useState<string | null>(null);

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

    const handleAction = async (reportId: string, action: string, duration?: string) => {
        let confirmMsg = "Tem certeza que deseja tomar essa ação?";
        if (duration) confirmMsg = `Confirmar banimento de ${duration}?`;
        if (action === 'UNBAN_USER') confirmMsg = "Deseja retirar o banimento deste usuário?";

        if (!window.confirm(confirmMsg)) return;

        setProcessingId(reportId);
        setOpenBanMenuId(null);

        try {
            await reportService.resolveReport(reportId, action, duration);
            toast.success("Ação realizada com sucesso!");
            setReports(prev => prev.filter(r => r.id !== reportId));
        } catch (error) {
            console.error(error);
            toast.error("Erro ao processar ação.");
        } finally {
            setProcessingId(null);
        }
    };

    const toggleBanMenu = (reportId: string) => {
        if (openBanMenuId === reportId) {
            setOpenBanMenuId(null);
        } else {
            setOpenBanMenuId(reportId);
        }
    };

    const translateReason = (reason: string) => {
        const map: Record<string, string> = {
            'SPAM': 'Spam / Propaganda',
            'OFFENSIVE_LANGUAGE': 'Linguagem Ofensiva',
            'HATE_SPEECH': 'Discurso de Ódio',
            'FAKE_PROFILE': 'Perfil Falso',
            'MISINFORMATION': 'Desinformação',
            'SPOILER': 'Spoiler',
            'OTHER': 'Outro'
        };
        return map[reason] || reason;
    };

    const renderBanStatus = (user: any) => {
        if (!user || !user.isCommentBanned) return null;

        const isPermanent = !user.commentBanExpiresAt;
        const expiryDate = user.commentBanExpiresAt
            ? new Date(user.commentBanExpiresAt).toLocaleDateString('pt-BR') + ' às ' + new Date(user.commentBanExpiresAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
            : '';

        return (
            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide bg-red-900/50 text-red-200 border border-red-700/50" title={isPermanent ? "Banimento Permanente" : `Expira em: ${expiryDate}`}>
                <FaBan className="mr-1" />
                {isPermanent ? "Banido (Perma)" : `Banido até ${expiryDate}`}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-zinc-900">
                <FaSpinner className="animate-spin text-primary text-4xl" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-900 p-6 md:p-10" onClick={() => setOpenBanMenuId(null)}>
            <div className="max-w-5xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
                    <FaUserSecret className="text-red-500" />
                    Painel de Moderação
                </h1>

                {reports.length === 0 ? (
                    <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-10 text-center animate-in fade-in duration-500">
                        <FaCheck className="text-green-500 text-5xl mx-auto mb-4" />
                        <h2 className="text-xl text-white font-bold">Tudo limpo!</h2>
                        <p className="text-gray-400">Não há denúncias pendentes no momento.</p>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {reports.map((report) => (
                            <div
                                key={report.id}
                                className="bg-zinc-800 border border-zinc-700 rounded-lg p-6 shadow-lg relative animate-in slide-in-from-bottom-2 duration-300"
                                onClick={(e) => e.stopPropagation()}
                            >

                                <div className="flex justify-between items-start mb-4 border-b border-zinc-700 pb-4">
                                    <div>
                                        <span className="bg-red-500/10 text-red-400 px-3 py-1 rounded-full text-xs font-bold uppercase border border-red-500/20">
                                            {translateReason(report.reason)}
                                        </span>
                                        <p className="text-gray-400 text-sm mt-2">
                                            Denunciado por <span className="text-white font-medium">{report.reporter?.name || 'Anônimo'}</span> em {new Date(report.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <FaExclamationTriangle className="text-yellow-500 text-xl" />
                                </div>

                                <div className="bg-zinc-900/50 p-4 rounded mb-6 border border-zinc-700/50">

                                    {report.reportedComment && (
                                        <>
                                            <div className="flex flex-wrap items-center gap-2 mb-2">
                                                <p className="text-xs text-purple-400 font-bold flex items-center gap-2">
                                                    <FaComments /> REVIEW DE LIVRO - {report.reportedComment.user.name}
                                                </p>
                                                {renderBanStatus(report.reportedComment.user)}
                                            </div>
                                            <p className="text-white italic">"{report.reportedComment.content}"</p>
                                        </>
                                    )}

                                    {report.reportedTopic && (
                                        <>
                                            <div className="flex flex-wrap items-center gap-2 mb-2">
                                                <p className="text-xs text-blue-400 font-bold flex items-center gap-2">
                                                    <FaFileAlt /> TÓPICO DE FÓRUM - {report.reportedTopic.author.name}
                                                </p>
                                                {renderBanStatus(report.reportedTopic.author)}
                                            </div>
                                            <h3 className="text-white font-bold text-lg">{report.reportedTopic.title}</h3>
                                            <p className="text-gray-400 text-sm">ID: {report.reportedTopic.id}</p>
                                        </>
                                    )}

                                    {report.reportedPost && (
                                        <>
                                            <div className="flex flex-wrap items-center gap-2 mb-2">
                                                <p className="text-xs text-blue-400 font-bold flex items-center gap-2">
                                                    <FaComments /> RESPOSTA NO FÓRUM - {report.reportedPost.author.name}
                                                </p>
                                                {renderBanStatus(report.reportedPost.author)}
                                            </div>
                                            <p className="text-white italic">"{report.reportedPost.content}"</p>
                                        </>
                                    )}

                                    {report.reportedUser && (
                                        <>
                                            <div className="flex flex-wrap items-center gap-2 mb-2">
                                                <p className="text-xs text-purple-400 font-bold">PERFIL DE USUÁRIO</p>
                                                {renderBanStatus(report.reportedUser)}
                                            </div>
                                            <p className="text-white font-bold text-lg">{report.reportedUser.name}</p>
                                            <p className="text-gray-400">{report.reportedUser.email}</p>
                                        </>
                                    )}

                                    {!report.reportedComment && !report.reportedTopic && !report.reportedPost && !report.reportedUser && (
                                        <p className="text-red-400 font-bold flex items-center gap-2">
                                            <FaTimes /> Conteúdo não encontrado (pode ter sido apagado)
                                        </p>
                                    )}
                                </div>

                                <div className="flex flex-wrap gap-3 justify-end items-center">

                                    <button
                                        onClick={() => handleAction(report.id, 'REJECT')}
                                        disabled={!!processingId}
                                        className="px-4 py-2 border border-zinc-600 text-gray-300 rounded hover:bg-zinc-700 transition flex items-center gap-2 text-sm font-medium"
                                    >
                                        <FaCheck /> Ignorar
                                    </button>

                                    {/* Botões de deletar conteúdo */}
                                    {report.reportedComment && (
                                        <button onClick={() => handleAction(report.id, 'DELETE_COMMENT')} className="action-btn-delete">
                                            <FaTrash /> Deletar Comentário
                                        </button>
                                    )}
                                    {report.reportedTopic && (
                                        <button onClick={() => handleAction(report.id, 'DELETE_TOPIC')} className="action-btn-delete">
                                            <FaTrash /> Deletar Tópico
                                        </button>
                                    )}
                                    {report.reportedPost && (
                                        <button onClick={() => handleAction(report.id, 'DELETE_POST')} className="action-btn-delete">
                                            <FaTrash /> Deletar Resposta
                                        </button>
                                    )}

                                    {/* Botão Dropdown de Banimento Temporário */}
                                    {(report.reportedComment || report.reportedPost || report.reportedTopic) && (
                                        <div className="relative">
                                            <button
                                                onClick={() => toggleBanMenu(report.id)}
                                                disabled={!!processingId}
                                                className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition flex items-center gap-2 font-bold text-sm shadow-md"
                                            >
                                                <FaBan />
                                                <span>Bloquear Escrita</span>
                                                <FaChevronDown className={`text-xs transition-transform ${openBanMenuId === report.id ? 'rotate-180' : ''}`} />
                                            </button>

                                            {/* Menu de Opções de Tempo */}
                                            {openBanMenuId === report.id && (
                                                <div className="absolute bottom-full right-0 mb-2 w-56 bg-zinc-800 border border-zinc-600 rounded shadow-xl z-50 overflow-hidden">
                                                    <div className="bg-zinc-700 px-3 py-2 text-xs font-bold text-gray-300 border-b border-zinc-600">
                                                        SELECIONE A DURAÇÃO
                                                    </div>

                                                    <div className="flex flex-col">
                                                        <button onClick={() => handleAction(report.id, 'BAN_USER_COMMENT', '2H')} className="ban-option">
                                                            <FaClock className="text-yellow-500" /> 2 Horas
                                                        </button>
                                                        <button onClick={() => handleAction(report.id, 'BAN_USER_COMMENT', '12H')} className="ban-option">
                                                            <FaClock className="text-yellow-500" /> 12 Horas
                                                        </button>
                                                        <button onClick={() => handleAction(report.id, 'BAN_USER_COMMENT', '1D')} className="ban-option">
                                                            <FaClock className="text-orange-400" /> 1 Dia
                                                        </button>
                                                        <button onClick={() => handleAction(report.id, 'BAN_USER_COMMENT', '1W')} className="ban-option">
                                                            <FaClock className="text-orange-500" /> 1 Semana
                                                        </button>
                                                        <button onClick={() => handleAction(report.id, 'BAN_USER_COMMENT', '1M')} className="ban-option">
                                                            <FaClock className="text-red-400" /> 1 Mês
                                                        </button>
                                                        <button onClick={() => handleAction(report.id, 'BAN_USER_COMMENT', '1Y')} className="ban-option">
                                                            <FaClock className="text-red-500" /> 1 Ano
                                                        </button>
                                                        <div className="border-t border-zinc-600 my-1"></div>
                                                        <button onClick={() => handleAction(report.id, 'BAN_USER_COMMENT', 'PERMANENT')} className="ban-option text-red-500 hover:bg-red-500/10 font-bold">
                                                            <FaBan /> Permanente
                                                        </button>
                                                        <div className="border-t border-zinc-600 my-1"></div>
                                                        <button onClick={() => handleAction(report.id, 'UNBAN_USER')} className="ban-option text-green-400 hover:bg-green-500/10 font-bold">
                                                            <FaUnlock /> Desbloquear
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    <button
                                        onClick={() => handleAction(report.id, 'DELETE_USER')}
                                        disabled={!!processingId}
                                        className="px-4 py-2 bg-red-900/80 text-white border border-red-700 rounded hover:bg-red-900 transition flex items-center gap-2 font-bold text-sm shadow-md"
                                        title="Apaga a conta permanentemente (Ação Irreversível)"
                                    >
                                        <FaUserSecret /> Deletar Conta
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <style>{`
                .action-btn-delete {
                    padding: 0.5rem 1rem;
                    background-color: rgba(234, 88, 12, 0.15);
                    color: #fb923c;
                    border: 1px solid rgba(234, 88, 12, 0.4);
                    border-radius: 0.25rem;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    transition: all 0.2s;
                    font-size: 0.875rem;
                    font-weight: 500;
                }
                .action-btn-delete:hover {
                    background-color: rgba(234, 88, 12, 0.3);
                }
                .ban-option {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    width: 100%;
                    padding: 0.6rem 1rem;
                    text-align: left;
                    font-size: 0.875rem;
                    color: #d4d4d8;
                    transition: background-color 0.2s;
                }
                .ban-option:hover {
                    background-color: rgba(255, 255, 255, 0.1);
                    color: white;
                }
            `}</style>
        </div>
    );
};

export default AdminReportsPage;
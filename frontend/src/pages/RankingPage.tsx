import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { FaSpinner, FaTrophy, FaChartLine, FaUserCircle } from 'react-icons/fa';
import { userService, type UserRankingResponse } from '../services/userService';
import { useAuth } from '../hooks/useAuth';

interface RankingItem extends UserRankingResponse {
    position: number;

}

const RankingPage = () => {
    const { userId: loggedInUserId } = useAuth();
    const [ranking, setRanking] = useState<RankingItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchRanking = async () => {
            setIsLoading(true);
            try {
                const globalRanking: UserRankingResponse[] = await userService.getGlobalRanking();

                const rankedData: RankingItem[] = globalRanking.map((item, index) => ({
                    ...item,
                    position: index + 1,
                }));

                setRanking(rankedData);
            } catch (error) {
                console.error("Erro ao buscar ranking global:", error);
                toast.error('Não foi possível carregar o ranking. Tente novamente mais tarde.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchRanking();
    }, []);

    const renderRankingTable = () => {
        if (isLoading) {
            return (
                <div className="flex justify-center items-center h-48">
                    <FaSpinner className="animate-spin text-violet-500 text-4xl" />
                </div>
            );
        }

        if (ranking.length === 0) {
            return (
                <div className="text-center text-gray-400 py-10">
                    Nenhum usuário encontrado no ranking. Comece a ler para ser o primeiro!
                </div>
            );
        }

        return (
            <div className="overflow-x-auto rounded-lg shadow-xl shadow-zinc-900/50">
                <table className="min-w-full table-auto border-separate border-spacing-y-2">
                    <thead className="bg-zinc-700/50 text-gray-300">
                        <tr>
                            <th className="px-4 py-3 text-left w-16">#</th>
                            <th className="px-4 py-3 text-left">Usuário</th>
                            <th className="px-4 py-3 text-center">Nível</th>
                            <th className="px-4 py-3 text-right">Pontos</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ranking.map((item) => {
                            // Verifica se o usuário atual é o logado para aplicar o destaque
                            const isCurrentUser = String(item.userId) === String(loggedInUserId);

                            const rowClasses = isCurrentUser
                                ? "bg-violet-800/50 border-2 border-violet-500 shadow-md shadow-violet-500/30 font-bold"
                                : "bg-zinc-800 border border-zinc-700 hover:bg-zinc-700/50 transition-colors";

                            return (
                                <tr key={item.userId} className={rowClasses}>
                                    {/* Posição */}
                                    <td className="px-4 py-3 rounded-l-lg text-lg text-center">
                                        {item.position <= 3 ? (
                                            <span className="text-2xl">
                                                {item.position === 1 && <span className="text-yellow-400">🥇</span>}
                                                {item.position === 2 && <span className="text-gray-400">🥈</span>}
                                                {item.position === 3 && <span className="text-yellow-600">🥉</span>}
                                            </span>
                                        ) : (
                                            <span className="text-gray-400">{item.position}</span>
                                        )}
                                    </td>

                                    {/* Nome do Usuário */}
                                    <td className="px-4 py-3 flex items-center gap-3">
                                        <FaUserCircle className="text-2xl text-violet-400" />
                                        <span className={isCurrentUser ? "text-white" : "text-gray-200"}>
                                            {item.nome}
                                            {isCurrentUser && <span className="text-sm text-violet-300 ml-2">(Você)</span>}
                                        </span>
                                    </td>

                                    {/* Nível */}
                                    <td className="px-4 py-3 text-center">
                                        <span className="inline-flex items-center gap-1 bg-green-500/20 text-green-300 text-sm font-semibold px-3 py-1 rounded-full">
                                            <FaTrophy /> {item.nivel}
                                        </span>
                                    </td>

                                    {/* Pontos */}
                                    <td className="px-4 py-3 rounded-r-lg text-right text-lg">
                                        <span className="text-yellow-300 font-extrabold">
                                            {item.pontos.toLocaleString('pt-BR')}
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <div className="w-full max-w-4xl mx-auto py-8 px-4">
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-purple-800 mb-8 text-center flex items-center justify-center gap-3">
                <FaChartLine className="text-violet-500" /> Ranking Global de Leitores
            </h1>

            <p className="text-center text-gray-400 mb-10">
                Veja quem são os leitores mais dedicados da nossa biblioteca! O ranking é baseado na pontuação total acumulada.
            </p>

            {renderRankingTable()}
        </div>
    );
};

export default RankingPage;
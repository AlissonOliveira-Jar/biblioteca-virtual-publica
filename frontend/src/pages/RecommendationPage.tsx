import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { FaSpinner, FaBook, FaStar, FaBookmark } from 'react-icons/fa';
import { recommendationService, type RecommendationResponseDTO } from '../services/recommendationService';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const RecommendationPage = () => {
    const { userId } = useAuth();
    const navigate = useNavigate();
    const [recommendations, setRecommendations] = useState<RecommendationResponseDTO[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchRecommendations = async () => {
            setIsLoading(true);
            try {
                const data = await recommendationService.getRecommendations(String(userId));
                setRecommendations(data);
            } catch (error) {
                console.error("Erro ao carregar recomendações:", error);
                toast.error("Não foi possível carregar as recomendações.");
            } finally {
                setIsLoading(false);
            }
        };

        if (userId) {
            fetchRecommendations();
        }
    }, [userId]);

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex justify-center items-center h-48">
                    <FaSpinner className="animate-spin text-violet-500 text-4xl" />
                </div>
            );
        }

        if (recommendations.length === 0) {
            return (
                <div className="text-center text-gray-400 py-10">
                    Nenhuma recomendação disponível no momento. Leia mais livros para melhorar suas recomendações! 📚
                </div>
            );
        }

        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {recommendations.map((rec) => (
                    <div
                        key={rec.livroId}
                        className="bg-zinc-800 rounded-xl p-5 border border-zinc-700 shadow-lg hover:shadow-violet-700/30 transition-all hover:scale-[1.03]"
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <FaBook className="text-violet-400 text-3xl" />
                            <h2 className="text-xl font-bold text-white">{rec.titulo}</h2>
                        </div>

                        <p className="text-gray-400 mb-2">
                            <span className="font-semibold text-gray-300">Autor:</span> {rec.autor}
                        </p>

                        <div className="mb-3">
                            <p className="font-semibold text-gray-300">Gêneros:</p>
                            <div className="flex flex-wrap gap-2 mt-1">
                                {rec.genero.map((g, index) => (
                                    <span
                                        key={index}
                                        className="bg-violet-500/20 text-violet-300 px-3 py-1 rounded-full text-xs border border-violet-500/30"
                                    >
                                        {g}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-end mt-4">
                            <button
                             onClick={() => navigate(`/livros/${rec.livroId}`)}
                             className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 transition px-4 py-2 rounded-lg text-white font-bold">
                                <FaBookmark /> Ver Descrição
                            </button>
                            <button
                              onClick={() => navigate(`/livros/${rec.livroId}/ler`)}
                            >
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="w-full max-w-5xl mx-auto py-8 px-4">
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-purple-800 mb-6 text-center flex items-center justify-center gap-3">
                <FaStar className="text-violet-400" /> Recomendações Para Você
            </h1>

            <p className="text-center text-gray-400 mb-8">
                Livros selecionados com base nos seus gostos e histórico de leitura.
            </p>

            {renderContent()}
        </div>
    );
};

export default RecommendationPage;
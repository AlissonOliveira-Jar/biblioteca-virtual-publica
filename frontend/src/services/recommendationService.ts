import api from './api';

export interface RecommendationResponseDTO {
    livroId: string;
    titulo: string;
    autor: string;
    genero: string[];
}
const getRecommendations = async (userId: string): Promise<RecommendationResponseDTO[]> => {
    const response = await api.get<RecommendationResponseDTO[]>(`/recomendacao/${userId}`);
    return response.data;
};

export const recommendationService = {
    getRecommendations,
};
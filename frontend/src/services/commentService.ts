import api from "./api";
import type { CommentCreateDTO, CommentResponseDTO } from "../types/comment";

const getComments = async (bookId: string): Promise<CommentResponseDTO[]> => {
    const { data } = await api.get<CommentResponseDTO[]>(`/books/${bookId}/comments`);
    return data;
};

const createComment = async (
    bookId: string,
    commentData: CommentCreateDTO
): Promise<CommentResponseDTO> => {
    const { data } = await api.post<CommentResponseDTO>(`/books/${bookId}/comments`, commentData);
    return data;
};

const voteComment = async (
    bookId: string,
    commentId: string,
    helpful: boolean
): Promise<void> => {
    await api.post(`/books/${bookId}/comments/${commentId}/vote`, null, {
        params: { helpful }
    });
};

export const commentService = {
    getComments,
    createComment,
    voteComment
};
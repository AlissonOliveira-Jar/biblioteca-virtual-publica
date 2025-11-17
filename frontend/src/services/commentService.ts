import api from "./api";
import type { CommentCreateDTO, CommentResponseDTO } from "../types/comment";

const getComments = async (bookId: string): Promise<CommentResponseDTO[]> => {
    const res = await api.get(`/books/${bookId}/comments`);
    return res.data;
};

const createComment = async (
    bookId: string,
    data: CommentCreateDTO
): Promise<CommentResponseDTO> => {
    const res = await api.post(`/books/${bookId}/comments`, data);
    return res.data;
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

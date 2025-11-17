export interface Comment {
    id: string;
    content: string;
    createdAt: string;
    userName: string;
    userId: string;
    helpfulCount: number;
    notHelpfulCount: number;
    replies: Comment[];
}

export interface CommentResponseDTO {
    id: string;
    userName: string;
    userId: string;
    content: string;
    createdAt: string;
    helpfulCount: number;
    notHelpfulCount: number;
    replies: CommentResponseDTO[];
}

export interface CommentCreateDTO {
    content: string;
    parentCommentId?: string | null;
}

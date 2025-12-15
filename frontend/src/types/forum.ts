export interface ForumAuthor {
    id: string;
    username: string;
    avatarUrl: string | null;
    level: number;
    isCommentBanned: boolean;
}

export interface ForumCategory {
    id: string;
    name: string;
    slug: string;
    description: string;
}

export interface ForumTopicList {
    id: string;
    title: string;
    author: ForumAuthor;
    category: ForumCategory;
    viewCount: number;
    replyCount: number;
    isClosed: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface ForumTopicDetail {
    id: string;
    title: string;
    content: string;
    author: ForumAuthor;
    category: ForumCategory;
    viewCount: number;
    isClosed: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface ForumPost {
    id: string;
    content: string;
    author: ForumAuthor;
    createdAt: string;
    updatedAt: string;
}

export interface ForumTopicPageResponse {
    topics: ForumTopicList[];
    currentPage: number;
    totalPages: number;
    totalElements: number;
    hasNext: boolean;
    hasPrevious: boolean;
}

export interface ForumPostPageResponse {
    posts: ForumPost[];
    currentPage: number;
    totalPages: number;
    totalElements: number;
    hasNext: boolean;
    hasPrevious: boolean;
}

export interface CreateTopicRequest {
    title: string;
    content: string;
    categoryId: string;
}

export interface CreatePostRequest {
    content: string;
}
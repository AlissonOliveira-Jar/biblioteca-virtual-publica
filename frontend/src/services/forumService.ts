import api from './api';
import type {
    CreatePostRequest,
    CreateTopicRequest,
    ForumCategory, ForumPost,
    ForumPostPageResponse,
    ForumTopicDetail,
    ForumTopicPageResponse
} from "../types/forum.ts";


export const forumService = {
    getCategories: async (): Promise<ForumCategory[]> => {
        const response = await api.get('/forum/categories');
        return response.data;
    },

    getTopics: async (page = 0, size = 20, categoryId?: string): Promise<ForumTopicPageResponse> => {
        const params = { page, size, ...(categoryId && { categoryId }) };
        const response = await api.get('/forum/topics', { params });
        return response.data;
    },

    getTopicById: async (topicId: string): Promise<ForumTopicDetail> => {
        const response = await api.get(`/forum/topics/${topicId}`);
        return response.data;
    },

    getTopicPosts: async (topicId: string, page = 0, size = 50): Promise<ForumPostPageResponse> => {
        const response = await api.get(`/forum/topics/${topicId}/posts`, {
            params: { page, size }
        });
        return response.data;
    },

    createTopic: async (data: CreateTopicRequest): Promise<ForumTopicDetail> => {
        const response = await api.post('/forum/topics', data);
        return response.data;
    },

    replyToTopic: async (topicId: string, data: CreatePostRequest): Promise<ForumPost> => {
        const response = await api.post(`/forum/topics/${topicId}/reply`, data);
        return response.data;
    },

    toggleTopicClosed: async (topicId: string): Promise<void> => {
        await api.patch(`/forum/topics/${topicId}/toggle-closed`);
    }
};

export default forumService;
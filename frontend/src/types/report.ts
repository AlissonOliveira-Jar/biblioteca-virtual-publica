export type ReportReason =
    | 'SPAM'
    | 'OFFENSIVE_LANGUAGE'
    | 'HATE_SPEECH'
    | 'FAKE_PROFILE'
    | 'MISINFORMATION'
    | 'SPOILER'
    | 'OTHER';

export interface ReportCreateDTO {
    reason: ReportReason;
    reportedUserId?: string;
    reportedCommentId?: string;
    reportedTopicId?: string;
    reportedPostId?: string;
}

interface UserSummary {
    id: string;
    name: string;
    email: string;
    isCommentBanned?: boolean;
    commentBanExpiresAt?: string;
}

export interface ReportDTO {
    id: string;
    reason: string;
    status: string;
    createdAt: string;

    reporter?: UserSummary;

    reportedUser?: UserSummary;

    reportedComment?: {
        id: string;
        content: string;
        user: UserSummary;
    };

    reportedTopic?: {
        id: string;
        title: string;
        author: UserSummary;
    };

    reportedPost?: {
        id: string;
        content: string;
        author: UserSummary;
    };
}
// Enums/Constantes para os Motivos
export const ReportReason = {
    SPAM: "SPAM",
    OFFENSIVE_LANGUAGE: "OFFENSIVE_LANGUAGE",
    HATE_SPEECH: "HATE_SPEECH",
    FAKE_PROFILE: "FAKE_PROFILE",
    OTHER: "OTHER"
} as const;

export type ReportReason = typeof ReportReason[keyof typeof ReportReason];

export interface ReportCreateDTO {
    reportedCommentId?: string;
    reportedUserId?: string;
    reason: ReportReason;
}

export interface ReportDTO {
    id: string;
    reason: string;
    status: string;
    createdAt: string;

    reporter: {
        id: string;
        name: string;
        email: string;
    };

    reportedComment?: {
        id: string;
        content: string;
        user: {
            id: string;
            name: string;
        }
    };

    reportedUser?: {
        id: string;
        name: string;
        email: string
    };
}
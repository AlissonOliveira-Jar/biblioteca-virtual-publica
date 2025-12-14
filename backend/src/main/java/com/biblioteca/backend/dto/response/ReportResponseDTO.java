package com.biblioteca.backend.dto.response;

import com.biblioteca.backend.enums.ReportReason;
import com.biblioteca.backend.enums.ReportStatus;

import java.time.Instant;

public record ReportResponseDTO(
        String id,
        ReportReason reason,
        ReportStatus status,
        Instant createdAt,
        UserSummaryDTO reporter,
        ReportedCommentDTO reportedComment,
        UserSummaryDTO reportedUser,
        ReportedTopicDTO reportedTopic,
        ReportedPostDTO reportedPost
) {
    public record UserSummaryDTO(
            String id,
            String name,
            String email,
            boolean isCommentBanned,
            Instant commentBanExpiresAt
    ) {}

    public record ReportedCommentDTO(String id, String content, UserSummaryDTO user) {}

    public record ReportedTopicDTO(String id, String title, UserSummaryDTO author) {}

    public record ReportedPostDTO(String id, String content, UserSummaryDTO author) {}
}
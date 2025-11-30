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
        UserSummaryDTO reportedUser
) {
    public record UserSummaryDTO(String id, String name, String email) {}

    public record ReportedCommentDTO(String id, String content, UserSummaryDTO user) {}
}
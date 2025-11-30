package com.biblioteca.backend.dto.request;

import com.biblioteca.backend.enums.ReportReason;

public record ReportCreateDTO(
        String reportedCommentId,
        String reportedUserId,
        ReportReason reason
) {
}

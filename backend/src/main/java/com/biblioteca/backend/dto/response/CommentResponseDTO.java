package com.biblioteca.backend.dto.response;

import java.time.Instant;
import java.util.List;

public record CommentResponseDTO(
        String id,
        String userName,
        String userId,
        String content,
        Instant createdAt,
        int helpfulCount,
        int notHelpfulCount,
        List<CommentResponseDTO> replies
) {}

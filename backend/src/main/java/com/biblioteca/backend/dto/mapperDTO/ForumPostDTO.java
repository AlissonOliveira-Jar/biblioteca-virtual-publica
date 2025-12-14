package com.biblioteca.backend.dto.mapperDTO;

import java.time.LocalDateTime;
import java.util.UUID;

public record ForumPostDTO(
        UUID id,
        String content,
        ForumAuthorDTO author,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {}
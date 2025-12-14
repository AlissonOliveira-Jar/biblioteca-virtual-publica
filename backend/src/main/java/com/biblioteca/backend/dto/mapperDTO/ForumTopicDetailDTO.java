package com.biblioteca.backend.dto.mapperDTO;

import java.time.LocalDateTime;
import java.util.UUID;

public record ForumTopicDetailDTO(
        UUID id,
        String title,
        String content,
        ForumAuthorDTO author,
        ForumCategoryDTO category,
        Integer viewCount,
        Boolean isClosed,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {}

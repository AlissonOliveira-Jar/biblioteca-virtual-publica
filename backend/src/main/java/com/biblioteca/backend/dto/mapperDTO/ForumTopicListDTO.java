package com.biblioteca.backend.dto.mapperDTO;

import java.time.LocalDateTime;
import java.util.UUID;

public record ForumTopicListDTO(
        UUID id,
        String title,
        ForumAuthorDTO author,
        ForumCategoryDTO category,
        Integer viewCount,
        Long replyCount,
        Boolean isClosed,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {}
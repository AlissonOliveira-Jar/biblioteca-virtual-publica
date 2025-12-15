package com.biblioteca.backend.dto.mapperDTO;

import java.util.UUID;

public record ForumAuthorDTO(
        UUID id,
        String username,
        String avatarUrl,
        Integer level,
        Boolean isCommentBanned
) {}

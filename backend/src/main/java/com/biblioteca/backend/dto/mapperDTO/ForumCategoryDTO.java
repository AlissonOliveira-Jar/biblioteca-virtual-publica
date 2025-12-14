package com.biblioteca.backend.dto.mapperDTO;

import java.util.UUID;

public record ForumCategoryDTO(
        UUID id,
        String name,
        String slug,
        String description
) {}

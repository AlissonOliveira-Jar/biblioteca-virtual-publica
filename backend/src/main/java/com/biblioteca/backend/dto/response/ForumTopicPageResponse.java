package com.biblioteca.backend.dto.response;

import com.biblioteca.backend.dto.mapperDTO.ForumTopicListDTO;

import java.util.List;

public record ForumTopicPageResponse(
        List<ForumTopicListDTO> topics,
        int currentPage,
        int totalPages,
        long totalElements,
        boolean hasNext,
        boolean hasPrevious
) {}
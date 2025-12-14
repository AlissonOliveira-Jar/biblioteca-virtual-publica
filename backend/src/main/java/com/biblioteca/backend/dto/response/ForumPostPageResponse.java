package com.biblioteca.backend.dto.response;

import com.biblioteca.backend.dto.mapperDTO.ForumPostDTO;

import java.util.List;

public record ForumPostPageResponse(
        List<ForumPostDTO> posts,
        int currentPage,
        int totalPages,
        long totalElements,
        boolean hasNext,
        boolean hasPrevious
) {}
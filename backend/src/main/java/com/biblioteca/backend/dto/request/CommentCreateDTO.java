package com.biblioteca.backend.dto.request;

public record CommentCreateDTO(
        String content,
        String parentCommentId
) { }


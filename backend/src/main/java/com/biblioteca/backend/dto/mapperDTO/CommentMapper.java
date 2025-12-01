package com.biblioteca.backend.dto.mapperDTO;

import com.biblioteca.backend.dto.response.CommentResponseDTO;
import com.biblioteca.backend.entity.Comment;
import org.springframework.stereotype.Component;

@Component
public class CommentMapper {

    public CommentResponseDTO toDTO(Comment c) {
        return new CommentResponseDTO(
                c.getId().toString(),
                c.getUser().getName(),
                c.getUser().getId().toString(),
                c.getContent(),
                c.getCreatedAt(),
                c.getHelpfulCount(),
                c.getNotHelpfulCount(),
                c.getReplies().stream()
                        .map(this::toDTO)
                        .toList()
        );
    }
}

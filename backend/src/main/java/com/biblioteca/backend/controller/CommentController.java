package com.biblioteca.backend.controller;

import com.biblioteca.backend.dto.request.CommentCreateDTO;
import com.biblioteca.backend.dto.response.CommentResponseDTO;
import com.biblioteca.backend.entity.User;
import com.biblioteca.backend.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/books/{bookId}/comments")
public class CommentController {

    @Autowired private CommentService service;

    @GetMapping
    public ResponseEntity<List<CommentResponseDTO>> getComments(@PathVariable String bookId) {
        return ResponseEntity.ok(service.listThreaded(UUID.fromString(bookId)));
    }

    @PostMapping
    public ResponseEntity<CommentResponseDTO> createComment(
            @PathVariable String bookId,
            @RequestBody CommentCreateDTO dto,
            @AuthenticationPrincipal User user
    ) {
        if(user == null) {
            return ResponseEntity.status(401).build();
        }

        return ResponseEntity.ok(service.create(
                UUID.fromString(bookId),
                user.getId(),
                dto
        ));
    }

    @PostMapping("/{commentId}/vote")
    public ResponseEntity<Void> vote(
            @PathVariable String commentId,
            @RequestParam boolean helpful
    ) {
        service.vote(UUID.fromString(commentId), helpful);
        return ResponseEntity.ok().build();
    }
}
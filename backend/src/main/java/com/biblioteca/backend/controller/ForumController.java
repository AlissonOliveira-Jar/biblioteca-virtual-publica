package com.biblioteca.backend.controller;

import com.biblioteca.backend.dto.mapperDTO.*;
import com.biblioteca.backend.dto.request.*;
import com.biblioteca.backend.dto.response.*;
import com.biblioteca.backend.entity.User;
import com.biblioteca.backend.service.ForumService;
import com.biblioteca.backend.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/forum")
@RequiredArgsConstructor
@Slf4j
public class ForumController {

    private final ForumService forumService;
    private final UserRepository userRepository;

    @GetMapping("/categories")
    public ResponseEntity<List<ForumCategoryDTO>> getCategories() {
        log.info("GET /api/forum/categories");
        return ResponseEntity.ok(forumService.getAllCategories());
    }

    @GetMapping("/topics")
    public ResponseEntity<ForumTopicPageResponse> getTopics(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) UUID categoryId
    ) {
        log.info("GET /api/forum/topics - page: {}, size: {}, categoryId: {}", page, size, categoryId);
        return ResponseEntity.ok(forumService.getAllTopics(page, size, categoryId));
    }

    @PostMapping("/topics")
    public ResponseEntity<ForumTopicDetailDTO> createTopic(
            @Valid @RequestBody CreateTopicRequest request,
            Authentication authentication
    ) {
        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado: " + email));

        log.info("POST /api/forum/topics - Autor: {}, ID: {}", email, user.getId());

        ForumTopicDetailDTO topic = forumService.createTopic(request, user.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(topic);
    }

    @GetMapping("/topics/{topicId}")
    public ResponseEntity<ForumTopicDetailDTO> getTopicById(
            @PathVariable UUID topicId
    ) {
        log.info("GET /api/forum/topics/{}", topicId);
        return ResponseEntity.ok(forumService.getTopicById(topicId));
    }

    @GetMapping("/topics/{topicId}/posts")
    public ResponseEntity<ForumPostPageResponse> getTopicPosts(
            @PathVariable UUID topicId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size
    ) {
        log.info("GET /api/forum/topics/{}/posts - page: {}, size: {}", topicId, page, size);
        return ResponseEntity.ok(forumService.getTopicPosts(topicId, page, size));
    }

    @PostMapping("/topics/{topicId}/reply")
    public ResponseEntity<ForumPostDTO> replyToTopic(
            @PathVariable UUID topicId,
            @Valid @RequestBody CreatePostRequest request,
            Authentication authentication
    ) {
        // Mesma correção aqui
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado: " + email));

        log.info("POST /api/forum/topics/{}/reply - Autor: {}", topicId, email);

        ForumPostDTO post = forumService.replyToTopic(topicId, request, user.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(post);
    }

    @PatchMapping("/topics/{topicId}/toggle-closed")
    public ResponseEntity<Void> toggleTopicClosed(
            @PathVariable UUID topicId,
            Authentication authentication
    ) {
        log.info("PATCH /api/forum/topics/{}/toggle-closed", topicId);
        forumService.toggleTopicClosed(topicId);
        return ResponseEntity.noContent().build();
    }
}
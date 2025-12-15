package com.biblioteca.backend.service;

import com.biblioteca.backend.entity.ForumCategory;
import com.biblioteca.backend.entity.ForumPost;
import com.biblioteca.backend.entity.ForumTopic;
import com.biblioteca.backend.entity.User;

import com.biblioteca.backend.dto.mapperDTO.*;
import com.biblioteca.backend.dto.request.CreatePostRequest;
import com.biblioteca.backend.dto.request.CreateTopicRequest;
import com.biblioteca.backend.dto.response.ForumPostPageResponse;
import com.biblioteca.backend.dto.response.ForumTopicPageResponse;
import com.biblioteca.backend.kafka.ForumProducerService;
import com.biblioteca.backend.repository.ForumCategoryRepository;
import com.biblioteca.backend.repository.ForumPostRepository;
import com.biblioteca.backend.repository.ForumTopicRepository;
import com.biblioteca.backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ForumService {

    private final ForumTopicRepository topicRepository;
    private final ForumPostRepository postRepository;
    private final ForumCategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final ForumMapper mapper;
    private final ForumProducerService forumProducer;

    @Transactional(readOnly = true)
    public List<ForumCategoryDTO> getAllCategories() {
        log.debug("Listando todas as categorias");
        return categoryRepository.findAll().stream()
                .map(mapper::toCategoryDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public ForumTopicPageResponse getAllTopics(int page, int size, UUID categoryId) {
        log.debug("Listando tópicos - page: {}, size: {}, categoryId: {}", page, size, categoryId);

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());

        Page<ForumTopic> topicsPage = (categoryId != null)
                ? topicRepository.findByCategoryId(categoryId, pageable)
                : topicRepository.findAll(pageable);

        Map<UUID, Long> replyCountMap = getReplyCountsForTopics(topicsPage.getContent());

        return mapper.toTopicPageResponse(topicsPage, replyCountMap);
    }

    @Transactional
    public ForumTopicDetailDTO createTopic(CreateTopicRequest request, UUID authorId) {
        log.info("Iniciando criação de tópico. Autor: {}", authorId);

        var author = getAuthorAndValidatePermissions(authorId, "criar tópicos");
        var category = findCategoryOrThrow(request.categoryId());

        var topic = ForumTopic.builder()
                .title(request.title())
                .content(request.content())
                .author(author)
                .category(category)
                .isClosed(false)
                .viewCount(0)
                .build();

        topic = topicRepository.save(topic);

        forumProducer.sendTopicCreatedEvent(topic.getId(), authorId);

        log.info("Tópico criado com sucesso: {}", topic.getId());
        return mapper.toTopicDetailDTO(topic);
    }

    @Transactional
    public ForumTopicDetailDTO getTopicById(UUID topicId) {
        var topic = topicRepository.findByIdWithDetails(topicId)
                .orElseThrow(() -> new IllegalArgumentException("Tópico não encontrado com ID: " + topicId));

        topic.incrementViewCount();
        topicRepository.save(topic);

        return mapper.toTopicDetailDTO(topic);
    }

    @Transactional(readOnly = true)
    public ForumPostPageResponse getTopicPosts(UUID topicId, int page, int size) {
        if (!topicRepository.existsById(topicId)) {
            throw new IllegalArgumentException("Tópico não encontrado");
        }

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").ascending());
        Page<ForumPost> postsPage = postRepository.findByTopicIdWithAuthor(topicId, pageable);

        return mapper.toPostPageResponse(postsPage);
    }

    @Transactional
    public ForumPostDTO replyToTopic(UUID topicId, CreatePostRequest request, UUID authorId) {
        log.info("Iniciando resposta ao tópico: {}. Autor: {}", topicId, authorId);

        var topic = findTopicOrThrow(topicId);
        validateTopicIsOpen(topic);

        var author = getAuthorAndValidatePermissions(authorId, "responder tópicos");

        var post = ForumPost.builder()
                .content(request.content())
                .topic(topic)
                .author(author)
                .build();

        post = postRepository.save(post);

        forumProducer.sendPostCreatedEvent(post.getId(), topicId, authorId);

        log.info("Resposta salva com sucesso: {}", post.getId());
        return mapper.toPostDTO(post);
    }

    @Transactional
    public void toggleTopicClosed(UUID topicId) {
        var topic = findTopicOrThrow(topicId);
        topic.setIsClosed(!topic.getIsClosed());
        topicRepository.save(topic);
        log.info("Status do tópico {} alterado. Fechado: {}", topicId, topic.getIsClosed());
    }

    private User getAuthorAndValidatePermissions(UUID authorId, String actionDescription) {
        User author = userRepository.findById(authorId)
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado"));

        if (author.isCommentBanned()) {
            log.warn("Tentativa de ação bloqueada. Usuário {} está banido.", authorId);
            throw new IllegalStateException("Usuário banido não pode " + actionDescription);
        }
        return author;
    }

    private ForumCategory findCategoryOrThrow(UUID categoryId) {
        return categoryRepository.findById(categoryId)
                .orElseThrow(() -> new IllegalArgumentException("Categoria não encontrada"));
    }

    private ForumTopic findTopicOrThrow(UUID topicId) {
        return topicRepository.findById(topicId)
                .orElseThrow(() -> new IllegalArgumentException("Tópico não encontrado"));
    }

    private void validateTopicIsOpen(ForumTopic topic) {
        if (Boolean.TRUE.equals(topic.getIsClosed())) {
            throw new IllegalStateException("Este tópico está fechado para novas respostas");
        }
    }

    private Map<UUID, Long> getReplyCountsForTopics(List<ForumTopic> topics) {
        List<UUID> topicIds = topics.stream()
                .map(ForumTopic::getId)
                .toList();

        if (topicIds.isEmpty()) {
            return Map.of();
        }

        return topicIds.stream()
                .collect(Collectors.toMap(
                        id -> id,
                        postRepository::countByTopicId,
                        (existing, replacement) -> existing
                ));
    }
}
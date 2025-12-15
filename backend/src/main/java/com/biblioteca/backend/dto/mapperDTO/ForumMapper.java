package com.biblioteca.backend.dto.mapperDTO;
import com.biblioteca.backend.dto.response.ForumPostPageResponse;
import com.biblioteca.backend.dto.response.ForumTopicPageResponse;
import com.biblioteca.backend.entity.ForumCategory;
import com.biblioteca.backend.entity.ForumPost;
import com.biblioteca.backend.entity.ForumTopic;
import com.biblioteca.backend.entity.User;
import com.biblioteca.backend.entity.Pontuacao;
import com.biblioteca.backend.repository.PontuacaoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class ForumMapper {

    private final PontuacaoRepository pontuacaoRepository;

    public ForumAuthorDTO toAuthorDTO(User user) {
        if (user == null) return null;

        Integer level = pontuacaoRepository.findByUser(user)
                .map(Pontuacao::getNivel)
                .orElse(1);

        String avatarUrl = (user.getAvatarUrl() != null && !user.getAvatarUrl().isEmpty())
                ? user.getAvatarUrl()
                : null;

        return new ForumAuthorDTO(
                user.getId(),
                user.getName(),
                avatarUrl,
                level,
                user.isCommentBanned()
        );
    }

    public ForumCategoryDTO toCategoryDTO(ForumCategory category) {
        if (category == null) return null;
        return new ForumCategoryDTO(
                category.getId(),
                category.getName(),
                category.getSlug(),
                category.getDescription()
        );
    }

    public ForumTopicDetailDTO toTopicDetailDTO(ForumTopic topic) {
        return new ForumTopicDetailDTO(
                topic.getId(),
                topic.getTitle(),
                topic.getContent(),
                toAuthorDTO(topic.getAuthor()),
                toCategoryDTO(topic.getCategory()),
                topic.getViewCount(),
                topic.getIsClosed(),
                topic.getCreatedAt(),
                topic.getUpdatedAt()
        );
    }

    public ForumPostDTO toPostDTO(ForumPost post) {
        return new ForumPostDTO(
                post.getId(),
                post.getContent(),
                toAuthorDTO(post.getAuthor()),
                post.getCreatedAt(),
                post.getUpdatedAt()
        );
    }

    public ForumTopicPageResponse toTopicPageResponse(Page<ForumTopic> page, Map<UUID, Long> replyCountMap) {
        var topics = page.getContent().stream()
                .map(topic -> new ForumTopicListDTO(
                        topic.getId(),
                        topic.getTitle(),
                        toAuthorDTO(topic.getAuthor()),
                        toCategoryDTO(topic.getCategory()),
                        topic.getViewCount(),
                        replyCountMap.getOrDefault(topic.getId(), 0L),
                        topic.getIsClosed(),
                        topic.getCreatedAt(),
                        topic.getUpdatedAt()
                ))
                .toList();

        return new ForumTopicPageResponse(
                topics,
                page.getNumber(),
                page.getTotalPages(),
                page.getTotalElements(),
                page.hasNext(),
                page.hasPrevious()
        );
    }

    public ForumPostPageResponse toPostPageResponse(Page<ForumPost> page) {
        var posts = page.getContent().stream()
                .map(this::toPostDTO)
                .toList();

        return new ForumPostPageResponse(
                posts,
                page.getNumber(),
                page.getTotalPages(),
                page.getTotalElements(),
                page.hasNext(),
                page.hasPrevious()
        );
    }
}
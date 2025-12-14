package com.biblioteca.backend.repository;

import com.biblioteca.backend.entity.ForumPost;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ForumPostRepository extends JpaRepository<ForumPost, UUID> {

    @Query("SELECT p FROM ForumPost p " +
            "JOIN FETCH p.author " +
            "WHERE p.topic.id = :topicId " +
            "ORDER BY p.createdAt ASC")
    Page<ForumPost> findByTopicIdWithAuthor(@Param("topicId") UUID topicId, Pageable pageable);

    long countByTopicId(UUID topicId);

    Page<ForumPost> findByAuthorId(UUID authorId, Pageable pageable);
}
package com.biblioteca.backend.repository;

import com.biblioteca.backend.entity.ForumTopic;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ForumTopicRepository extends JpaRepository<ForumTopic, UUID> {

    Page<ForumTopic> findByCategoryId(UUID categoryId, Pageable pageable);

    Page<ForumTopic> findByAuthorId(UUID authorId, Pageable pageable);

    Page<ForumTopic> findByIsClosedFalse(Pageable pageable);

    @Query("SELECT t FROM ForumTopic t " +
            "JOIN FETCH t.author " +
            "JOIN FETCH t.category " +
            "WHERE t.id = :id")
    Optional<ForumTopic> findByIdWithDetails(@Param("id") UUID id);

    @Query("SELECT t FROM ForumTopic t " +
            "JOIN FETCH t.author " +
            "JOIN FETCH t.category " +
            "ORDER BY t.createdAt DESC")
    Page<ForumTopic> findAllWithDetails(Pageable pageable);
}

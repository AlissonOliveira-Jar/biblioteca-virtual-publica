package com.biblioteca.backend.repository;

import com.biblioteca.backend.entity.ForumCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ForumCategoryRepository extends JpaRepository<ForumCategory, UUID> {

    Optional<ForumCategory> findBySlug(String slug);

    boolean existsBySlug(String slug);
}

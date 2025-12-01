package com.biblioteca.backend.repository;

import com.biblioteca.backend.entity.Comment;
import com.biblioteca.backend.entity.User;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CommentRepository extends JpaRepository<Comment, UUID> {

    @EntityGraph(attributePaths = {"user", "replies", "replies.user"})
    List<Comment> findByLivroIdAndParentCommentIsNullOrderByHelpfulCountDescCreatedAtDesc(UUID livroId);

    void deleteByUser(User user);
}
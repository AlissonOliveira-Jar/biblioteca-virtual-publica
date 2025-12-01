package com.biblioteca.backend.repository;

import com.biblioteca.backend.entity.Comment;
import com.biblioteca.backend.entity.CommentVote;
import com.biblioteca.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public interface CommentVoteRepository extends JpaRepository<CommentVote, UUID> {
    Optional<CommentVote> findByUserAndComment(User user, Comment comment);
}
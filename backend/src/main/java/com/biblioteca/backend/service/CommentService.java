package com.biblioteca.backend.service;

import com.biblioteca.backend.dto.mapperDTO.CommentMapper;
import com.biblioteca.backend.dto.request.CommentCreateDTO;
import com.biblioteca.backend.dto.response.CommentResponseDTO;
import com.biblioteca.backend.entity.Comment;
import com.biblioteca.backend.entity.Livro;
import com.biblioteca.backend.entity.User;
import com.biblioteca.backend.exception.UserNotAllowedToCommentException;
import com.biblioteca.backend.repository.CommentRepository;
import com.biblioteca.backend.repository.LivroRepository;
import com.biblioteca.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class CommentService {

    private final CommentRepository commentRepository;
    private final LivroRepository livroRepository;
    private final UserRepository userRepository;
    private final CommentMapper mapper;

    public CommentService(CommentRepository commentRepository,
                          LivroRepository livroRepository,
                          UserRepository userRepository,
                          CommentMapper mapper) {
        this.commentRepository = commentRepository;
        this.livroRepository = livroRepository;
        this.userRepository = userRepository;
        this.mapper = mapper;
    }

    @Transactional
    public CommentResponseDTO create(UUID bookId, UUID userId, CommentCreateDTO dto) {

        Livro livro = livroRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Livro não encontrado"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        if (user.isCommentBanned()) {
            throw new UserNotAllowedToCommentException("Sua conta está suspensa de realizar comentários devido a denúncias anteriores.");
        }

        Comment parent = null;

        if (dto.parentCommentId() != null && !dto.parentCommentId().isBlank()) {
            parent = commentRepository.findById(UUID.fromString(dto.parentCommentId()))
                    .orElseThrow(() -> new RuntimeException("Comentário pai não encontrado"));
        }

        Comment comment = new Comment(dto.content(), user, livro, parent);
        commentRepository.save(comment);

        return mapper.toDTO(comment);
    }

    @Transactional(readOnly = true)
    public List<CommentResponseDTO> listThreaded(UUID livroId) {
        List<Comment> rootComments =
                commentRepository.findByLivroIdAndParentCommentIsNullOrderByHelpfulCountDescCreatedAtDesc(livroId);

        return rootComments.stream()
                .map(mapper::toDTO)
                .toList();
    }

    @Transactional
    public void vote(UUID commentId, boolean helpful) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comentário não encontrado"));

        if (helpful) {
            comment.setHelpfulCount(comment.getHelpfulCount() + 1);
        } else {
            comment.setNotHelpfulCount(comment.getNotHelpfulCount() + 1);
        }
        commentRepository.save(comment);
    }
}
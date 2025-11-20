package com.biblioteca.backend.service;

import com.biblioteca.backend.dto.CommentMapper;
import com.biblioteca.backend.dto.request.CommentCreateDTO;
import com.biblioteca.backend.dto.response.CommentResponseDTO;
import com.biblioteca.backend.entity.Comment;
import com.biblioteca.backend.entity.Livro;
import com.biblioteca.backend.entity.User;
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

    @Transactional // Garante que o save seja atômico
    public CommentResponseDTO create(UUID bookId, UUID userId, CommentCreateDTO dto) {
        Livro livro = livroRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Livro não encontrado"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        Comment parent = null;
        // Validação extra: só converte para UUID se não for nulo E não for vazio
        if (dto.parentCommentId() != null && !dto.parentCommentId().isBlank()) {
            parent = commentRepository.findById(UUID.fromString(dto.parentCommentId()))
                    .orElseThrow(() -> new RuntimeException("Comentário pai não encontrado"));
        }

        Comment comment = new Comment(dto.content(), user, livro, parent);
        commentRepository.save(comment);

        return mapper.toDTO(comment);
    }

    @Transactional(readOnly = true) // Otimiza performance de leitura e mantém sessão aberta
    public List<CommentResponseDTO> listThreaded(UUID livroId) {
        // O repository agora usa EntityGraph para trazer tudo otimizado
        List<Comment> rootComments =
                commentRepository.findByLivroIdAndParentCommentIsNullOrderByCreatedAtDesc(livroId);

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
        // O save é opcional quando se usa @Transactional (Dirty Checking),
        // mas mal não faz deixar explícito.
        commentRepository.save(comment);
    }
}
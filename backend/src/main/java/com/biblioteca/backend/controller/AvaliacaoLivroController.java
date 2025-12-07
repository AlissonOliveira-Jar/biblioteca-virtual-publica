package com.biblioteca.backend.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.Optional;
import com.biblioteca.backend.entity.User;
import com.biblioteca.backend.service.UserService;
import com.biblioteca.backend.entity.AvaliacaoLivro;
import com.biblioteca.backend.service.AvaliacaoLivroService;
import com.biblioteca.backend.exception.UserNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import com.biblioteca.backend.dto.request.AvaliacaoRequest;
import com.biblioteca.backend.dto.response.LivroAvaliacaoDTO;
import jakarta.validation.Valid;
import java.util.UUID;
import java.util.List;

@RestController
@RequestMapping("/api/avaliacao")
@RequiredArgsConstructor

public class AvaliacaoLivroController {

    private final AvaliacaoLivroService avaliacaoLivroService;
    private final UserService userService;
    private static final Logger log = LoggerFactory.getLogger(AvaliacaoLivroController.class);

    @PostMapping
    public ResponseEntity<?> avaliarLivro(@Valid @RequestBody AvaliacaoRequest request
            , Authentication authentication) {
        String userEmail = authentication.getName();

        try {
            log.info("Tentando registrar/atualizar avaliação para o usuário: {}", userEmail);
            User user = userService.getUserEntityByEmail(userEmail);
            UUID idUsuario = user.getId();

            log.info("Usuário autenticado encontrado. ID: {}", idUsuario);
            AvaliacaoLivro avaliacao = avaliacaoLivroService.registrarAvaliacao(
                    idUsuario,
                    request.titulo(),
                    request.nota(),
                    request.comentario()
            );
            return ResponseEntity.status(HttpStatus.CREATED).body(avaliacao);

        } catch (UserNotFoundException e) {
            log.error("Erro de Autenticação: Usuário logado não encontrado no sistema. Email: {}", userEmail, e);
            // Este caso só deve ocorrer se houver inconsistência entre Auth e DB
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Usuário autenticado não encontrado.");
        } catch (IllegalArgumentException e) {
            // Captura erros do Service (ex: Livro não encontrado, nota inválida)
            log.warn("Erro ao registrar avaliação para o livro '{}': {}", request.titulo(), e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            log.error("Erro interno ao registrar avaliação", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro interno: " + e.getMessage());
        }
    }
    @GetMapping("/media")
    public ResponseEntity<Double> obterMediaAvaliacao(@RequestParam String titulo){
        double media = avaliacaoLivroService.calcularMediaAvaliacao(titulo);
        return ResponseEntity.ok(media);
    }

    @GetMapping("/catalogo")
    public ResponseEntity<List<LivroAvaliacaoDTO>> catalogo(Authentication authentication) {
        String userEmail = authentication.getName();

        try {
            User user = userService.getUserEntityByEmail(userEmail);
            UUID idUsuario = user.getId();
            return ResponseEntity.ok(avaliacaoLivroService.listarCatalogo(idUsuario));

        } catch (UserNotFoundException e) {
            log.error("Erro de Autenticação: Usuário logado não encontrado no sistema. Email: {}", userEmail, e);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }
}
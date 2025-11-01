package com.biblioteca.backend.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.Optional;
import com.biblioteca.backend.entity.User;
import com.biblioteca.backend.service.UserService;
import com.biblioteca.backend.entity.AvaliacaoLivro;
import com.biblioteca.backend.service.AvaliacaoLivroService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import com.biblioteca.backend.dto.request.AvaliacaoRequest;
import jakarta.validation.Valid;
import java.util.UUID;

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

        try {
            String email = request.email();
            log.info("Tentando avaliação para email: {}", email);

            User user = userService.getUserByEmail(email);
            if (user == null) {
                log.warn("Usuário não encontrado para email: {}", email);
                return ResponseEntity.status(404).body("Usuário não encontrado: " + email);
            }

            log.info("Usuário encontrado: ID = {}", user.getId());

            AvaliacaoLivro avaliacao = avaliacaoLivroService.registrarAvaliacao(
                    user.getId(),
                    request.titulo(),
                    request.nota(),
                    request.comentario()
            );
            return ResponseEntity.ok(avaliacao);
        } catch (Exception e) {
            log.error("Erro ao registrar avaliação", e);
            return ResponseEntity.status(500).body("Erro interno: " + e.getMessage());
        }
    }
    @GetMapping("/media")
    public ResponseEntity<Double> obterMediaAvaliacao(@RequestParam String titulo){
        double media = avaliacaoLivroService.calcularMediaAvaliacao(titulo);
        return ResponseEntity.ok(media);
    }
}
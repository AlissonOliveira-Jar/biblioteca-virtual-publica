package com.biblioteca.backend.controller;

import com.biblioteca.backend.entity.User;
import com.biblioteca.backend.entity.Pontuacao;
import com.biblioteca.backend.request.RegistrarLeituraDTO;
import com.biblioteca.backend.response.PontuacaoResponseDTO;
import com.biblioteca.backend.service.GamificacaoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Optional;

@RestController
@RequestMapping("/api/gamificacao")

public class GamificacaoController {

    private final GamificacaoService gamificacaoService;
    private static final Logger log = LoggerFactory.getLogger(GamificacaoController.class);

    public GamificacaoController(GamificacaoService gamificacaoService) {
        this.gamificacaoService = gamificacaoService;
    }

    @GetMapping("/status")
    public ResponseEntity<PontuacaoResponseDTO> getStatusPontuacao(@AuthenticationPrincipal User user) {if (user == null) {
        log.warn("[GAMIFICACAO] Tentativa de acesso a /status sem usuário autenticado.");
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }
        PontuacaoResponseDTO pontuacao = gamificacaoService.buscarPontuacaoUser(user);
        return ResponseEntity.ok(pontuacao);
    }

    @PostMapping("/registrar-leitura")
    public ResponseEntity<?> registrarLeitura(@AuthenticationPrincipal User user, @RequestBody RegistrarLeituraDTO request) {
        if (user == null) {
            log.warn("[GAMIFICACAO] Tentativa de registro de leitura sem usuário autenticado.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        log.info(">>>> [GAMIFICACAO] Requisição recebida. Usuário ID: {}, Livro ID: {}, Página: {}",
                user.getId(), request.getIdLivro(), request.getPaginaLida());

        try {
            gamificacaoService.concederPontosPorLeitura(user, request);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("Erro ao processar leitura para gamificação: Usuário ID {}, Livro ID {}, Página {}",
                    user.getId(), request.getIdLivro(), request.getPaginaLida(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro interno ao processar leitura para gamificação.");
        }
    }
}



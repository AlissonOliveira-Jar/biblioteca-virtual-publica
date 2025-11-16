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

import java.util.Optional;

@RestController
@RequestMapping("/api/gamificacao")

public class GamificacaoController {

    private final GamificacaoService gamificacaoService;

    public GamificacaoController(GamificacaoService gamificacaoService) {
        this.gamificacaoService = gamificacaoService;
    }

    @GetMapping("/status")
    public ResponseEntity<PontuacaoResponseDTO> getStatusPontuacao(@AuthenticationPrincipal User user) {
        PontuacaoResponseDTO pontuacao = gamificacaoService.buscarPontuacaoUser(user);
        return ResponseEntity.ok(pontuacao);
    }

    @PostMapping("/leitura")
    public ResponseEntity<Pontuacao> registrarLeitura(@AuthenticationPrincipal User user, @RequestBody RegistrarLeituraDTO request){
        Pontuacao pontuacaoAtualizada = gamificacaoService.concederPontosPorLeitura(user, request);
        return ResponseEntity.ok(pontuacaoAtualizada);
    }
}


package com.biblioteca.backend.controller;

import com.biblioteca.backend.dto.response.RecomendacaoResponseDTO;
import com.biblioteca.backend.service.RecomendacaoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/recomendacao")
public class RecomendacaoController {
    private final RecomendacaoService recomendacaoService;

    public RecomendacaoController(RecomendacaoService recomendacaoService){
        this.recomendacaoService = recomendacaoService;
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<RecomendacaoResponseDTO>> getRecomendacoes(@PathVariable UUID userId){
        if(userId == null){
            return ResponseEntity.badRequest().build();
        }
        List<RecomendacaoResponseDTO> recomendacao = recomendacaoService.getRecomendacoes(userId);
        System.out.println("Retornando: " +recomendacao.size()+ "recomendações!");
        return ResponseEntity.ok(recomendacao);
    }
}
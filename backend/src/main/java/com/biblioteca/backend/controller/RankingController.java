package com.biblioteca.backend.controller;

import com.biblioteca.backend.dto.response.LivroRankingDTO;
import com.biblioteca.backend.dto.response.UserRankingDTO;
import com.biblioteca.backend.service.RankingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ranking")
@RequiredArgsConstructor

public class RankingController {

    private final RankingService rankingService;

    @GetMapping("/livros-ranking")
    public ResponseEntity<List<LivroRankingDTO>> getLivroRanking(@RequestParam(defaultValue = "10") int limit){
        List<LivroRankingDTO> ranking = rankingService.getLivroRanking(limit);
        return ResponseEntity.ok(ranking);
    }

    @GetMapping("/usuarios-ranking")
    public ResponseEntity<List<UserRankingDTO>> getUsuarioRanking(
            @RequestParam(defaultValue = "10") int limit) {

        List<UserRankingDTO> ranking = rankingService.getUsuarioRanking(limit);
        return ResponseEntity.ok(ranking);
    }
}
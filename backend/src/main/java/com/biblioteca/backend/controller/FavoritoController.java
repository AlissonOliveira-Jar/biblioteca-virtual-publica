package com.biblioteca.backend.controller;

import com.biblioteca.backend.dto.request.FavoritoRequestDTO;
import com.biblioteca.backend.dto.response.FavoritoResponseDTO;
import com.biblioteca.backend.service.FavoritoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/favoritos")
@RequiredArgsConstructor
public class FavoritoController {

    private final FavoritoService favoritoService;

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<FavoritoResponseDTO> adicionar(@RequestBody FavoritoRequestDTO dto) {
        FavoritoResponseDTO favorito = favoritoService.adicionarFavorito(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(favorito);
    }

    @DeleteMapping("/{livroId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> remover(@PathVariable UUID livroId) {
        favoritoService.removerFavorito(livroId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<FavoritoResponseDTO>> listar() {
        return ResponseEntity.ok(favoritoService.listarFavoritosDoUsuario());
    }
}

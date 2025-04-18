package com.biblioteca.backend.controller;

import com.biblioteca.backend.dto.request.ArtigoDTO;
import com.biblioteca.backend.service.ArtigoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/artigos")
@RequiredArgsConstructor
public class ArtigoController {

    private final ArtigoService artigoService;

    @PostMapping
    @PreAuthorize("hasRole('BIBLIOTECARIO')")
    public ResponseEntity<ArtigoDTO> createArtigo(@Valid @RequestBody ArtigoDTO artigoDTO) {
        ArtigoDTO createdArtigo = artigoService.createArtigo(artigoDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdArtigo);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('BIBLIOTECARIO', 'USER')")
    public ResponseEntity<ArtigoDTO> getArtigoById(@PathVariable UUID id) {
        ArtigoDTO artigo = artigoService.getArtigoById(id);
        return ResponseEntity.ok(artigo);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('BIBLIOTECARIO', 'USER')")
    public ResponseEntity<List<ArtigoDTO>> getAllArtigos() {
        List<ArtigoDTO> artigos = artigoService.getAllArtigos();
        return ResponseEntity.ok(artigos);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('BIBLIOTECARIO')")
    public ResponseEntity<ArtigoDTO> updateArtigo(@PathVariable UUID id, @Valid @RequestBody ArtigoDTO artigoDTO) {
        ArtigoDTO updatedArtigo = artigoService.updateArtigo(id, artigoDTO);
        return ResponseEntity.ok(updatedArtigo);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('BIBLIOTECARIO')")
    public ResponseEntity<Void> deleteArtigo(@PathVariable UUID id) {
        artigoService.deleteArtigo(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/titulo")
    @PreAuthorize("hasAnyRole('BIBLIOTECARIO', 'USER')")
    public ResponseEntity<List<ArtigoDTO>> findByTitulo(@RequestParam("q") String titulo) {
        List<ArtigoDTO> artigos = artigoService.findByTitulo(titulo);
        return ResponseEntity.ok(artigos);
    }

    @GetMapping("/autor/{autorId}")
    @PreAuthorize("hasAnyRole('BIBLIOTECARIO', 'USER')")
    public ResponseEntity<List<ArtigoDTO>> findByAutor(@PathVariable UUID autorId) {
        List<ArtigoDTO> artigos = artigoService.findByAutor(autorId);
        return ResponseEntity.ok(artigos);
    }

}

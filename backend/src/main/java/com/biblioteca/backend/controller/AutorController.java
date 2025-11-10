package com.biblioteca.backend.controller;

import com.biblioteca.backend.dto.request.AutorDTO;
import com.biblioteca.backend.entity.Artigo;
import com.biblioteca.backend.entity.Livro;
import com.biblioteca.backend.service.AutorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/autores")
@RequiredArgsConstructor
public class AutorController {

    private final AutorService autorService;

    @PostMapping
    @PreAuthorize("hasAnyRole('BIBLIOTECARIO', 'ADMIN')")
    public ResponseEntity<AutorDTO> createAutor(@Valid @RequestBody AutorDTO autorDTO) {
        AutorDTO createdAutor = autorService.createAutor(autorDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdAutor);
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<AutorDTO> getAutorById(@PathVariable UUID id) {
        AutorDTO autor = autorService.getAutorById(id);
        return ResponseEntity.ok(autor);
    }

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<AutorDTO>> getAllAutores() {
        List<AutorDTO> autores = autorService.getAllAutores();
        return ResponseEntity.ok(autores);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('BIBLIOTECARIO', 'ADMIN')")
    public ResponseEntity<AutorDTO> updateAutor(@PathVariable UUID id, @Valid @RequestBody AutorDTO autorDTO) {
        AutorDTO updatedAutor = autorService.updateAutor(id, autorDTO);
        return ResponseEntity.ok(updatedAutor);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('BIBLIOTECARIO', 'ADMIN')")
    public ResponseEntity<Void> deleteAutor(@PathVariable UUID id) {
        autorService.deleteAutor(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/livros")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Livro>> getLivrosByAutor(@PathVariable UUID id) {
        List<Livro> livros = autorService.getLivrosByAutor(id);
        return ResponseEntity.ok(livros);
    }

    @GetMapping("/{id}/artigos")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Artigo>> getArtigosByAutor(@PathVariable UUID id) {
        List<Artigo> artigos = autorService.getArtigosByAutor(id);
        return ResponseEntity.ok(artigos);
    }

}

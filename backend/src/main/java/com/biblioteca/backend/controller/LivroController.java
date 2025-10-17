package com.biblioteca.backend.controller;

import com.biblioteca.backend.dto.request.LivroDTO;
import com.biblioteca.backend.service.LivroService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/livros")
@RequiredArgsConstructor
public class LivroController {

    private final LivroService livroService;

    @PostMapping
    @PreAuthorize("hasRole('BIBLIOTECARIO')")
    public ResponseEntity<LivroDTO> createLivro(@Valid @RequestBody LivroDTO livroDTO) {
        LivroDTO createdLivro = livroService.createLivro(livroDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdLivro);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('BIBLIOTECARIO', 'USER')")
    public ResponseEntity<LivroDTO> getLivroById(@PathVariable UUID id) {
        LivroDTO livro = livroService.getLivroById(id);
        return ResponseEntity.ok(livro);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('BIBLIOTECARIO', 'USER')")
    public ResponseEntity<List<LivroDTO>> getAllLivros() {
        List<LivroDTO> livros = livroService.getAllLivros();
        return ResponseEntity.ok(livros);
    }

    @GetMapping("/titulo")
    @PreAuthorize("hasAnyRole('BIBLIOTECARIO', 'USER')")
    public ResponseEntity<List<LivroDTO>> findByTitulo(@RequestParam("q") String titulo) {
        List<LivroDTO> livros = livroService.findByTitulo(titulo);
        return ResponseEntity.ok(livros);
    }

    @GetMapping("/genero")
    @PreAuthorize("hasAnyRole('BIBLIOTECARIO', 'USER')")
    public ResponseEntity<List<LivroDTO>> findByGenero(@RequestParam("q") String genero) {
        List<LivroDTO> livros = livroService.findByGenero(genero);
        return ResponseEntity.ok(livros);
    }

    @GetMapping("/autor/{autorId}")
    @PreAuthorize("hasAnyRole('BIBLIOTECARIO', 'USER')")
    public ResponseEntity<List<LivroDTO>> findByAutor(@PathVariable UUID autorId) {
        List<LivroDTO> livros = livroService.findByAutor(autorId);
        return ResponseEntity.ok(livros);
    }

    @GetMapping("/editora/{editoraId}")
    @PreAuthorize("hasAnyRole('BIBLIOTECARIO', 'USER')")
    public ResponseEntity<List<LivroDTO>> findByEditora(@PathVariable UUID editoraId) {
        List<LivroDTO> livros = livroService.findByEditora(editoraId);
        return ResponseEntity.ok(livros);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('BIBLIOTECARIO')")
    public ResponseEntity<LivroDTO> updateLivro(@PathVariable UUID id, @Valid @RequestBody LivroDTO livroDTO) {
        LivroDTO updatedLivro = livroService.updateLivro(id, livroDTO);
        return ResponseEntity.ok(updatedLivro);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('BIBLIOTECARIO')")
    public ResponseEntity<Void> deleteLivro(@PathVariable UUID id) {
        livroService.deleteLivro(id);
        return ResponseEntity.noContent().build();
    }

}

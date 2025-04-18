package com.biblioteca.backend.controller;

import com.biblioteca.backend.dto.request.EditoraDTO;
import com.biblioteca.backend.entity.Livro;
import com.biblioteca.backend.service.EditoraService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/editoras")
@RequiredArgsConstructor
public class EditoraController {

    private final EditoraService editoraService;

    @PostMapping
    @PreAuthorize("hasRole('BIBLIOTECARIO')")
    public ResponseEntity<EditoraDTO> createEditora(@Valid @RequestBody EditoraDTO editoraDTO) {
        EditoraDTO createdEditora = editoraService.createEditora(editoraDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdEditora);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('BIBLIOTECARIO')")
    public ResponseEntity<EditoraDTO> getEditoraById(@PathVariable UUID id) {
        EditoraDTO editora = editoraService.getEditoraById(id);
        return ResponseEntity.ok(editora);
    }

    @GetMapping
    @PreAuthorize("hasRole('BIBLIOTECARIO', 'USER')")
    public ResponseEntity<List<EditoraDTO>> getAllEditoras(@RequestParam(value = "nome", required = false) String nome) {
        List<EditoraDTO> editoras;
        if (nome != null && !nome.trim().isEmpty()) {
            editoras = editoraService.findByName(nome.trim());
        } else {
            editoras = editoraService.getAllEditoras();
        }
        return ResponseEntity.ok(editoras);
    }

    @GetMapping("/{id}/livros")
    @PreAuthorize("hasRole('BIBLIOTECARIO')")
    public ResponseEntity<List<Livro>> getLivrosByEditora(@PathVariable UUID id) {
        List<Livro> livros = editoraService.getLivrosByEditora(id);
        return ResponseEntity.ok(livros);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('BIBLIOTECARIO')")
    public ResponseEntity<EditoraDTO> updateEditora(@PathVariable UUID id, @Valid @RequestBody EditoraDTO editoraDTO) {
        EditoraDTO updatedEditora = editoraService.updateEditora(id, editoraDTO);
        return ResponseEntity.ok(updatedEditora);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('BIBLIOTECARIO')")
    public ResponseEntity<Void> deleteEditora(@PathVariable UUID id) {
        editoraService.deleteEditora(id);
        return ResponseEntity.noContent().build();
    }

}

package com.biblioteca.backend.controller;

import com.biblioteca.backend.dto.request.LivroDTO;
import com.biblioteca.backend.service.LivroService;
import com.biblioteca.backend.service.DownloadDriveService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ByteArrayResource;
import com.biblioteca.backend.exception.LivroNotFoundException;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/livros")
@RequiredArgsConstructor
@Slf4j
public class LivroController {

    private final LivroService livroService;
    private final DownloadDriveService downloadDriveService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'BIBLIOTECARIO')")
    public ResponseEntity<LivroDTO> createLivro(@Valid @RequestBody LivroDTO livroDTO) {
        LivroDTO createdLivro = livroService.createLivro(livroDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdLivro);
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<LivroDTO> getLivroById(@PathVariable UUID id) {
        LivroDTO livro = livroService.getLivroById(id);
        return ResponseEntity.ok(livro);
    }

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<LivroDTO>> getAllLivros() {
        List<LivroDTO> livros = livroService.getAllLivros();
        return ResponseEntity.ok(livros);
    }

    @GetMapping("/titulo")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<LivroDTO>> findByTitulo(@RequestParam("q") String titulo) {
        List<LivroDTO> livros = livroService.findByTitulo(titulo);
        return ResponseEntity.ok(livros);
    }

    @GetMapping("/genero")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<LivroDTO>> findByGenero(@RequestParam("q") String genero) {
        List<LivroDTO> livros = livroService.findByGenero(genero);
        return ResponseEntity.ok(livros);
    }

    @GetMapping("/autor/{autorId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<LivroDTO>> findByAutor(@PathVariable UUID autorId) {
        List<LivroDTO> livros = livroService.findByAutor(autorId);
        return ResponseEntity.ok(livros);
    }

    @GetMapping("/editora/{editoraId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<LivroDTO>> findByEditora(@PathVariable UUID editoraId) {
        List<LivroDTO> livros = livroService.findByEditora(editoraId);
        return ResponseEntity.ok(livros);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'BIBLIOTECARIO')")
    public ResponseEntity<LivroDTO> updateLivro(@PathVariable UUID id, @Valid @RequestBody LivroDTO livroDTO) {
        LivroDTO updatedLivro = livroService.updateLivro(id, livroDTO);
        return ResponseEntity.ok(updatedLivro);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'BIBLIOTECARIO')")
    public ResponseEntity<Void> deleteLivro(@PathVariable UUID id) {
        livroService.deleteLivro(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/visualizar")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Resource> getLivroPdf(@PathVariable UUID id) {
        try {
            LivroDTO livro = livroService.getLivroById(id);
            
            String googleDriveFileId = livro.googleDriveFileId();
            if (googleDriveFileId == null || googleDriveFileId.isBlank()) {
                log.warn("Tentativa de visualizar livro sem googleDriveFileId. Livro ID: {}", id);
                return ResponseEntity.notFound().build();
            }

            byte[] pdfBytes = downloadDriveService.baixarArquivo(googleDriveFileId);

            if (pdfBytes == null || pdfBytes.length == 0) {
                if (pdfBytes == null) {
                    log.error("Falha no download do Drive (retornou null) para o fileId: {}", googleDriveFileId);
                } else {
                    log.error("Falha no download do Drive (retornou 0 bytes) para o fileId: {}", googleDriveFileId);
                }
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                     .body(null); 
            }

            ByteArrayResource resource = new ByteArrayResource(pdfBytes);

            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_PDF)
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + livro.titulo() + ".pdf\"") 
                    .body(resource);

        } catch (LivroNotFoundException e) {
             log.warn("Tentativa de visualizar um livro que não foi encontrado. ID: {}", id);
             return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
             log.error("Erro inesperado ao tentar visualizar o livro ID: {}", id, e);
             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}

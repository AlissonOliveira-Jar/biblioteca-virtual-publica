package com.biblioteca.backend.controller;

import com.biblioteca.backend.dto.request.LivroDTO;
import com.biblioteca.backend.service.LivroService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/livros")
@RequiredArgsConstructor
@Tag(name = "Livros", description = "Gerenciamento de Livros")
public class LivroController {

    private final LivroService livroService;

    @PostMapping
    @PreAuthorize("hasRole('BIBLIOTECARIO')")
    @Operation(
            summary = "Criar novo livro",
            description = "Cria um novo registo de livro no sistema. Requer autenticação com papel BIBLIOTECARIO.",
            security = @SecurityRequirement(name = "bearerAuth"),
            responses = {
                    @ApiResponse(responseCode = "201", description = "Livro criado com sucesso",
                            content = @Content(schema = @Schema(implementation = LivroDTO.class))),
                    @ApiResponse(responseCode = "400", description = "Dados inválidos ou ID(s) referenciado(s) não encontrado(s)"),
                    @ApiResponse(responseCode = "401", description = "Não autenticado"),
                    @ApiResponse(responseCode = "403", description = "Sem permissão (não é BIBLIOTECARIO)")
            }
    )
    public ResponseEntity<LivroDTO> createLivro(@Valid @RequestBody(description = "Dados do livro para criação", required = true) LivroDTO livroDTO) {
        LivroDTO createdLivro = livroService.createLivro(livroDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdLivro);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('BIBLIOTECARIO', 'USER')")
    @Operation(
            summary = "Obter livro por ID",
            description = "Retorna os dados de um livro específico pelo seu ID. Requer autenticação com papel BIBLIOTECARIO ou USER.",
            security = @SecurityRequirement(name = "bearerAuth"),
            responses = {
                    @ApiResponse(responseCode = "200", description = "Livro encontrado e retornado com sucesso",
                            content = @Content(schema = @Schema(implementation = LivroDTO.class))),
                    @ApiResponse(responseCode = "401", description = "Não autenticado"),
                    @ApiResponse(responseCode = "403", description = "Sem permissão (não tem papel BIBLIOTECARIO ou USER)"),
                    @ApiResponse(responseCode = "404", description = "Livro não encontrado")
            }
    )
    public ResponseEntity<LivroDTO> getLivroById(@Parameter(description = "ID do livro (UUID)", example = "f5a4b3c2-d1e0-9876-5432-10fedcba9876") @PathVariable UUID id) {
        LivroDTO livro = livroService.getLivroById(id);
        return ResponseEntity.ok(livro);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('BIBLIOTECARIO', 'USER')")
    @Operation(
            summary = "Obter todos os livros",
            description = "Retorna uma lista de todos os livros registados no sistema. Requer autenticação com papel BIBLIOTECARIO ou USER.",
            security = @SecurityRequirement(name = "bearerAuth"),
            responses = {
                    @ApiResponse(responseCode = "200", description = "Lista de livros retornada com sucesso",
                            content = @Content(schema = @Schema(implementation = List.class, subTypes = {LivroDTO.class}))),
                    @ApiResponse(responseCode = "401", description = "Não autenticado"),
                    @ApiResponse(responseCode = "403", description = "Sem permissão (não tem papel BIBLIOTECARIO ou USER)")
            }
    )
    public ResponseEntity<List<LivroDTO>> getAllLivros() {
        List<LivroDTO> livros = livroService.getAllLivros();
        return ResponseEntity.ok(livros);
    }

    @GetMapping("/titulo")
    @PreAuthorize("hasAnyRole('BIBLIOTECARIO', 'USER')")
    @Operation(
            summary = "Buscar livros por título",
            description = "Retorna uma lista de livros cujos títulos contêm o termo de busca (case-insensitive). Requer autenticação com papel BIBLIOTECARIO ou USER.",
            security = @SecurityRequirement(name = "bearerAuth"),
            responses = {
                    @ApiResponse(responseCode = "200", description = "Lista de livros encontrados",
                            content = @Content(schema = @Schema(implementation = List.class, subTypes = {LivroDTO.class}))),
                    @ApiResponse(responseCode = "401", description = "Não autenticado"),
                    @ApiResponse(responseCode = "403", description = "Sem permissão (não tem papel BIBLIOTECARIO ou USER)")
            }
    )
    public ResponseEntity<List<LivroDTO>> findByTitulo(@Parameter(description = "Termo de busca para o título do livro") @RequestParam("q") String titulo) {
        List<LivroDTO> livros = livroService.findByTitulo(titulo);
        return ResponseEntity.ok(livros);
    }

    @GetMapping("/genero")
    @PreAuthorize("hasAnyRole('BIBLIOTECARIO', 'USER')")
    @Operation(
            summary = "Buscar livros por gênero",
            description = "Retorna uma lista de livros de um gênero específico (case-insensitive). Requer autenticação com papel BIBLIOTECARIO ou USER.",
            security = @SecurityRequirement(name = "bearerAuth"),
            responses = {
                    @ApiResponse(responseCode = "200", description = "Lista de livros encontrados",
                            content = @Content(schema = @Schema(implementation = List.class, subTypes = {LivroDTO.class}))),
                    @ApiResponse(responseCode = "401", description = "Não autenticado"),
                    @ApiResponse(responseCode = "403", description = "Sem permissão (não tem papel BIBLIOTECARIO ou USER)")
            }
    )
    public ResponseEntity<List<LivroDTO>> findByGenero(@Parameter(description = "Nome do gênero do livro") @RequestParam("q") String genero) {
        List<LivroDTO> livros = livroService.findByGenero(genero);
        return ResponseEntity.ok(livros);
    }

    @GetMapping("/autor/{autorId}")
    @PreAuthorize("hasAnyRole('BIBLIOTECARIO', 'USER')")
    @Operation(
            summary = "Buscar livros por autor",
            description = "Retorna uma lista de livros escritos por um autor específico. Requer autenticação com papel BIBLIOTECARIO ou USER.",
            security = @SecurityRequirement(name = "bearerAuth"),
            responses = {
                    @ApiResponse(responseCode = "200", description = "Lista de livros encontrados",
                            content = @Content(schema = @Schema(implementation = List.class, subTypes = {LivroDTO.class}))),
                    @ApiResponse(responseCode = "401", description = "Não autenticado"),
                    @ApiResponse(responseCode = "403", description = "Sem permissão (não tem papel BIBLIOTECARIO ou USER)"),
                    @ApiResponse(responseCode = "404", description = "Autor não encontrado")
            }
    )
    public ResponseEntity<List<LivroDTO>> findByAutor(@Parameter(description = "ID do autor (UUID)", example = "a1b2c3d4-e5f6-7890-1234-567890abcdef") @PathVariable UUID autorId) {
        List<LivroDTO> livros = livroService.findByAutor(autorId);
        return ResponseEntity.ok(livros);
    }

    @GetMapping("/editora/{editoraId}")
    @PreAuthorize("hasAnyRole('BIBLIOTECARIO', 'USER')")
    @Operation(
            summary = "Buscar livros por editora",
            description = "Retorna uma lista de livros publicados por uma editora específica. Requer autenticação com papel BIBLIOTECARIO ou USER.",
            security = @SecurityRequirement(name = "bearerAuth"),
            responses = {
                    @ApiResponse(responseCode = "200", description = "Lista de livros encontrados",
                            content = @Content(schema = @Schema(implementation = List.class, subTypes = {LivroDTO.class}))),
                    @ApiResponse(responseCode = "401", description = "Não autenticado"),
                    @ApiResponse(responseCode = "403", description = "Sem permissão (não tem papel BIBLIOTECARIO ou USER)"),
                    @ApiResponse(responseCode = "404", description = "Editora não encontrada")
            }
    )
    public ResponseEntity<List<LivroDTO>> findByEditora(@Parameter(description = "ID da editora (UUID)", example = "f5a4b3c2-d1e0-9876-5432-10fedcba9876") @PathVariable UUID editoraId) {
        List<LivroDTO> livros = livroService.findByEditora(editoraId);
        return ResponseEntity.ok(livros);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('BIBLIOTECARIO')")
    @Operation(
            summary = "Atualizar livro por ID",
            description = "Atualiza os dados de um livro específico pelo seu ID. Requer autenticação com papel BIBLIOTECARIO.",
            security = @SecurityRequirement(name = "bearerAuth"),
            responses = {
                    @ApiResponse(responseCode = "200", description = "Livro atualizado com sucesso",
                            content = @Content(schema = @Schema(implementation = LivroDTO.class))),
                    @ApiResponse(responseCode = "400", description = "Dados inválidos ou ID(s) referenciado(s) não encontrado(s)"),
                    @ApiResponse(responseCode = "401", description = "Não autenticado"),
                    @ApiResponse(responseCode = "403", description = "Sem permissão (não é BIBLIOTECARIO)"),
                    @ApiResponse(responseCode = "404", description = "Livro não encontrado")
            }
    )
    public ResponseEntity<LivroDTO> updateLivro(@Parameter(description = "ID do livro (UUID)", example = "f5a4b3c2-d1e0-9876-5432-10fedcba9876") @PathVariable UUID id, @Valid @RequestBody(description = "Dados do livro para atualização", required = true) LivroDTO livroDTO) {
        LivroDTO updatedLivro = livroService.updateLivro(id, livroDTO);
        return ResponseEntity.ok(updatedLivro);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('BIBLIOTECARIO')")
    @Operation(
            summary = "Excluir livro por ID",
            description = "Exclui um livro específico pelo seu ID. Requer autenticação com papel BIBLIOTECARIO.",
            security = @SecurityRequirement(name = "bearerAuth"),
            responses = {
                    @ApiResponse(responseCode = "204", description = "Livro excluído com sucesso"),
                    @ApiResponse(responseCode = "401", description = "Não autenticado"),
                    @ApiResponse(responseCode = "403", description = "Sem permissão (não é BIBLIOTECARIO)"),
                    @ApiResponse(responseCode = "404", description = "Livro não encontrado")
            }
    )
    public ResponseEntity<Void> deleteLivro(@Parameter(description = "ID do livro (UUID)", example = "f5a4b3c2-d1e0-9876-5432-10fedcba9876") @PathVariable UUID id) {
        livroService.deleteLivro(id);
        return ResponseEntity.noContent().build();
    }
}

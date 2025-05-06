package com.biblioteca.backend.controller;

import com.biblioteca.backend.dto.request.AutorDTO;
import com.biblioteca.backend.entity.Artigo;
import com.biblioteca.backend.entity.Livro;
import com.biblioteca.backend.service.AutorService;
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
@RequestMapping("/api/autores")
@RequiredArgsConstructor
@PreAuthorize("hasRole('BIBLIOTECARIO')")
@Tag(name = "Autores", description = "Gerenciamento de Autores")
public class AutorController {

    private final AutorService autorService;

    @PostMapping
    @Operation(
            summary = "Criar novo autor",
            description = "Cria um novo registo de autor no sistema. Requer autenticação com papel BIBLIOTECARIO.",
            security = @SecurityRequirement(name = "bearerAuth"),
            responses = {
                    @ApiResponse(responseCode = "201", description = "Autor criado com sucesso",
                            content = @Content(schema = @Schema(implementation = AutorDTO.class))),
                    @ApiResponse(responseCode = "400", description = "Dados inválidos"),
                    @ApiResponse(responseCode = "401", description = "Não autenticado"),
                    @ApiResponse(responseCode = "403", description = "Sem permissão (não é BIBLIOTECARIO)")
            }
    )
    public ResponseEntity<AutorDTO> createAutor(@Valid @RequestBody(description = "Dados do autor para criação", required = true) AutorDTO autorDTO) {
        AutorDTO createdAutor = autorService.createAutor(autorDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdAutor);
    }

    @GetMapping("/{id}")
    @Operation(
            summary = "Obter autor por ID",
            description = "Retorna os dados de um autor específico pelo seu ID. Requer autenticação com papel BIBLIOTECARIO.",
            security = @SecurityRequirement(name = "bearerAuth"),
            responses = {
                    @ApiResponse(responseCode = "200", description = "Autor encontrado e retornado com sucesso",
                            content = @Content(schema = @Schema(implementation = AutorDTO.class))),
                    @ApiResponse(responseCode = "401", description = "Não autenticado"),
                    @ApiResponse(responseCode = "403", description = "Sem permissão (não é BIBLIOTECARIO)"),
                    @ApiResponse(responseCode = "404", description = "Autor não encontrado")
            }
    )
    public ResponseEntity<AutorDTO> getAutorById(@Parameter(description = "ID do autor (UUID)", example = "a1b2c3d4-e5f6-7890-1234-567890abcdef") @PathVariable UUID id) {
        AutorDTO autor = autorService.getAutorById(id);
        return ResponseEntity.ok(autor);
    }

    @GetMapping
    @Operation(
            summary = "Obter todos os autores",
            description = "Retorna uma lista de todos os autores registados. Requer autenticação com papel BIBLIOTECARIO.",
            security = @SecurityRequirement(name = "bearerAuth"),
            responses = {
                    @ApiResponse(responseCode = "200", description = "Lista de autores retornada com sucesso",
                            content = @Content(schema = @Schema(implementation = List.class, subTypes = {AutorDTO.class}))),
                    @ApiResponse(responseCode = "401", description = "Não autenticado"),
                    @ApiResponse(responseCode = "403", description = "Sem permissão (não é BIBLIOTECARIO)")
            }
    )
    public ResponseEntity<List<AutorDTO>> getAllAutores() {
        List<AutorDTO> autores = autorService.getAllAutores();
        return ResponseEntity.ok(autores);
    }

    @PutMapping("/{id}")
    @Operation(
            summary = "Atualizar autor por ID",
            description = "Atualiza os dados de um autor específico pelo seu ID. Requer autenticação com papel BIBLIOTECARIO.",
            security = @SecurityRequirement(name = "bearerAuth"),
            responses = {
                    @ApiResponse(responseCode = "200", description = "Autor atualizado com sucesso",
                            content = @Content(schema = @Schema(implementation = AutorDTO.class))),
                    @ApiResponse(responseCode = "400", description = "Dados inválidos"),
                    @ApiResponse(responseCode = "401", description = "Não autenticado"),
                    @ApiResponse(responseCode = "403", description = "Sem permissão (não é BIBLIOTECARIO)"),
                    @ApiResponse(responseCode = "404", description = "Autor não encontrado")
            }
    )
    public ResponseEntity<AutorDTO> updateAutor(@Parameter(description = "ID do autor (UUID)", example = "a1b2c3d4-e5f6-7890-1234-567890abcdef") @PathVariable UUID id, @Valid @RequestBody(description = "Dados do autor para atualização", required = true) AutorDTO autorDTO) {
        AutorDTO updatedAutor = autorService.updateAutor(id, autorDTO);
        return ResponseEntity.ok(updatedAutor);
    }

    @DeleteMapping("/{id}")
    @Operation(
            summary = "Excluir autor por ID",
            description = "Exclui um autor específico pelo seu ID. Requer autenticação com papel BIBLIOTECARIO.",
            security = @SecurityRequirement(name = "bearerAuth"),
            responses = {
                    @ApiResponse(responseCode = "204", description = "Autor excluído com sucesso"),
                    @ApiResponse(responseCode = "401", description = "Não autenticado"),
                    @ApiResponse(responseCode = "403", description = "Sem permissão (não é BIBLIOTECARIO)"),
                    @ApiResponse(responseCode = "404", description = "Autor não encontrado")
            }
    )
    public ResponseEntity<Void> deleteAutor(@Parameter(description = "ID do autor (UUID)", example = "a1b2c3d4-e5f6-7890-1234-567890abcdef") @PathVariable UUID id) {
        autorService.deleteAutor(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/livros")
    @Operation(
            summary = "Obter livros por autor",
            description = "Retorna uma lista de todos os livros escritos por um autor específico. Requer autenticação com papel BIBLIOTECARIO.",
            security = @SecurityRequirement(name = "bearerAuth"),
            responses = {
                    @ApiResponse(responseCode = "200", description = "Lista de livros retornada com sucesso",
                            content = @Content(schema = @Schema(implementation = List.class, subTypes = {Livro.class}))),
                    @ApiResponse(responseCode = "401", description = "Não autenticado"),
                    @ApiResponse(responseCode = "403", description = "Sem permissão (não é BIBLIOTECARIO)"),
                    @ApiResponse(responseCode = "404", description = "Autor não encontrado")
            }
    )
    public ResponseEntity<List<Livro>> getLivrosByAutor(@Parameter(description = "ID do autor (UUID)", example = "a1b2c3d4-e5f6-7890-1234-567890abcdef") @PathVariable UUID id) {
        List<Livro> livros = autorService.getLivrosByAutor(id);
        return ResponseEntity.ok(livros);
    }

    @GetMapping("/{id}/artigos")
    @Operation(
            summary = "Obter artigos por autor",
            description = "Retorna uma lista de todos os artigos escritos por um autor específico. Requer autenticação com papel BIBLIOTECARIO.",
            security = @SecurityRequirement(name = "bearerAuth"),
            responses = {
                    @ApiResponse(responseCode = "200", description = "Lista de artigos retornada com sucesso",
                            content = @Content(schema = @Schema(implementation = List.class, subTypes = {Artigo.class}))),
                    @ApiResponse(responseCode = "401", description = "Não autenticado"),
                    @ApiResponse(responseCode = "403", description = "Sem permissão (não é BIBLIOTECARIO)"),
                    @ApiResponse(responseCode = "404", description = "Autor não encontrado")
            }
    )
    public ResponseEntity<List<Artigo>> getArtigosByAutor(@Parameter(description = "ID do autor (UUID)", example = "a1b2c3d4-e5f6-7890-1234-567890abcdef") @PathVariable UUID id) {
        List<Artigo> artigos = autorService.getArtigosByAutor(id);
        return ResponseEntity.ok(artigos);
    }
}

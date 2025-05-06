package com.biblioteca.backend.controller;

import com.biblioteca.backend.dto.request.EditoraDTO;
import com.biblioteca.backend.entity.Livro;
import com.biblioteca.backend.service.EditoraService;
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
@RequestMapping("/api/editoras")
@RequiredArgsConstructor
@Tag(name = "Editoras", description = "Gerenciamento de Editoras")
public class EditoraController {

    private final EditoraService editoraService;

    @PostMapping
    @PreAuthorize("hasRole('BIBLIOTECARIO')")
    @Operation(
            summary = "Criar nova editora",
            description = "Cria um novo registo de editora no sistema. Requer autenticação com papel BIBLIOTECARIO.",
            security = @SecurityRequirement(name = "bearerAuth"),
            responses = {
                    @ApiResponse(responseCode = "201", description = "Editora criada com sucesso",
                            content = @Content(schema = @Schema(implementation = EditoraDTO.class))),
                    @ApiResponse(responseCode = "400", description = "Dados inválidos"), // Validação DTO
                    @ApiResponse(responseCode = "401", description = "Não autenticado"),
                    @ApiResponse(responseCode = "403", description = "Sem permissão (não é BIBLIOTECARIO)")
            }
    )
    public ResponseEntity<EditoraDTO> createEditora(@Valid @RequestBody(description = "Dados da editora para criação", required = true) EditoraDTO editoraDTO) {
        EditoraDTO createdEditora = editoraService.createEditora(editoraDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdEditora);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('BIBLIOTECARIO')")
    @Operation(
            summary = "Obter editora por ID",
            description = "Retorna os dados de uma editora específica pelo seu ID. Requer autenticação com papel BIBLIOTECARIO.",
            security = @SecurityRequirement(name = "bearerAuth"),
            responses = {
                    @ApiResponse(responseCode = "200", description = "Editora encontrada e retornada com sucesso",
                            content = @Content(schema = @Schema(implementation = EditoraDTO.class))),
                    @ApiResponse(responseCode = "401", description = "Não autenticado"),
                    @ApiResponse(responseCode = "403", description = "Sem permissão (não é BIBLIOTECARIO)"),
                    @ApiResponse(responseCode = "404", description = "Editora não encontrada") // Assumindo EditoraNotFoundException resulta em 404
            }
    )
    public ResponseEntity<EditoraDTO> getEditoraById(@Parameter(description = "ID da editora (UUID)", example = "f5a4b3c2-d1e0-9876-5432-10fedcba9876") @PathVariable UUID id) {
        EditoraDTO editora = editoraService.getEditoraById(id);
        return ResponseEntity.ok(editora);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('BIBLIOTECARIO', 'USER')")
    @Operation(
            summary = "Obter todas as editoras ou buscar por nome",
            description = "Retorna uma lista de todas as editoras registadas. Pode opcionalmente buscar por editoras cujo nome contenha o termo de busca ('nome' query parameter). Requer autenticação com papel BIBLIOTECARIO ou USER.",
            security = @SecurityRequirement(name = "bearerAuth"),
            responses = {
                    @ApiResponse(responseCode = "200", description = "Lista de editoras retornada com sucesso",
                            content = @Content(schema = @Schema(implementation = List.class, subTypes = {EditoraDTO.class}))),
                    @ApiResponse(responseCode = "401", description = "Não autenticado"),
                    @ApiResponse(responseCode = "403", description = "Sem permissão (não tem papel BIBLIOTECARIO ou USER)"),
                    @ApiResponse(responseCode = "404", description = "Nenhuma editora encontrada com o nome fornecido") // Assumindo EditoraNotFoundException na busca por nome resulta em 404
            }
    )
    public ResponseEntity<List<EditoraDTO>> getAllEditoras(@Parameter(description = "Opcional: Termo de busca para filtrar editoras por nome") @RequestParam(value = "nome", required = false) String nome) {
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
    @Operation(
            summary = "Obter livros por editora",
            description = "Retorna uma lista de todos os livros publicados por uma editora específica pelo seu ID. Requer autenticação com papel BIBLIOTECARIO.",
            security = @SecurityRequirement(name = "bearerAuth"),
            responses = {
                    @ApiResponse(responseCode = "200", description = "Lista de livros retornada com sucesso",
                            content = @Content(schema = @Schema(implementation = List.class, subTypes = {Livro.class}))), // Nota: Retorna lista de Entidades Livro
                    @ApiResponse(responseCode = "401", description = "Não autenticado"),
                    @ApiResponse(responseCode = "403", description = "Sem permissão (não é BIBLIOTECARIO)"),
                    @ApiResponse(responseCode = "404", description = "Editora não encontrada") // Assumindo EditoraNotFoundException resulta em 404
            }
    )
    public ResponseEntity<List<Livro>> getLivrosByEditora(@Parameter(description = "ID da editora (UUID)", example = "f5a4b3c2-d1e0-9876-5432-10fedcba9876") @PathVariable UUID id) {
        List<Livro> livros = editoraService.getLivrosByEditora(id);
        return ResponseEntity.ok(livros);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('BIBLIOTECARIO')")
    @Operation(
            summary = "Atualizar editora por ID",
            description = "Atualiza os dados de uma editora específica pelo seu ID. Requer autenticação com papel BIBLIOTECARIO.",
            security = @SecurityRequirement(name = "bearerAuth"),
            responses = {
                    @ApiResponse(responseCode = "200", description = "Editora atualizada com sucesso",
                            content = @Content(schema = @Schema(implementation = EditoraDTO.class))),
                    @ApiResponse(responseCode = "400", description = "Dados inválidos"), // Validação DTO
                    @ApiResponse(responseCode = "401", description = "Não autenticado"),
                    @ApiResponse(responseCode = "403", description = "Sem permissão (não é BIBLIOTECARIO)"),
                    @ApiResponse(responseCode = "404", description = "Editora não encontrada") // Assumindo EditoraNotFoundException resulta em 404
            }
    )
    public ResponseEntity<EditoraDTO> updateEditora(@Parameter(description = "ID da editora (UUID)", example = "f5a4b3c2-d1e0-9876-5432-10fedcba9876") @PathVariable UUID id, @Valid @RequestBody(description = "Dados da editora para atualização", required = true) EditoraDTO editoraDTO) {
        EditoraDTO updatedEditora = editoraService.updateEditora(id, editoraDTO);
        return ResponseEntity.ok(updatedEditora);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('BIBLIOTECARIO')")
    @Operation(
            summary = "Excluir editora por ID",
            description = "Exclui uma editora específica pelo seu ID. Requer autenticação com papel BIBLIOTECARIO.",
            security = @SecurityRequirement(name = "bearerAuth"),
            responses = {
                    @ApiResponse(responseCode = "204", description = "Editora excluída com sucesso"),
                    @ApiResponse(responseCode = "401", description = "Não autenticado"),
                    @ApiResponse(responseCode = "403", description = "Sem permissão (não é BIBLIOTECARIO)"),
                    @ApiResponse(responseCode = "404", description = "Editora não encontrada") // Assumindo EditoraNotFoundException resulta em 404
            }
    )
    public ResponseEntity<Void> deleteEditora(@Parameter(description = "ID da editora (UUID)", example = "f5a4b3c2-d1e0-9876-5432-10fedcba9876") @PathVariable UUID id) {
        editoraService.deleteEditora(id);
        return ResponseEntity.noContent().build();
    }
}

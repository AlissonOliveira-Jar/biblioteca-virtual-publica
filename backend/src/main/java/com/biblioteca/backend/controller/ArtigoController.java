package com.biblioteca.backend.controller;

import com.biblioteca.backend.dto.request.ArtigoDTO;
import com.biblioteca.backend.service.ArtigoService;
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
@RequestMapping("/api/artigos")
@RequiredArgsConstructor
@Tag(name = "Artigos", description = "Gerenciamento de Artigos")
public class ArtigoController {

    private final ArtigoService artigoService;

    @PostMapping
    @PreAuthorize("hasRole('BIBLIOTECARIO')")
    @Operation(
            summary = "Criar novo artigo",
            description = "Cria um novo registo de artigo no sistema. Requer autenticação com papel BIBLIOTECARIO.",
            security = @SecurityRequirement(name = "bearerAuth"),
            responses = {
                    @ApiResponse(responseCode = "201", description = "Artigo criado com sucesso",
                            content = @Content(schema = @Schema(implementation = ArtigoDTO.class))),
                    @ApiResponse(responseCode = "400", description = "Dados inválidos ou ID(s) de autor(es) referenciado(s) não encontrado(s)"),
                    @ApiResponse(responseCode = "401", description = "Não autenticado"),
                    @ApiResponse(responseCode = "403", description = "Sem permissão (não é BIBLIOTECARIO)")
            }
    )
    public ResponseEntity<ArtigoDTO> createArtigo(@Valid @RequestBody(description = "Dados do artigo para criação", required = true) ArtigoDTO artigoDTO) {
        ArtigoDTO createdArtigo = artigoService.createArtigo(artigoDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdArtigo);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('BIBLIOTECARIO', 'USER')")
    @Operation(
            summary = "Obter artigo por ID",
            description = "Retorna os dados de um artigo específico pelo seu ID. Requer autenticação com papel BIBLIOTECARIO ou USER.",
            security = @SecurityRequirement(name = "bearerAuth"),
            responses = {
                    @ApiResponse(responseCode = "200", description = "Artigo encontrado e retornado com sucesso",
                            content = @Content(schema = @Schema(implementation = ArtigoDTO.class))),
                    @ApiResponse(responseCode = "401", description = "Não autenticado"),
                    @ApiResponse(responseCode = "403", description = "Sem permissão (não tem papel BIBLIOTECARIO ou USER)"),
                    @ApiResponse(responseCode = "404", description = "Artigo não encontrado")
            }
    )
    public ResponseEntity<ArtigoDTO> getArtigoById(@Parameter(description = "ID do artigo (UUID)", example = "a1b2c3d4-e5f6-7890-1234-567890abcdef") @PathVariable UUID id) {
        ArtigoDTO artigo = artigoService.getArtigoById(id);
        return ResponseEntity.ok(artigo);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('BIBLIOTECARIO', 'USER')")
    @Operation(
            summary = "Obter todos os artigos",
            description = "Retorna uma lista de todos os artigos registados no sistema. Requer autenticação com papel BIBLIOTECARIO ou USER.",
            security = @SecurityRequirement(name = "bearerAuth"),
            responses = {
                    @ApiResponse(responseCode = "200", description = "Lista de artigos retornada com sucesso",
                            content = @Content(schema = @Schema(implementation = List.class, subTypes = {ArtigoDTO.class}))),
                    @ApiResponse(responseCode = "401", description = "Não autenticado"),
                    @ApiResponse(responseCode = "403", description = "Sem permissão (não tem papel BIBLIOTECARIO ou USER)")
            }
    )
    public ResponseEntity<List<ArtigoDTO>> getAllArtigos() {
        List<ArtigoDTO> artigos = artigoService.getAllArtigos();
        return ResponseEntity.ok(artigos);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('BIBLIOTECARIO')")
    @Operation(
            summary = "Atualizar artigo por ID",
            description = "Atualiza os dados de um artigo específico pelo seu ID. Requer autenticação com papel BIBLIOTECARIO.",
            security = @SecurityRequirement(name = "bearerAuth"),
            responses = {
                    @ApiResponse(responseCode = "200", description = "Artigo atualizado com sucesso",
                            content = @Content(schema = @Schema(implementation = ArtigoDTO.class))),
                    @ApiResponse(responseCode = "400", description = "Dados inválidos ou ID(s) de autor(es) referenciado(s) não encontrado(s)"),
                    @ApiResponse(responseCode = "401", description = "Não autenticado"),
                    @ApiResponse(responseCode = "403", description = "Sem permissão (não é BIBLIOTECARIO)"),
                    @ApiResponse(responseCode = "404", description = "Artigo não encontrado")
            }
    )
    public ResponseEntity<ArtigoDTO> updateArtigo(@Parameter(description = "ID do artigo (UUID)", example = "a1b2c3d4-e5f6-7890-1234-567890abcdef") @PathVariable UUID id, @Valid @RequestBody(description = "Dados do artigo para atualização", required = true) ArtigoDTO artigoDTO) {
        ArtigoDTO updatedArtigo = artigoService.updateArtigo(id, artigoDTO);
        return ResponseEntity.ok(updatedArtigo);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('BIBLIOTECARIO')")
    @Operation(
            summary = "Excluir artigo por ID",
            description = "Exclui um artigo específico pelo seu ID. Requer autenticação com papel BIBLIOTECARIO.",
            security = @SecurityRequirement(name = "bearerAuth"),
            responses = {
                    @ApiResponse(responseCode = "204", description = "Artigo excluído com sucesso"),
                    @ApiResponse(responseCode = "401", description = "Não autenticado"),
                    @ApiResponse(responseCode = "403", description = "Sem permissão (não é BIBLIOTECARIO)"),
                    @ApiResponse(responseCode = "404", description = "Artigo não encontrado")
            }
    )
    public ResponseEntity<Void> deleteArtigo(@Parameter(description = "ID do artigo (UUID)", example = "a1b2c3d4-e5f6-7890-1234-567890abcdef") @PathVariable UUID id) {
        artigoService.deleteArtigo(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/titulo")
    @PreAuthorize("hasAnyRole('BIBLIOTECARIO', 'USER')")
    @Operation(
            summary = "Buscar artigos por título",
            description = "Retorna uma lista de artigos cujos títulos contêm o termo de busca (case-insensitive). Requer autenticação com papel BIBLIOTECARIO ou USER.",
            security = @SecurityRequirement(name = "bearerAuth"),
            responses = {
                    @ApiResponse(responseCode = "200", description = "Lista de artigos encontrados",
                            content = @Content(schema = @Schema(implementation = List.class, subTypes = {ArtigoDTO.class}))),
                    @ApiResponse(responseCode = "401", description = "Não autenticado"),
                    @ApiResponse(responseCode = "403", description = "Sem permissão (não tem papel BIBLIOTECARIO ou USER)")
            }
    )
    public ResponseEntity<List<ArtigoDTO>> findByTitulo(@Parameter(description = "Termo de busca para o título do artigo") @RequestParam("q") String titulo) {
        List<ArtigoDTO> artigos = artigoService.findByTitulo(titulo);
        return ResponseEntity.ok(artigos);
    }

    @GetMapping("/autor/{autorId}")
    @PreAuthorize("hasAnyRole('BIBLIOTECARIO', 'USER')")
    @Operation(
            summary = "Buscar artigos por autor",
            description = "Retorna uma lista de artigos escritos por um autor específico. Requer autenticação com papel BIBLIOTECARIO ou USER.",
            security = @SecurityRequirement(name = "bearerAuth"),
            responses = {
                    @ApiResponse(responseCode = "200", description = "Lista de artigos encontrados",
                            content = @Content(schema = @Schema(implementation = List.class, subTypes = {ArtigoDTO.class}))),
                    @ApiResponse(responseCode = "401", description = "Não autenticado"),
                    @ApiResponse(responseCode = "403", description = "Sem permissão (não tem papel BIBLIOTECARIO ou USER)"),
                    @ApiResponse(responseCode = "404", description = "Autor não encontrado")
            }
    )
    public ResponseEntity<List<ArtigoDTO>> findByAutor(@Parameter(description = "ID do autor (UUID)", example = "a1b2c3d4-e5f6-7890-1234-567890abcdef") @PathVariable UUID autorId) {
        List<ArtigoDTO> artigos = artigoService.findByAutor(autorId);
        return ResponseEntity.ok(artigos);
    }
}

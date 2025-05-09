package com.biblioteca.backend.dto.request;

import com.biblioteca.backend.entity.Artigo;
import com.biblioteca.backend.entity.Autor;

import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Schema(description = "DTO para representar dados de artigo")
public record ArtigoDTO(
        @Schema(description = "ID único do artigo (gerado pelo sistema na criação, opcional na atualização)", example = "f5a4b3c2-d1e0-9876-5432-10fedcba9876")
        UUID id,

        @Schema(description = "Título do artigo", example = "A Importância da Leitura na Sociedade Moderna")
        String titulo,

        @Schema(description = "Digital Object Identifier (DOI) do artigo", example = "10.1016/j.bibli.2023.101234")
        String doi,

        @Schema(description = "Data de publicação do artigo (YYYY-MM-DD)", example = "2023-11-01")
        LocalDate dataPublicacao,

        @Schema(description = "Resumo ou abstract do artigo", example = "Este artigo discute os benefícios da leitura...")
        String resumo,

        @Schema(description = "Palavras-chave associadas ao artigo", example = "Leitura, Educação, Sociedade")
        String palavrasChave,

        @Schema(description = "Lista de IDs (UUIDs) dos autores do artigo", example = "[\"a1b2c3d4-e5f6-7890-1234-567890abcdef\", \"b1c2d3e4-f5a6-7890-1234-567890abcdef\"]")
        List<UUID> autoresIds,

        @Schema(description = "Nome da revista onde o artigo foi publicado", example = "Revista Brasileira de Biblioteconomia")
        String revista,

        @Schema(description = "Volume da revista", example = "25")
        String volume,

        @Schema(description = "Número da revista", example = "3")
        String numero,

        @Schema(description = "Número da página inicial do artigo na revista", example = "45")
        Integer paginaInicial,

        @Schema(description = "Número da página final do artigo na revista", example = "60")
        Integer paginaFinal
) {
    public static ArtigoDTO fromEntity(Artigo artigo) {
        return new ArtigoDTO(
                artigo.getId(),
                artigo.getTitulo(),
                artigo.getDoi(),
                artigo.getDataPublicacao(),
                artigo.getResumo(),
                artigo.getPalavrasChave(),
                artigo.getAutores().stream().map(Autor::getId).collect(Collectors.toList()),
                artigo.getRevista(),
                artigo.getVolume(),
                artigo.getNumero(),
                artigo.getPaginaInicial(),
                artigo.getPaginaFinal()
        );
    }
}

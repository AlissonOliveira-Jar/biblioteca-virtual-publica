package com.biblioteca.backend.dto.request;

import com.biblioteca.backend.entity.Livro;

import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDate;
import java.util.UUID;

@Schema(description = "DTO para representar dados de livro")
public record LivroDTO(
        @Schema(description = "ID único do livro (gerado pelo sistema na criação, opcional na atualização)", example = "f5a4b3c2-d1e0-9876-5432-10fedcba9876")
        UUID id,

        @Schema(description = "Título do livro", example = "Dom Quixote")
        String titulo,

        @Schema(description = "ISBN do livro", example = "978-85-359-1484-3")
        String isbn,

        @Schema(description = "Número da edição do livro", example = "1")
        Integer edicao,

        @Schema(description = "Data de publicação do livro (YYYY-MM-DD)", example = "1605-01-16")
        LocalDate dataPublicacao,

        @Schema(description = "Número total de páginas do livro", example = "863")
        Integer numeroPaginas,

        @Schema(description = "Gênero literário do livro", example = "Romance de Cavalaria")
        String genero,

        @Schema(description = "Resumo ou sinopse do livro", example = "As aventuras de um cavaleiro andante...")
        String resumo,

        @Schema(description = "ID do autor do livro (UUID)", example = "a1b2c3d4-e5f6-7890-1234-567890abcdef")
        UUID autorId,

        @Schema(description = "ID da editora do livro (UUID)", example = "b1c2d3e4-f5a6-7890-1234-567890abcdef")
        UUID editoraId
) {
    public static LivroDTO fromEntity(Livro livro) {
        return new LivroDTO(
                livro.getId(),
                livro.getTitulo(),
                livro.getIsbn(),
                livro.getEdicao(),
                livro.getDataPublicacao(),
                livro.getNumeroPaginas(),
                livro.getGenero(),
                livro.getResumo(),
                livro.getAutor().getId(),
                livro.getEditora() != null ? livro.getEditora().getId() : null
        );
    }
}

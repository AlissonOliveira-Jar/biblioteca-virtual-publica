package com.biblioteca.backend.dto.request;

import com.biblioteca.backend.entity.Editora;

import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDate;
import java.util.UUID;

@Schema(description = "DTO para representar dados de editora")
public record EditoraDTO(
        @Schema(description = "ID único da editora (gerado pelo sistema na criação, opcional na atualização)", example = "f5a4b3c2-d1e0-9876-5432-10fedcba9876")
        UUID id,

        @Schema(description = "Nome da editora", example = "Companhia das Letras")
        String nome,

        @Schema(description = "País de origem da editora", example = "Brasil")
        String pais,

        @Schema(description = "Data de fundação da editora (YYYY-MM-DD)", example = "1986-05-15")
        LocalDate dataFundacao,

        @Schema(description = "Website oficial da editora", example = "https://www.companhiadasletras.com.br")
        String website
) {
    public static EditoraDTO fromEntity(Editora editora) {
        return new EditoraDTO(
                editora.getId(),
                editora.getNome(),
                editora.getPais(),
                editora.getDataFundacao(),
                editora.getWebsite()
        );
    }
}

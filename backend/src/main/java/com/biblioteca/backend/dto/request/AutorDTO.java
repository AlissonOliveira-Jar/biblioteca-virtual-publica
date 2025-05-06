package com.biblioteca.backend.dto.request;

import com.biblioteca.backend.entity.Autor;

import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDate;
import java.util.UUID;

@Schema(description = "DTO para representar dados de autor")
public record AutorDTO(
        @Schema(description = "ID único do autor (gerado pelo sistema na criação, opcional na atualização)", example = "a1b2c3d4-e5f6-7890-1234-567890abcdef")
        UUID id,

        @Schema(description = "Nome completo do autor", example = "Machado de Assis")
        String nome,

        @Schema(description = "Nacionalidade do autor", example = "Brasileira")
        String nacionalidade,

        @Schema(description = "Data de nascimento do autor (YYYY-MM-DD)", example = "1839-06-21")
        LocalDate dataNascimento,

        @Schema(description = "Data de falecimento do autor (YYYY-MM-DD)", example = "1908-09-29")
        LocalDate dataFalescimento,

        @Schema(description = "Breve biografia do autor", example = "Um dos maiores escritores da literatura brasileira...")
        String biografia
) {
    public static AutorDTO fromEntity(Autor autor) {
        return new AutorDTO(
                autor.getId(),
                autor.getNome(),
                autor.getNacionalidade(),
                autor.getDataNascimento(),
                autor.getDataFalescimento(),
                autor.getBiografia()
        );
    }
}

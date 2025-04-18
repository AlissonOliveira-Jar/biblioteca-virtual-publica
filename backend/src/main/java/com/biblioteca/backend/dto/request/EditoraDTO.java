package com.biblioteca.backend.dto.request;

import com.biblioteca.backend.entity.Editora;

import java.time.LocalDate;
import java.util.UUID;

public record EditoraDTO(UUID id, String nome, String pais, LocalDate dataFundacao, String website) {
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

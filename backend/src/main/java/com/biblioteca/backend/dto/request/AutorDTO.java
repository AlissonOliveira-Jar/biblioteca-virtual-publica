package com.biblioteca.backend.dto.request;

import com.biblioteca.backend.entity.Autor;

import java.time.LocalDate;
import java.util.UUID;

public record AutorDTO(
        UUID id,
        String nome,
        String nacionalidade,
        LocalDate dataNascimento,
        LocalDate dataFalescimento,
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

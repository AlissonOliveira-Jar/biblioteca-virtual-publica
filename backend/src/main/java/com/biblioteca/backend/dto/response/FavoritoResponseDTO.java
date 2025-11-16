package com.biblioteca.backend.dto.response;

import com.biblioteca.backend.entity.Favorito;
import com.biblioteca.backend.dto.request.LivroDTO;

import java.time.Instant;
import java.util.UUID;

public record FavoritoResponseDTO(
        UUID id,
        LivroDTO livro,
        Instant createdAt
) {
    public static FavoritoResponseDTO fromEntity(Favorito favorito) {
        return new FavoritoResponseDTO(
                favorito.getId(),
                LivroDTO.fromEntity(favorito.getLivro()),
                favorito.getCreatedAt()
        );
    }
}

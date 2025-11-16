package com.biblioteca.backend.response;

import lombok.Builder;

@Builder
public record PontuacaoResponseDTO(
        Long pontos,
        Integer nivel
) {
}
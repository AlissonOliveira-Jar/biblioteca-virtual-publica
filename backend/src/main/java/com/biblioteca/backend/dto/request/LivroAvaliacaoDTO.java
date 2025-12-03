package com.biblioteca.backend.dto.request;
import java.util.UUID;
public record LivroAvaliacaoDTO(
        UUID id,
        String titulo,
        String autor,
        Integer nota,
        String comentario,
        boolean avaliado
) {}

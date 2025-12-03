package com.biblioteca.backend.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record AvaliacaoRequest(
        @NotBlank(message = "O título do livro é obrigatório")
        String titulo,

        @NotBlank(message = "O ID do usuário é obrigatório")
        String idUsuario,

        @NotNull(message = "A nota é obrigatória")
        @Min(value = 1, message = "A nota deve ser no mínimo 1")
        @Max(value = 5, message = "A nota deve ser no máximo 5")
        Integer nota,

        @Size(max = 500, message = "O comentário não pode exceder 500 caracteres")
        String comentario
) {}
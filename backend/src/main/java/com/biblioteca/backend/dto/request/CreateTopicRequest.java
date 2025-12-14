package com.biblioteca.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.UUID;

public record CreateTopicRequest(
        @NotBlank(message = "O título é obrigatório")
        @Size(min = 5, max = 255, message = "O título deve ter entre 5 e 255 caracteres")
        String title,

        @NotBlank(message = "O conteúdo é obrigatório")
        @Size(min = 10, message = "O conteúdo deve ter no mínimo 10 caracteres")
        String content,

        @NotNull(message = "A categoria é obrigatória")
        UUID categoryId
) {}

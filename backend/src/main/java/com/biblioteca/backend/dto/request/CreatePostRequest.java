package com.biblioteca.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreatePostRequest(
        @NotBlank(message = "O conteúdo é obrigatório")
        @Size(min = 1, message = "A resposta deve ter no mínimo 1 caracteres")
        String content
) {}

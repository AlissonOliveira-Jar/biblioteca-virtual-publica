package com.biblioteca.backend.dto.request;

import jakarta.validation.constraints.NotBlank;

import io.swagger.v3.oas.annotations.media.Schema;


@Schema(description = "DTO para autenticação (login)")
public record LoginDTO(
        @NotBlank
        @Schema(description = "Email do utilizador", example = "utilizador@example.com")
        String email,

        @NotBlank
        @Schema(description = "Senha do utilizador")
        String password
) {

}
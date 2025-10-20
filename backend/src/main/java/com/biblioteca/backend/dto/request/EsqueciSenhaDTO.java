package com.biblioteca.backend.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "DTO para iniciar o processo de redefinição de senha")
public record EsqueciSenhaDTO(
        @Schema(description = "Email da conta para redefinir a senha", example = "utilizador@example.com")
        String email
) {
}
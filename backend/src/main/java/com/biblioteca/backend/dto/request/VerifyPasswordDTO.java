package com.biblioteca.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "DTO para verificar a senha atual do usuário")
public record VerifyPasswordDTO(
        @NotBlank(message = "Senha é obrigatória")
        @Schema(description = "A senha atual do usuário a ser verificada", example = "SenhaAtual@123")
        String password
) {}

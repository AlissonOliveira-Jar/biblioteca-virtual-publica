package com.biblioteca.backend.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;


@Schema(description = "DTO para finalizar a redefinição de senha")
public record RedefinirSenhaDTO(
        @Schema(description = "Token de redefinição recebido (ex: por email)", example = "1a2b3c4d-5e6f-7890-abcd-ef1234567890")
        String token,

        @Schema(description = "SenhaBoa@20!2")
        String novaSenha
) {
}
package com.biblioteca.backend.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Resposta do login bem-sucedido com token JWT")
public record JwtResponse(
        @Schema(description = "Token de autenticação JWT", example = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...")
        String token
) {
}
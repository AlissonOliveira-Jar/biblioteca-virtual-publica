package com.biblioteca.backend.dto.request;

import com.biblioteca.backend.entity.User;

import io.swagger.v3.oas.annotations.media.Schema;

import java.time.Instant;
import java.util.Set;
import java.util.UUID;

@Schema(description = "DTO para representar dados de utilizador na resposta")
public record UserDTO(
        @Schema(description = "ID único do utilizador", example = "a1b2c3d4-e5f6-7890-1234-567890abcdef")
        UUID id,

        @Schema(description = "Nome completo do utilizador", example = "Fulano da Silva")
        String name,

        @Schema(description = "Endereço de email do utilizador", example = "fulano@example.com")
        String email,

        @Schema(description = "Data e hora de criação da conta", example = "2023-10-27T10:00:00Z")
        Instant createdAt,

        @Schema(description = "Conjunto de papéis (roles) atribuídos ao utilizador", example = "[\"USER\", \"ADMIN\"]")
        Set<String> roles
) {
    public static UserDTO fromEntity(User user) {
        return new UserDTO(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getCreatedAt(),
                user.getRoles()
        );
    }
}

package com.biblioteca.backend.dto.request;

import com.biblioteca.backend.entity.User;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.Instant;
import java.util.Set;
import java.util.UUID;

@Schema(description = "DTO para representar dados de utilizador na resposta")
public record UserDTO(
        @Schema(description = "ID único do utilizador", example = "a1b2c3d4...")
        UUID id,

        @Schema(description = "Nome completo do utilizador", example = "Fulano da Silva")
        String name,

        @Schema(description = "Endereço de email do utilizador", example = "fulano@example.com")
        String email,

        @Schema(description = "Data e hora de criação da conta", example = "2023-10-27T10:00:00Z")
        Instant createdAt,

        @Schema(description = "Conjunto de papéis (roles)", example = "[\"USER\", \"ADMIN\"]")
        Set<String> roles,

        @Schema(description = "Pontuação de fulano", example = "100")
        Long pontos,

        @Schema(description = "Nível alcançado de fulano", example = "4")
        Integer nivel,

        @Schema(description = "Se o usuário está banido de comentar")
        boolean isCommentBanned,

        @Schema(description = "Data de expiração do banimento")
        Instant commentBanExpiresAt,

        @Schema(description = "URL do avatar do usuário", example = "https://example.com/avatar.png")
        String avatarUrl
) {
    public static UserDTO fromEntity(User user, Long pontos, Integer nivel) {
        return new UserDTO(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getCreatedAt(),
                user.getRoles(),
                pontos,
                nivel,
                user.isCommentBanned(),
                user.getCommentBanExpiresAt(),
                user.getAvatarUrl()
        );
    }

    public static UserDTO fromEntity(User user) {
        return fromEntity(user, 0L, 1);
    }
}
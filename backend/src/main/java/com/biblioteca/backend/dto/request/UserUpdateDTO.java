package com.biblioteca.backend.dto.request;

import jakarta.validation.constraints.Email;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "DTO para dados de atualização de utilizador")
public record UserUpdateDTO(
        @Schema(description = "Novo nome do utilizador (opcional)", example = "Cicrano Souza Atualizado")
        String name,

        @Email
        @Schema(description = "Novo endereço de email (opcional)", example = "cicrano.novo@example.com")
        String email,

        @Schema(description = "Senha atual do utilizador (obrigatória se 'newPassword' for fornecida)")
        String currentPassword,

        @Schema(description = "Nova senha para o utilizador (opcional, requer 'currentPassword' se fornecida)")
        String newPassword
) {}

package com.biblioteca.backend.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "DTO para dados de criação de utilizador")
public record UserCreateDTO(
        @NotBlank(message = "Nome obrigatório")
        @Schema(description = "Nome completo do utilizador", example = "Cicrano de Souza")
        String name,

        @Email(message = "Email inválido")
        @NotBlank(message = "Email obrigatório")
        @Schema(description = "Endereço de email único para o utilizador", example = "cicrano@example.com")
        String email,

        @Size(min = 8, message = "Senha deve ter no mínimo 8 caracteres")
        @Pattern(
                regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$",
                message = "Senha deve conter: letras maiúsculas, minúsculas, números e caracteres especiais"
        )
        @Schema(description = "Senha para a conta do utilizador", example = "MinhaSenhaSegura123!")
        String password
) {}

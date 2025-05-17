package com.biblioteca.backend.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record UserCreateDTO(
        @NotBlank(message = "Nome obrigatório")
        String name,

        @Email(message = "Email inválido")
        @NotBlank(message = "Email obrigatório")
        String email,

        @Size(min = 8, message = "Senha deve ter no mínimo 8 caracteres")
        @Pattern(
                regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$",
                message = "Senha deve conter: letras maiúsculas, minúsculas, números e caracteres especiais"
        )
        String password
) {}

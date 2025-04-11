package com.biblioteca.backend.dto.request;

import jakarta.validation.constraints.Email;

public record UserUpdateDTO(
        String name,
        @Email String email,
        String currentPassword,
        String newPassword
) {}

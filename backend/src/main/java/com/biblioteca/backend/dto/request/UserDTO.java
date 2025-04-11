package com.biblioteca.backend.dto.request;

import com.biblioteca.backend.entity.User;

import java.time.Instant;
import java.util.Set;
import java.util.UUID;

public record UserDTO(UUID id, String name, String email, Instant createdAt, Set<String> roles) {
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

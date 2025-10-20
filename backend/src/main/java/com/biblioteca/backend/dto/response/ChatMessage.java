package com.biblioteca.backend.dto.response;

import java.time.Instant;

public record ChatMessage(
        String senderId,
        String receiverId, // Pode ser o ID de um usuário ou de uma sala/grupo
        String content,
        Instant timestamp
) {
}

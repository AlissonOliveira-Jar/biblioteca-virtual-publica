package com.biblioteca.backend.dto.response;

import java.time.Instant;

public record ChatMessage(
        String senderId,
        String receiverId,
        String content,
        Instant timestamp
) {
}

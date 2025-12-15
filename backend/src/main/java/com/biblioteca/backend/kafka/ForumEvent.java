package com.biblioteca.backend.kafka;

import java.time.Instant;

public record ForumEvent(
        String eventType,
        String topicId,
        String postId,
        String authorId,
        Integer xpReward,
        Instant timestamp
) {}
package com.biblioteca.backend.kafka;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class ForumProducerService {

    private static final String TOPIC = "forum-events";
    private final KafkaTemplate<String, ForumEvent> kafkaTemplate;

    public void sendTopicCreatedEvent(UUID topicId, UUID authorId) {
        ForumEvent event = new ForumEvent(
                "TOPIC_CREATED",
                topicId.toString(),
                null,
                authorId.toString(),
                50,
                Instant.now()
        );

        log.info("#### -> Produzindo evento TOPIC_CREATED -> topicId: {}, authorId: {}", topicId, authorId);
        this.kafkaTemplate.send(TOPIC, topicId.toString(), event);
    }

    public void sendPostCreatedEvent(UUID postId, UUID topicId, UUID authorId) {
        ForumEvent event = new ForumEvent(
                "POST_CREATED",
                topicId.toString(),
                postId.toString(),
                authorId.toString(),
                20,
                Instant.now()
        );

        log.info("#### -> Produzindo evento POST_CREATED -> postId: {}, topicId: {}, authorId: {}", postId, topicId, authorId);
        this.kafkaTemplate.send(TOPIC, postId.toString(), event);
    }
}
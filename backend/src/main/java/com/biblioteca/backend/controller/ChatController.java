package com.biblioteca.backend.controller;

import com.biblioteca.backend.dto.response.ChatMessage;
import com.biblioteca.backend.kafka.KafkaProducerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;

@RestController
@RequestMapping("/api/chat")
public class ChatController {
    @Autowired
    private KafkaProducerService producerService;

    @PostMapping("/send")
    public ResponseEntity<Void> sendMessage(@RequestBody ChatMessage message) {
        ChatMessage messageWithTimestamp = new ChatMessage(
                message.senderId(),
                message.receiverId(),
                message.content(),
                Instant.now()
        );
        producerService.sendMessage(messageWithTimestamp);
        return ResponseEntity.ok().build();
    }
}

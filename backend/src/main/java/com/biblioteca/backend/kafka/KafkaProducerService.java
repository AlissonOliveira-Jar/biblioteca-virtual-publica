package com.biblioteca.backend.kafka;

import com.biblioteca.backend.dto.response.ChatMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class KafkaProducerService {

    private static final Logger logger = LoggerFactory.getLogger(KafkaProducerService.class);
    private static final String TOPIC = "chat-messages";

    @Autowired
    private KafkaTemplate<String, ChatMessage> kafkaTemplate;

    public void sendMessage(ChatMessage message) {
        logger.info(String.format("#### -> Produzindo mensagem de chat -> %s", message));
        this.kafkaTemplate.send(TOPIC, message);
    }
}
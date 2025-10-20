package com.biblioteca.backend.kafka;

import com.biblioteca.backend.dto.response.ChatMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class KafkaConsumerService {

    private static final Logger logger = LoggerFactory.getLogger(KafkaConsumerService.class);

    @KafkaListener(topics = "chat-messages", groupId = "biblioteca-group")
    public void consume(ChatMessage message) {
        logger.info(String.format("#### <- Mensagem de chat consumida <- %s", message));
        // Aqui no futuro, você pode:
        // 1. Salvar a mensagem no banco de dados.
        // 2. Enviar a mensagem para o destinatário via WebSockets.
    }
}

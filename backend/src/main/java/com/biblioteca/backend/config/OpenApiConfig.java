package com.biblioteca.backend.config;

// Importações necessárias para as anotações
import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.info.License;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import io.swagger.v3.oas.annotations.servers.Server;

import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(
        info = @Info(
                title = "API da Biblioteca Virtual Pública",
                version = "v1.1.0",
                description = "Documentação da API backend para gerenciar a biblioteca.",
                contact = @Contact(
                        name = "Alisson Oliveira",
                        email = "alisson.dev.py@gmail.com",
                        url = "https://github.com/AlissonOliveira-Jar"
                ),
                license = @License(
                        name = "Apache 2.0",
                        url = "http://springdoc.org"
                )
        ),
        servers = @Server(
                url = "http://localhost:8080",
                description = "Servidor de Desenvolvimento"
        )
)

@SecurityScheme(
        name = "bearerAuth",
        type = SecuritySchemeType.HTTP,
        scheme = "bearer",
        bearerFormat = "JWT",
        description = "Forneça o token JWT no cabeçalho 'Authorization': `Bearer <token>`"
)
public class OpenApiConfig {
}

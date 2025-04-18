package com.biblioteca.backend.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI myAPI() {
        Server devServer = new Server();
        devServer.setUrl("http://localhost:8080");
        devServer.setDescription("Servidor de Desenvolvimento");

        Contact contact = new Contact();
        contact.setEmail("alisson.dev.py@gmail.com");
        contact.setName("Alisson Oliveira");
        contact.setUrl("https://github.com/AlissonOliveira-Jar");

        Info info = new Info()
                .title("API Biblioteca Virtual Pública")
                .version("v1.0")
                .description("Esta é a API para gerenciar a biblioteca.")
                .contact(contact)
                .license(new io.swagger.v3.oas.models.info.License().name("Apache 2.0").url("http://springdoc.org"));

        return new OpenAPI().info(info).servers(List.of(devServer));
    }

}

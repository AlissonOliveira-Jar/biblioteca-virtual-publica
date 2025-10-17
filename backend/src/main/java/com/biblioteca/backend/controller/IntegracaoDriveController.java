package com.biblioteca.backend.controller;

import com.biblioteca.backend.service.IntegracaoDriveService;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("api/drive")
@RequiredArgsConstructor
@Tag(name = "Google Drive", description = "Integração com a pasta Livros no Drive")
public class IntegracaoDriveController {

    private final IntegracaoDriveService integracaoDriveService;

    @GetMapping("/livros")
    public ResponseEntity<?> listarLivros() {
        try {
            List<Map<String, Object>> arquivos = integracaoDriveService.listarLivros();
            if (arquivos.isEmpty()) {
                return ResponseEntity.ok("Não há livros na pasta do Drive.");
            }
            return ResponseEntity.ok(arquivos);
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body("Erro ao acessar o Google Drive: " + e.getMessage());
        }
    }
}
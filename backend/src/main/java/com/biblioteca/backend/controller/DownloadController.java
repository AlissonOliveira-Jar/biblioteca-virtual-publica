package com.biblioteca.backend.controller;

import com.biblioteca.backend.service.DownloadService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/download")
@RequiredArgsConstructor
@Slf4j

public class DownloadController {
    private final DownloadService downloadService;

    @GetMapping
    public ResponseEntity<byte[]> startDownload(@RequestParam String titulo, @RequestParam(required = false) String fileId){

        log.info("Requisição de download. Título: '{}', FileId: '{}'", titulo, fileId);

        if (titulo == null || titulo.trim().isEmpty()){
            return ResponseEntity.badRequest().body(null);
        }
        byte[] pdfBytes = downloadService.baixarLivro(titulo, fileId);

        if (pdfBytes == null || pdfBytes.length == 0){
            log.error("Download falhou. Livro não encontrado em nenhuma fonte.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(null);
        }
        String nomeArquivo =downloadService.obterNomeArquivoFormatado(titulo, fileId);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + nomeArquivo + "\"")
                .contentType(MediaType.APPLICATION_PDF)
                .contentLength(pdfBytes.length)
                .body(pdfBytes);
    }
}
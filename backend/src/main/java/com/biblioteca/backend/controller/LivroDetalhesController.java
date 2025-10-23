package com.biblioteca.backend.controller;

import com.biblioteca.backend.service.LivroDetalhesService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;

@RestController
@RequestMapping("api/livros-info")
@RequiredArgsConstructor
@Slf4j
public class LivroDetalhesController {

    private final LivroDetalhesService livroDetalhesService;

    @GetMapping("/detalhes")
    public ResponseEntity<?> buscarDetalhesLivro(@RequestParam String titulo){
        if (titulo == null || titulo.trim().isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("erro", "O título do livro é obrigatório para a busca de detalhes."));

        }
        try {
            Map<String, Object> detalhes = livroDetalhesService.buscarDetalhesLivro(titulo);
            if(detalhes.containsKey("Erro")){
                log.error("Falha ao buscar informações sobre o livro: {}",titulo);
                return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(detalhes);
            }
            return ResponseEntity.ok(detalhes);
        } catch (Exception e) {
            log.error("Erro inesperado no Controller ao buscar detalhes para o título : {}", titulo,e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("erro", "Erro interno do servidor ao processar a busca."));
        }
    }

    /*@GetMapping("/download")
    public ResponseEntity<byte[]> downloadPDF(@RequestParam(required = false) String pdfUrl, @RequestParam String titulo){
        byte[] pdf = livroDetalhesService.downloadPdf(pdfUrl,titulo);
        if (pdf == null){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,"attachment; filename=\"" +titulo.replace(" ", "_")+ " .pdf\"")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }*/
}

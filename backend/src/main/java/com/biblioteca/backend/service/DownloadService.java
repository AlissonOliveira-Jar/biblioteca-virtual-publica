package com.biblioteca.backend.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j

public class DownloadService {
    private final DownloadDriveService downloadDriveService;
    private final LivroDetalhesService livroDetalhesService;

    public byte[] baixarLivro(String titulo, String fileId) {
        String finalFileId = fileId;
        log.info("Iniciando tentativa de Download para o título");

        if (finalFileId == null || finalFileId.trim().isEmpty()) {

            if (titulo == null || titulo.trim().isEmpty()) {
                log.error("Download falhou. Nem o fileId nem o título foram fornecidos.");
                return null;
            }

            log.info("FileId não fornecido. Tentando obter fileId via LivroDetalhesService para o título: {}", titulo);
            Map<String, Object> detalhes = livroDetalhesService.buscarDetalhesLivro(titulo);

            finalFileId = (String) detalhes.get("fileId_drive");

            if (finalFileId == null || finalFileId.trim().isEmpty()) {
                log.error("Download falhou. LivroDetailsService não conseguiu mapear o título '{}' para um fileId do Drive. FileId atual: {}", titulo, finalFileId);
                return null;
            }
        }
            log.info("Tentando Download via Google Drive com fileId: {}", finalFileId);

            byte[] conteudoDrive = downloadDriveService.baixarArquivo(finalFileId);

            if (conteudoDrive != null) {
                log.info("Download bem-sucedido via Drive.");
                return conteudoDrive;
            } else {
                log.warn("Download via Drive falhou.");
                return null;
            }
    }

    public String obterNomeArquivoFormatado (String titulo, String fileId){
            String nomeBase = titulo;

            if (fileId != null && !fileId.isEmpty()){
                String nomeDrive = downloadDriveService.obterNomeLivro(fileId);

                if (nomeDrive != null && !nomeDrive.isEmpty()){
                    nomeBase = nomeDrive;
                }
            }
            nomeBase = nomeBase.replaceFirst("\\.[^.]+$", "");
            return nomeBase.replace(" ", "_").replace("'", "").replace("\"", "") + ".pdf";
        }
    }
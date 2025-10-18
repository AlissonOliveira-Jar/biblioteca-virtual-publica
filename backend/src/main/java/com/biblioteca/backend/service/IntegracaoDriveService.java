package com.biblioteca.backend.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.util.List;
import java.util.Map;

@Service
@Slf4j
@RequiredArgsConstructor
public class IntegracaoDriveService {

    @Value("${GOOGLE_DRIVE_FOLDER_ID}")
    private String folderId;

    @Value("${GOOGLE_DRIVE_ACCESS_TOKEN}")
    private String accessToken;

    @Value("${google.drive.folder.id}")
    private String livrosId;

    private final WebClient webClient = WebClient.create("https://www.googleapis.com/drive/v3");

    public List<Map<String, Object>> listarLivros() {
        try {
            Map response = webClient.get()
                    .uri(uriBuilder -> uriBuilder.path("/files") // só o path, não a URL completa
                            .queryParam("q", "'" + folderId + "' in parents and trashed=false")
                            .queryParam("fields", "files(id,name,mimeType,webViewLink)")
                            .build())
                    .header("Authorization", "Bearer " + accessToken)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

            if (response == null || response.get("files") == null) {
                log.info("Nenhum arquivo encontrado na pasta do Drive.");
                return List.of();
            }

            List<Map<String, Object>> arquivos = (List<Map<String, Object>>) response.get("files");
            log.info("Foram encontrados {} arquivos na pasta do Drive.", arquivos.size());
            return arquivos;

        } catch (WebClientResponseException e) {
            log.error("Erro ao acessar o Google Drive: {} - {}", e.getStatusCode(), e.getResponseBodyAsString());
            return List.of();
        } catch (Exception e) {
            log.error("Erro inesperado ao acessar o Google Drive", e);
            return List.of();
        }
    }
}
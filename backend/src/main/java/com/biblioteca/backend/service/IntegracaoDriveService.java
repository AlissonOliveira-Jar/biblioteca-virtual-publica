package com.biblioteca.backend.service;

import com.google.api.services.drive.Drive;
import com.google.api.services.drive.model.File;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class IntegracaoDriveService {

    private final Drive driveService;

    @Value("${GOOGLE_DRIVE_FOLDER_ID}")
    private String folderId;

    public List<Map<String, Object>> listarLivros() {
        try {
            String query = "'" + folderId + "' in parents and trashed=false";

            List<File> files = driveService.files().list()
                    .setQ(query)
                    .setFields("files(id, name, mimeType, webViewLink)")
                    .execute()
                    .getFiles();

            if (files == null || files.isEmpty()) {
                log.info("Nenhum arquivo encontrado na pasta do Drive com ID: {}", folderId);
                return Collections.emptyList();
            }

            log.info("Foram encontrados {} arquivos na pasta do Drive.", files.size());

            return files.stream()
                .map(file -> {
                    Map<String, Object> fileMap = new java.util.HashMap<>();
                    fileMap.put("id", file.getId());
                    fileMap.put("name", file.getName());
                    fileMap.put("mimeType", file.getMimeType());
                    fileMap.put("webViewLink", file.getWebViewLink());
                    return fileMap;
                })
                .collect(Collectors.toList());

        } catch (IOException e) {
            log.error("Erro ao acessar o Google Drive via biblioteca cliente", e);
            return Collections.emptyList();
        }
    }
}
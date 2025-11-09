package com.biblioteca.backend.service;
import com.google.api.services.drive.Drive;
import com.google.api.services.drive.model.File;
import com.google.api.services.drive.model.FileList;
import lombok.extern.slf4j.Slf4j;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.io.IOException;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class LivroDetalhesService {
    private final OpenLibraryApiService openLibraryApiService;
    private final Drive googleDrive;

    public Map<String, Object> buscarDetalhesLivro(String titulo) {
        Map<String, Object> resultado = new LinkedHashMap<>();

        try {
            Map<String, Object> openLibraryData = openLibraryApiService.buscarDetalhes(titulo);
            if (openLibraryData != null && !openLibraryData.isEmpty()) {
                resultado.putAll(openLibraryData);
            }

            } catch (Exception e) {
            log.error("Erro ao buscar na Open Library. Ignorando metadados externos.", e);
        }
        try {
            // Consulta no Drive: busca arquivos PDF com o nome contendo o título
            String query = "name contains '" + titulo.replace("'", "\\'") +
                    "' and mimeType='application/pdf' and trashed=false";

            FileList fileList = googleDrive.files().list()
                    .setQ(query)
                    .setFields("files(id, name)") // Pede apenas o ID e o Nome
                    .execute();

            List<File> arquivos = fileList.getFiles();

            if (arquivos != null && !arquivos.isEmpty()) {
                String fileId = arquivos.get(0).getId();
                // INJETA O ID NO RESULTADO, PARA SER USADO PELO DOWNLOADSERVICE
                resultado.put("fileId_drive", fileId);
                resultado.put("file_name", arquivos.get(0).getName());
                log.info("File ID do Drive encontrado para o título '{}': {}", titulo, fileId);
            } else {
                log.warn("Nenhum arquivo PDF encontrado no Drive com o título: {}", titulo);
            }
        } catch (IOException e) {
            log.error("Erro ao buscar ID do arquivo no Google Drive: {}", e.getMessage(), e);
        }

        if (resultado.isEmpty()) {
            resultado.put("status", "Nenhum dado encontrado para o título: " + titulo);
        }
        return resultado;
    }
}

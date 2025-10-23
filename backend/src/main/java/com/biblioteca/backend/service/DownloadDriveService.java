package com.biblioteca.backend.service;

import com.google.api.services.drive.Drive;
import com.google.api.services.drive.model.File;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.apache.commons.io.IOUtils;

import java.io.ByteArrayOutputStream;
import java.io.IOException;

@Service
@Slf4j
public class DownloadDriveService{

    private final Drive driveService;

    public DownloadDriveService(Drive driveService){
        this.driveService = driveService;
    }
    public byte[] baixarArquivo(String fileId){
        try {
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            driveService.files().get(fileId)
                    .executeMediaAndDownloadTo(outputStream);
            log.info("Download do arquivo ID: {} concluido com sucesso.", fileId);
            return outputStream.toByteArray();
        } catch (HttpClientErrorException e){
            log.error("Erro HTTP ao baixar o arquivo {}: {} ", fileId, e.getStatusCode(), e);
            return null;
        } catch (IOException e) {
            log.error("Erro de permissão ao baixar o arquivo {}.", fileId,e);
            return null;
        } catch (Exception e){
            log.error("Erro inesperado ao baixar o arquivo: {}", fileId,e);
            return null;
        }
    }
    public String obterNomeLivro(String fileId){
        try {
            File file = driveService.files().get(fileId)
                    .setFields("name")
                    .execute();
            return file.getName();
        } catch (IOException e){
            log.error("Erro ao obter o nome do arquivo ID: {}", fileId,e);
            return null;
        }
    }
}
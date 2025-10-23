package com.biblioteca.backend.service;
import com.biblioteca.backend.service.OpenLibraryApiService;
import com.google.api.services.drive.Drive;
import com.google.api.services.drive.model.File;
import com.google.api.services.drive.model.FileList;
import lombok.extern.slf4j.Slf4j;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.io.IOException;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class LivroDetalhesService {
    /*private final GoogleBooksAPIService googleBooksApiService;*/
    private final OpenLibraryApiService openLibraryApiService;
    private final Drive googleDrive;

    /*@Value("${google.books.api.key}")
    private String apikey;*/

    public Map<String, Object> buscarDetalhesLivro(String titulo) {
        Map<String, Object> resultado = new LinkedHashMap<>();

        /*Map<String, Object> googleResult = googleBooksApiService.fetchBookDetails(titulo);
        if (googleResult.containsKey("Erro")){

            return googleResult;
        }
        resultado.putAll(googleResult);
        log.info("Detalhes do Google Books:{}", titulo);*/
        /*return resultado;*/
        /*if (titulo == null || titulo.isBlank()) {
            log.warn("O título fornecido é nulo ou vazio.");
            return Map.of("Erro", "O título do livro não pode ser nulo ou vazio");
        }*/
        /*Map<String, Object> booksData = googleBooksApiService.fetchBookDetails(titulo);
        if (booksData != null && !booksData.isEmpty()) {
            resultado.putAll(booksData);
        }*/

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

            /*if (buscarGoogle != null && buscarGoogle.get("items") != null) {
                Map<String, Object> firstItem = (Map<String, Object>) ((java.util.List<?>) buscarGoogle.get("items")).get(0);
                System.out.println("FirstItem JSON: " + firstItem);
                Map<String, Object> volumeInfo = (Map<String, Object>) firstItem.get("volumeInfo");
                resultado.put("Título", volumeInfo.get("title"));
                resultado.put("Autor", volumeInfo.get("authors"));
                resultado.put("Descricao", volumeInfo.get("description"));

                Map<String, Object> imageLinks = (Map<String, Object>) volumeInfo.get("imageLinks");
                if (imageLinks != null && imageLinks.get("thumbnail") != null) {
                    resultado.put("Capa", imageLinks.get("thumbnail"));
                }

                Map<String, Object> accessInfo = (Map<String, Object>) firstItem.get("accessInfo");
                if (accessInfo != null && accessInfo.get("pdf") != null) {
                    Map<String, Object> pdfInfo = (Map<String, Object>) accessInfo.get("pdf");
                    System.out.println("pdfInfo:" + pdfInfo);
                    if (pdfInfo.get("isAvailable") != null && (Boolean) pdfInfo.get("isAvailable")) {
                        resultado.put("Pdf_Link_Google", pdfInfo.get("downloadLink"));
                    }
                }
            }
        }
            Map<String, Object> openData = webClient.get()
                    .uri("https://openlibrary.org/search.json?title=" + encodedTitulo)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

            if (openData != null && openData.get("docs") != null && !((List<?>) openData.get("docs")).isEmpty()) {
                Map<String, Object> firstDoc = (Map<String, Object>) ((List<?>) openData.get("docs")).get(0);

                resultado.put("Autor_Openlibrary", firstDoc.get("author_name"));
                resultado.put("ISBN", firstDoc.get("isbn"));
                resultado.put("Link_OpenLibrary", "https://openlibrary.org" + firstDoc.get("key"));

                if (firstDoc.get("cover_i") != null) {
                    resultado.put("Capa_OpenLibrary", "https://cover.openlibrary.org/b/id/" +
                            firstDoc.get("cover_i") + "-L.jpg");
                }
            }
        } catch (Exception e) {
            log.error("Erro ao buscar informações do livro: ", e);
            resultado.put("Erro", "Falha ao buscar as informações: " + e.getMessage());
        }
        return resultado;*/ //Deixar comentado por enquanto
    }

    /*public byte[] downloadPdf(String pdfUrl, String titulo) {
        if (pdfUrl != null && !pdfUrl.isEmpty()) {
                /*URL url = new URL(pdfUrl);
                HttpURLConnection connection = (HttpURLConnection) url.openConnection();
                connection.setRequestProperty("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) " +
                        "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36");
                connection.setInstanceFollowRedirects(true);
                connection.connect();
            try {
                return downloadDriveService.downloadFile(pdfUrl);
            } catch (Exception e) {
                log.warn("Falha ao baixar PDF do link Books ({}). Tentando Drive.", pdfUrl, e.getMessage());
            }
        }
        return downloadPdf(titulo)
    }*/
                /*int responseCode = connection.getResponseCode();
                if (responseCode == HttpURLConnection.HTTP_OK) {
                    try (var in = connection.getInputStream()) {
                        return in.readAllBytes();
                    }
                } else {
                    log.error("Erro HTTP ao baixar PDF: " + responseCode + " - " + connection.getResponseMessage());
                }*/

    /*public byte[] downloadFile(String fileUrl) {
        try {
            ResponseEntity<byte[]> response = restTemplate.getForEntity(fileUrl, byte[].class);
            if (response.getStatusCode.is2xxSuccessful() && response.hasBody()) {
                return response.getBody();
            }
        } catch (Exception e) {
            log.warn("Teste de exceção.Erro ao baixar o arquivo:{}", fileUrl);
        }
        return null;
    }*/

    /*public byte[] donwloadPdfDrive(String titulo) {
        try {
            String query = "name contains '" + titulo.replace("'", "\\'") + "' and mimeType='application/pdf' and trashed=false";
            FileList fileList = googleDrive.files().list()
                    .setQ(query)
                    .setFields("files(id,name)")
                    .execute();

            List<File> arquivos = fileList.getFiles();
            if (arquivos != null && !arquivos.isEmpty()) {
                String filesid = arquivos.get(0).getId();
                return googleDrive.files().get(filesid).executeMediaAsInputStream().readAllBytes();
            }
        } catch (IOException e) {
            log.error("Erro ao baixar o PDF via Drive: {}", e.getMessage());
        }
        return null;
    }*/
}

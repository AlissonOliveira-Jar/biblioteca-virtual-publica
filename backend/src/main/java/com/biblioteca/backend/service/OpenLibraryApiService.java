package com.biblioteca.backend.service;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@Service
@Slf4j
@RequiredArgsConstructor
public class OpenLibraryApiService {
    private final RestTemplate restTemplate;
    private static final String OPEN_LIBRARY_BASE_URL = "https://openlibrary.org";
    private static final String SEARCH_ENDPOINT = OPEN_LIBRARY_BASE_URL + "/search.json";


    public Map<String, Object> buscarDetalhes(String titulo){
        Map<String,Object> resultado = new HashMap<>();

        String encodedTitulo = URLEncoder.encode(titulo, StandardCharsets.UTF_8);

        String url = UriComponentsBuilder.fromUriString(SEARCH_ENDPOINT)
                .queryParam("title",encodedTitulo)
                .toUriString();
        try {
            Map<String,Object> openData = restTemplate.getForObject(url,Map.class);

            if (openData != null && openData.containsKey("docs")){
                List<?> docs = (List<?>) openData.get("docs");

                if (docs != null && !docs.isEmpty()){
                    Map<String, Object> firstDoc = (Map<String, Object>) docs.get(0);

                    resultado.put("Autor_Openlibrary", firstDoc.get("author_name"));

                    Object isbnData = firstDoc.get("isbn");
                    if (isbnData instanceof List<?> isbns && !isbns.isEmpty()){
                        resultado.put("ISBN", isbns.get(0));
                    } else if (isbnData != null) {
                        resultado.put("ISBN", isbnData);
                    } else {
                        resultado.put("ISBN", null);
                    }
                    String key = (String) firstDoc.get("key");
                    if (key != null){
                        resultado.put("Link_OpenLibrary", OPEN_LIBRARY_BASE_URL + key);
                    } else {
                        resultado.put("Link_OpenLibrary", null);
                    }
                    Object coverId = firstDoc.get("cover_i");
                    if (coverId != null){
                        resultado.put("Capa_OpenLibrary", "https://cover.openlibrary.org/b/id/" +
                                coverId + "-L.jpg");
                    } else {
                        resultado.put("Capa_Openlibrary", null);
                    }
                }
            }
        } catch (Exception e) {
            log.error("Erro ao buscar informações do Livro:{}",titulo,e);
            resultado.put("Erro", "Falha ao buscar informações na OpenLibrary: " + e.getMessage());
        }
        return resultado;
    }
}
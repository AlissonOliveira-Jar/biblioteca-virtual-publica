package com.biblioteca.backend.controller;

import com.biblioteca.backend.dto.response.SearchResultDTO;
import com.biblioteca.backend.service.GlobalSearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/search")
@RequiredArgsConstructor
public class SearchController {

    private final GlobalSearchService globalSearchService;

    @GetMapping
    public ResponseEntity<List<SearchResultDTO>> search(
            @RequestParam(name = "q", defaultValue = "") String query) {
        
        if (query.isBlank()) {
            return ResponseEntity.ok(List.of());
        }

        List<SearchResultDTO> results = globalSearchService.searchGlobal(query);
        return ResponseEntity.ok(results);
    }
}

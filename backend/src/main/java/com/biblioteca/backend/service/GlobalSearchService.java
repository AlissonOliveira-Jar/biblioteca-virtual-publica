package com.biblioteca.backend.service;

import com.biblioteca.backend.dto.response.SearchResultDTO;
import com.biblioteca.backend.repository.elastic.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Stream;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GlobalSearchService {

    private final LivroSearchRepository livroSearchRepo;
    private final AutorSearchRepository autorSearchRepo;
    private final ArtigoSearchRepository artigoSearchRepo;
    private final EditoraSearchRepository editoraSearchRepo;
    private final UserSearchRepository userSearchRepo;

    private static final int RESULT_LIMIT_PER_ENTITY = 5;

    public List<SearchResultDTO> searchGlobal(String termo) {
        PageRequest pageable = PageRequest.of(0, RESULT_LIMIT_PER_ENTITY);

        Stream<SearchResultDTO> livros = livroSearchRepo
                .findByTituloOrAutorNome(termo, termo, pageable).stream()
                .map(SearchResultDTO::from);

        Stream<SearchResultDTO> autores = autorSearchRepo
                .findByNome(termo, pageable).stream()
                .map(SearchResultDTO::from);
        
        Stream<SearchResultDTO> artigos = artigoSearchRepo
                .findByTituloOrAutoresNomes(termo, termo, pageable).stream()
                .map(SearchResultDTO::from);
        
        Stream<SearchResultDTO> editoras = editoraSearchRepo
                .findByNome(termo, pageable).stream()
                .map(SearchResultDTO::from);
        
        Stream<SearchResultDTO> usuarios = userSearchRepo
                .findByNameOrEmail(termo, termo, pageable).stream()
                .map(SearchResultDTO::from);

        return Stream.concat(livros, Stream.concat(autores, Stream.concat(artigos, Stream.concat(editoras, usuarios))))
                .collect(Collectors.toList());
    }
}

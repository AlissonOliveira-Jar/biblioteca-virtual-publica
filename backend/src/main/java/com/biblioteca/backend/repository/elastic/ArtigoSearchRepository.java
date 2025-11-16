package com.biblioteca.backend.repository.elastic;

import com.biblioteca.backend.document.ArtigoDocument;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

@Repository
public interface ArtigoSearchRepository extends ElasticsearchRepository<ArtigoDocument, UUID> {
    Page<ArtigoDocument> findByTituloOrAutoresNomes(String titulo, String autorNome, Pageable pageable);
}

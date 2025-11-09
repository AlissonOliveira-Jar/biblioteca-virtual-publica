package com.biblioteca.backend.repository.elastic;

import com.biblioteca.backend.document.LivroDocument;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

@Repository
public interface LivroSearchRepository extends ElasticsearchRepository<LivroDocument, UUID> {
    Page<LivroDocument> findByTituloOrAutorNome(String titulo, String autorNome, Pageable pageable);
}

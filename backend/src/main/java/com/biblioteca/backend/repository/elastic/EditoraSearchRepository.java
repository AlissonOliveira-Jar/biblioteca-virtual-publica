package com.biblioteca.backend.repository.elastic;

import com.biblioteca.backend.document.EditoraDocument;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

@Repository
public interface EditoraSearchRepository extends ElasticsearchRepository<EditoraDocument, UUID> {
    Page<EditoraDocument> findByNome(String nome, Pageable pageable);
}

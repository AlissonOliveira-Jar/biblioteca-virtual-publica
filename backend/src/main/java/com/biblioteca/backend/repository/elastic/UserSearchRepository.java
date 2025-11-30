package com.biblioteca.backend.repository.elastic;

import com.biblioteca.backend.document.UserDocument;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

@Repository
public interface UserSearchRepository extends ElasticsearchRepository<UserDocument, UUID> {
    Page<UserDocument> findByNameOrEmail(String name, String email, Pageable pageable);
    void deleteByEmail(String email);
}

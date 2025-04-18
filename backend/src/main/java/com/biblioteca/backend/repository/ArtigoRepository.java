package com.biblioteca.backend.repository;

import com.biblioteca.backend.entity.Artigo;
import com.biblioteca.backend.entity.Autor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ArtigoRepository extends JpaRepository<Artigo, UUID> {
    List<Artigo> findByTituloContainingIgnoreCase(String titulo);
    List<Artigo> findByAutoresContaining(Autor autor);
}

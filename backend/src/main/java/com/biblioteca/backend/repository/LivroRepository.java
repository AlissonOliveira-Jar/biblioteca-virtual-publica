package com.biblioteca.backend.repository;

import com.biblioteca.backend.entity.Autor;
import com.biblioteca.backend.entity.Editora;
import com.biblioteca.backend.entity.Livro;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface LivroRepository extends JpaRepository<Livro, UUID> {
    List<Livro> findByTituloContainingIgnoreCase(String titulo);
    List<Livro> findByGeneroIgnoreCase(String genero);
    List<Livro> findByAutor(Autor autor);
    List<Livro> findByEditora(Editora editora);
}

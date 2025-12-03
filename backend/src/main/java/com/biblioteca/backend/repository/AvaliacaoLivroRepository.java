package com.biblioteca.backend.repository;

import com.biblioteca.backend.entity.AvaliacaoLivro;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;
import java.util.Optional;
import java.util.List;

@Repository
public interface AvaliacaoLivroRepository extends JpaRepository<AvaliacaoLivro, Long> {

    Optional<AvaliacaoLivro> findByIdUsuarioAndTituloLivro(UUID idUsuario, String tituloLivro);
    List<AvaliacaoLivro> findByIdUsuario(UUID idUsuario);

}
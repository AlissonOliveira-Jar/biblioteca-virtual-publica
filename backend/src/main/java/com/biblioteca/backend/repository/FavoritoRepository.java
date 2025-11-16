package com.biblioteca.backend.repository;

import com.biblioteca.backend.entity.Favorito;
import com.biblioteca.backend.entity.Livro;
import com.biblioteca.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface FavoritoRepository extends JpaRepository<Favorito, UUID> {
    boolean existsByUserAndLivro(User user, Livro livro);
    Optional<Favorito> findByUserAndLivro(User user, Livro livro);
    List<Favorito> findAllByUser(User user);
    void deleteByUserAndLivro(User user, Livro livro);
}

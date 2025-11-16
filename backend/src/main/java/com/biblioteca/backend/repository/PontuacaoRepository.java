package com.biblioteca.backend.repository;

import com.biblioteca.backend.entity.Pontuacao;
import com.biblioteca.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface PontuacaoRepository extends JpaRepository<Pontuacao,Long>{
    Optional<Pontuacao> findByUser(User user);
}
package com.biblioteca.backend.repository;

import com.biblioteca.backend.entity.HistoricoLeitura;
import com.biblioteca.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface HistoricoLeituraRepository extends JpaRepository<HistoricoLeitura, Long> {
     List<HistoricoLeitura> findByUserOrderByDataLeituraDesc(User user);
}
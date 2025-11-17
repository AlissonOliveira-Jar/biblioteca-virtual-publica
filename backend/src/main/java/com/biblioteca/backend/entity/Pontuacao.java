package com.biblioteca.backend.entity;

import com.biblioteca.backend.entity.User;
import jakarta.persistence.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;
import java.time.Instant;


@Entity
@Table(name = "tb_pontuacao", uniqueConstraints ={@UniqueConstraint(columnNames = "user_id")})
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
public class Pontuacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false, unique = true)
    private User user;

    @Column(nullable = false)
    private Long pontos = 0L;

    @Column(nullable = false)
    private Integer nivel = 1;


    @CreatedDate
    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @Setter
    @Column(name = "ultima_pontuacao_leitura")
    private Instant ultimaPontuacaoLeitura = Instant.EPOCH;

    public Pontuacao() {
    }

    public Pontuacao(User user){
        this.user = user;
        this.pontos = 0L;
        this.nivel = 1;
        this.ultimaPontuacaoLeitura = Instant.EPOCH;
    }


    public void adicionarPontos(Long pontosAdicionados){
        if (pontosAdicionados == null || pontosAdicionados < 0) return;
        this.pontos += pontosAdicionados;
    }
}

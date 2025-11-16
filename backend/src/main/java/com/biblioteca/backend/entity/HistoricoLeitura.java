package com.biblioteca.backend.entity;

import lombok.Getter;
import lombok.Setter;
import jakarta.persistence.*;
import java.time.Instant;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Entity
@Table(name = "historico_leitura")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
public class HistoricoLeitura {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "livro_id", nullable = false)
    private Long livroId;

    @Column(name = "paginas_lidas", nullable = false)
    private Integer paginasLidas;

    @Column(name = "data_leitura", nullable = false)
    private Instant dataLeitura;


    public HistoricoLeitura() {
    }

    public HistoricoLeitura(User user, Long livroId, Integer paginasLidas) {
        this.user = user;
        this.livroId = livroId;
        this.paginasLidas = paginasLidas;
        this.dataLeitura = Instant.now();
    }

}
package com.biblioteca.backend.entity;

import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.UUID;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "tb_avaliacao_livro",uniqueConstraints = {
        @UniqueConstraint(name = "uk_avaliacao_usuario_livro", columnNames = {"id_usuario", "titulo_livro"})
})

@EntityListeners(AuditingEntityListener.class)
public class AvaliacaoLivro {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "id_usuario", nullable = false)
    private UUID idUsuario;

    @Column(name = "titulo_livro", nullable = false)
    private String tituloLivro;

    @Column(name = "nota", nullable = false)
    private Integer nota;

    @Column(name = "comentario", length = 500)
    private String comentario;

    @Column(name = "data_avaliacao", nullable = false)
    private LocalDateTime dataAvaliacao = LocalDateTime.now();

    @Column(name = "atualizada")
    private Boolean atualizada = false;


    public AvaliacaoLivro(UUID idUsuario, String tituloLivro, Integer nota, String comentario) {
        this.idUsuario = idUsuario;
        this.tituloLivro = tituloLivro;
        this.nota = nota;
        this.comentario = comentario;
        this.dataAvaliacao = LocalDateTime.now();
    }
}
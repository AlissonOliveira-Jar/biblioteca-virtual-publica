package com.biblioteca.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@Entity
@Table(name = "tb_artigos")
@EntityListeners(AuditingEntityListener.class)
public class Artigo {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String titulo;

    @Column(nullable = false, unique = true)
    private String doi;

    @Column
    private LocalDate dataPublicacao;

    @Column(columnDefinition = "TEXT")
    private String resumo;

    @Column
    private String palavrasChave;

    @ManyToMany
    @JoinTable(
            name = "artigo_autor",
            joinColumns = @JoinColumn(name = "artigo_id"),
            inverseJoinColumns = @JoinColumn(name = "autor_id")
    )
    private List<Autor> autores = new ArrayList<>();

    @Column
    private String revista;

    @Column
    private String volume;

    @Column
    private String numero;

    @Column
    private Integer paginaInicial;

    @Column
    private Integer paginaFinal;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @LastModifiedDate
    private Instant updatedAt;

    @Version
    private Integer version;

    public Artigo() {
    }

    public Artigo(String titulo, String doi) {
        this.titulo = titulo;
        this.doi = doi;
    }

}
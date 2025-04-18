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
@Table(name = "tb_autores")
@EntityListeners(AuditingEntityListener.class)
public class Autor {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String nome;

    @Column
    private String nacionalidade;

    @Column
    private LocalDate dataNascimento;

    @Column
    private  LocalDate dataFalescimento;

    @Column(columnDefinition = "TEXT")
    private String biografia;

    @OneToMany(mappedBy = "autor")
    private List<Livro> livros = new ArrayList<>();

    @ManyToMany(mappedBy = "autores")
    private List<Artigo> artigos = new ArrayList<>();

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @LastModifiedDate
    private Instant updatedAt;

    @Version
    private Integer version;

    public Autor() {
    }

    public Autor(String nome) {
        this.nome = nome;
    }

}

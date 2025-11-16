package com.biblioteca.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(
        name = "tb_favoritos",
        uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "livro_id"})
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Favorito {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(optional = false)
    @JoinColumn(name = "livro_id")
    private Livro livro;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Instant createdAt;
}

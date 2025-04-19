package com.biblioteca.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.Instant;
import java.util.Collection;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Setter
@Entity
@Table(name = "tb_users", indexes = @Index(name = "idx_user_email", columnList = "email"))
@EntityListeners(AuditingEntityListener.class)
public class User implements UserDetails {

    @Getter
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Getter
    @Column(nullable = false)
    @NotBlank(message = "O nome não pode estar vazio.")
    private String name;

    @Getter
    @Email(message = "Email inválido")
    @Column(unique = true, nullable = false)
    @NotBlank(message = "O email não pode estar vazio.")
    private String email;

    @Column(nullable = false)
    @NotBlank(message = "Senha obrigatória")
    private String password;

    @Getter
    @CreatedDate
    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @Getter
    @LastModifiedDate
    private Instant updatedAt;

    @Getter
    @Version
    private Integer version;

    @Getter
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "user_roles", joinColumns = @JoinColumn(name = "user_id"))
    private Set<String> roles = new HashSet<>();

    @Column(name = "reset_token")
    private String resetToken;

    @Getter
    @Column(name = "reset_token_expiry")
    private Instant resetTokenExpiry;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return roles.stream()
                .map(role -> new SimpleGrantedAuthority("ROLE_" + role))
                .collect(Collectors.toList());
    }


    public User() {

    }

    public User(String name, String email) {
        this.name = name;
        this.email = email;
        this.roles = new HashSet<>(Set.of("USER"));
    }

    @PrePersist
    @PreUpdate
    public void normalizeEmail() {
        if (email != null) {
            email = email.toLowerCase().trim();
        }
    }

    @Override
    public String getUsername() {
        return this.email;
    }

    @Override
    public String getPassword() {
        return this.password;
    }

}

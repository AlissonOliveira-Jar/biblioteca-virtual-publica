package com.biblioteca.backend.service;

import com.biblioteca.backend.dto.request.FavoritoRequestDTO;
import com.biblioteca.backend.dto.response.FavoritoResponseDTO;
import com.biblioteca.backend.entity.Favorito;
import com.biblioteca.backend.entity.Livro;
import com.biblioteca.backend.entity.User;
import com.biblioteca.backend.exception.FavoritoAlreadyExistsException;
import com.biblioteca.backend.exception.FavoritoNotFoundException;
import com.biblioteca.backend.exception.LivroNotFoundException;
import com.biblioteca.backend.repository.FavoritoRepository;
import com.biblioteca.backend.repository.LivroRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FavoritoService {

    private final FavoritoRepository favoritoRepository;
    private final LivroRepository livroRepository;

    private User getAuthenticatedUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return (User) principal;
    }

    @Transactional
    public FavoritoResponseDTO adicionarFavorito(FavoritoRequestDTO dto) {
        User usuario = getAuthenticatedUser();

        Livro livro = livroRepository.findById(dto.livroId())
                .orElseThrow(() -> new LivroNotFoundException("Livro não encontrado com ID: " + dto.livroId()));

        if (favoritoRepository.existsByUserAndLivro(usuario, livro)) {
            throw new FavoritoAlreadyExistsException("Este livro já está favoritado.");
        }

        Favorito favorito = Favorito.builder()
                .user(usuario)
                .livro(livro)
                .build();

        Favorito saved = favoritoRepository.save(favorito);
        return FavoritoResponseDTO.fromEntity(saved);
    }

    @Transactional
    public void removerFavorito(UUID livroId) {
        User usuario = getAuthenticatedUser();

        Livro livro = livroRepository.findById(livroId)
                .orElseThrow(() -> new LivroNotFoundException("Livro não encontrado com ID: " + livroId));

        Favorito favorito = favoritoRepository.findByUserAndLivro(usuario, livro)
                .orElseThrow(() -> new FavoritoNotFoundException("Este livro não está favoritado."));

        favoritoRepository.delete(favorito);
    }
    
    public List<FavoritoResponseDTO> listarFavoritosDoUsuario() {
        User usuario = getAuthenticatedUser();

        return favoritoRepository.findAllByUser(usuario)
                .stream()
                .map(FavoritoResponseDTO::fromEntity)
                .toList();
    }
}

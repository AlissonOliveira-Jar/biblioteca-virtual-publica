package com.biblioteca.backend.service;

import com.biblioteca.backend.dto.request.FavoritoRequestDTO;
import com.biblioteca.backend.dto.response.FavoritoResponseDTO;
import com.biblioteca.backend.entity.*;
import com.biblioteca.backend.exception.FavoritoAlreadyExistsException;
import com.biblioteca.backend.exception.FavoritoNotFoundException;
import com.biblioteca.backend.exception.LivroNotFoundException;
import com.biblioteca.backend.repository.FavoritoRepository;
import com.biblioteca.backend.repository.LivroRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class FavoritoServiceTest {

    @Mock
    private FavoritoRepository favoritoRepository;

    @Mock
    private LivroRepository livroRepository;

    @InjectMocks
    private FavoritoService favoritoService;

    private User usuario;
    private Autor autor;
    private Editora editora;
    private Livro livro;
    private Favorito favorito;

    private final UUID livroId = UUID.randomUUID();
    private final UUID favoritoId = UUID.randomUUID();

    @BeforeEach
    void setUp() {

        usuario = new User("Test User", "user@example.com");
        usuario.setId(UUID.randomUUID());

        autor = new Autor();
        autor.setId(UUID.randomUUID());
        autor.setNome("Autor Teste");

        editora = new Editora();
        editora.setId(UUID.randomUUID());
        editora.setNome("Editora Teste");

        livro = new Livro();
        livro.setId(livroId);
        livro.setTitulo("Livro Teste");
        livro.setIsbn("123456789");
        livro.setAutor(autor);
        livro.setEditora(editora);

        favorito = Favorito.builder()
                .id(favoritoId)
                .user(usuario)
                .livro(livro)
                .createdAt(Instant.now())
                .build();

        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(usuario, null, usuario.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(auth);
    }

    @Test
    void adicionarFavorito_sucesso() {
        FavoritoRequestDTO dto = new FavoritoRequestDTO(livroId);

        when(livroRepository.findById(livroId)).thenReturn(Optional.of(livro));
        when(favoritoRepository.existsByUserAndLivro(usuario, livro)).thenReturn(false);
        when(favoritoRepository.save(any(Favorito.class))).thenReturn(favorito);

        FavoritoResponseDTO response = favoritoService.adicionarFavorito(dto);

        assertNotNull(response);
        assertEquals(favoritoId, response.id());
        assertNotNull(response.livro());
        assertEquals(livroId, response.livro().id());
        assertEquals(autor.getId(), response.livro().autorId());
        assertEquals(editora.getId(), response.livro().editoraId());

        verify(favoritoRepository).save(any(Favorito.class));
    }

    @Test
    void adicionarFavorito_livroNaoExiste() {
        FavoritoRequestDTO dto = new FavoritoRequestDTO(livroId);

        when(livroRepository.findById(livroId)).thenReturn(Optional.empty());

        assertThrows(LivroNotFoundException.class,
                () -> favoritoService.adicionarFavorito(dto)
        );
    }

    @Test
    void adicionarFavorito_jaExiste() {
        FavoritoRequestDTO dto = new FavoritoRequestDTO(livroId);

        when(livroRepository.findById(livroId)).thenReturn(Optional.of(livro));
        when(favoritoRepository.existsByUserAndLivro(usuario, livro)).thenReturn(true);

        assertThrows(FavoritoAlreadyExistsException.class,
                () -> favoritoService.adicionarFavorito(dto)
        );

        verify(favoritoRepository, never()).save(any());
    }

    @Test
    void removerFavorito_sucesso() {
        when(livroRepository.findById(livroId)).thenReturn(Optional.of(livro));
        when(favoritoRepository.findByUserAndLivro(usuario, livro)).thenReturn(Optional.of(favorito));

        assertDoesNotThrow(() -> favoritoService.removerFavorito(livroId));

        verify(favoritoRepository).delete(favorito);
    }

    @Test
    void removerFavorito_naoExiste() {
        when(livroRepository.findById(livroId)).thenReturn(Optional.of(livro));
        when(favoritoRepository.findByUserAndLivro(usuario, livro)).thenReturn(Optional.empty());

        assertThrows(FavoritoNotFoundException.class,
                () -> favoritoService.removerFavorito(livroId)
        );
    }

    @Test
    void listarFavoritos_sucesso() {
        when(favoritoRepository.findAllByUser(usuario)).thenReturn(List.of(favorito));

        List<FavoritoResponseDTO> lista = favoritoService.listarFavoritosDoUsuario();

        assertEquals(1, lista.size());
        assertEquals(favoritoId, lista.get(0).id());
        assertEquals(livroId, lista.get(0).livro().id());
        assertEquals(autor.getId(), lista.get(0).livro().autorId());
    }
}

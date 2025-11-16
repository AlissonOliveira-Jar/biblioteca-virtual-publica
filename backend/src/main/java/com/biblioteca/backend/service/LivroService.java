package com.biblioteca.backend.service;

import com.biblioteca.backend.document.LivroDocument;
import com.biblioteca.backend.dto.request.LivroDTO;
import com.biblioteca.backend.entity.Autor;
import com.biblioteca.backend.entity.Editora;
import com.biblioteca.backend.entity.Livro;
import com.biblioteca.backend.exception.AutorNotFoundException;
import com.biblioteca.backend.exception.EditoraNotFoundException;
import com.biblioteca.backend.exception.LivroNotFoundException;
import com.biblioteca.backend.repository.AutorRepository;
import com.biblioteca.backend.repository.EditoraRepository;
import com.biblioteca.backend.repository.LivroRepository;
import com.biblioteca.backend.repository.elastic.LivroSearchRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LivroService {

    private final LivroRepository livroRepository;
    private final AutorRepository autorRepository;
    private final EditoraRepository editoraRepository;
    private final LivroSearchRepository livroSearchRepository;

    @Transactional
    public LivroDTO createLivro(LivroDTO livroDTO) {
        Autor autor = autorRepository.findById(livroDTO.autorId())
                .orElseThrow(() -> new AutorNotFoundException("Autor não encontrado com o ID: " + livroDTO.autorId()));
        Editora editora = null;
        if (livroDTO.editoraId() != null) {
            editora = editoraRepository.findById(livroDTO.editoraId())
                    .orElseThrow(() -> new EditoraNotFoundException("Editora não encontrada com o ID: " + livroDTO.editoraId()));
        }

        Livro livro = new Livro();
        livro.setTitulo(livroDTO.titulo());
        livro.setIsbn(livroDTO.isbn());
        livro.setEdicao(livroDTO.edicao());
        livro.setDataPublicacao(livroDTO.dataPublicacao());
        livro.setNumeroPaginas(livroDTO.numeroPaginas());
        livro.setGenero(livroDTO.genero());
        livro.setResumo(livroDTO.resumo());
        livro.setAutor(autor);
        livro.setEditora(editora);
        livro.setGoogleDriveFileId(livroDTO.googleDriveFileId());

        Livro savedLivro = livroRepository.save(livro);
        livroSearchRepository.save(LivroDocument.from(savedLivro));
        return LivroDTO.fromEntity(savedLivro);
    }

    public LivroDTO getLivroById(UUID id) {
        Livro livro = livroRepository.findById(id)
                .orElseThrow(() -> new LivroNotFoundException("Livro não encontrado com o ID: " + id));
        return LivroDTO.fromEntity(livro);
    }

    public List<LivroDTO> getAllLivros() {
        return livroRepository.findAll().stream()
                .map(LivroDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public LivroDTO updateLivro(UUID id, LivroDTO livroDTO) {
        Livro livroExistente = livroRepository.findById(id)
                .orElseThrow(() -> new LivroNotFoundException("Livro não encontrado com o ID: " + id));

        Autor autor = autorRepository.findById(livroDTO.autorId())
                .orElseThrow(() -> new AutorNotFoundException("Autor não encontrado com o ID: " + livroDTO.autorId()));
        Editora editora = null;
        if (livroDTO.editoraId() != null) {
            editora = editoraRepository.findById(livroDTO.editoraId())
                    .orElseThrow(() -> new EditoraNotFoundException("Editora não encontrada com o ID: " + livroDTO.editoraId()));
        }

        livroExistente.setTitulo(livroDTO.titulo());
        livroExistente.setIsbn(livroDTO.isbn());
        livroExistente.setEdicao(livroDTO.edicao());
        livroExistente.setDataPublicacao(livroDTO.dataPublicacao());
        livroExistente.setNumeroPaginas(livroDTO.numeroPaginas());
        livroExistente.setGenero(livroDTO.genero());
        livroExistente.setResumo(livroDTO.resumo());
        livroExistente.setAutor(autor);
        livroExistente.setEditora(editora);
        livroExistente.setGoogleDriveFileId(livroDTO.googleDriveFileId());

        Livro updatedLivro = livroRepository.save(livroExistente);
        livroSearchRepository.save(LivroDocument.from(updatedLivro));
        return LivroDTO.fromEntity(updatedLivro);
    }

    @Transactional
    public void deleteLivro(UUID id) {
        if (!livroRepository.existsById(id)) {
            throw new LivroNotFoundException("Livro não encontrado com o ID: " + id);
        }
        
        livroRepository.deleteById(id);
        
        livroSearchRepository.deleteById(id);
    }

    public List<LivroDTO> findByTitulo(String titulo) {
        return livroRepository.findByTituloContainingIgnoreCase(titulo).stream()
                .map(LivroDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public List<LivroDTO> findByGenero(String genero) {
        return livroRepository.findByGeneroIgnoreCase(genero).stream()
                .map(LivroDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public List<LivroDTO> findByAutor(UUID autorId) {
        Autor autor = autorRepository.findById(autorId)
                .orElseThrow(() -> new AutorNotFoundException("Autor não encontrado com o ID: " + autorId));
        return livroRepository.findByAutor(autor).stream()
                .map(LivroDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public List<LivroDTO> findByEditora(UUID editoraId) {
        Editora editora = editoraRepository.findById(editoraId)
                .orElseThrow(() -> new EditoraNotFoundException("Editora não encontrada com o ID: " + editoraId));
        return livroRepository.findByEditora(editora).stream()
                .map(LivroDTO::fromEntity)
                .collect(Collectors.toList());
    }
}

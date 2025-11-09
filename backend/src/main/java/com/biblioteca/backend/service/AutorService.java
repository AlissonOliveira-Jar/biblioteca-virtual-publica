package com.biblioteca.backend.service;

import com.biblioteca.backend.document.AutorDocument;
import com.biblioteca.backend.dto.request.AutorDTO;
import com.biblioteca.backend.entity.Artigo;
import com.biblioteca.backend.entity.Autor;
import com.biblioteca.backend.entity.Livro;
import com.biblioteca.backend.exception.AutorNotFoundException;
import com.biblioteca.backend.repository.AutorRepository;
import com.biblioteca.backend.repository.elastic.AutorSearchRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AutorService {

    private final AutorRepository autorRepository;
    private final AutorSearchRepository autorSearchRepository;

    @Transactional
    public AutorDTO createAutor(AutorDTO autorDTO) {
        Autor autor = new Autor();
        autor.setNome(autorDTO.nome());
        autor.setNacionalidade(autorDTO.nacionalidade());
        autor.setDataNascimento(autorDTO.dataNascimento());
        autor.setDataFalescimento(autorDTO.dataFalescimento());
        autor.setBiografia(autorDTO.biografia());
        
        Autor savedAutor = autorRepository.save(autor);
        
        autorSearchRepository.save(AutorDocument.from(savedAutor));

        return AutorDTO.fromEntity(savedAutor);
    }

    public AutorDTO getAutorById(UUID id) {
        Autor autor = autorRepository.findById(id)
                .orElseThrow(() -> new AutorNotFoundException("Autor não encontrado com o ID: " + id));
        return AutorDTO.fromEntity(autor);
    }

    public List<AutorDTO> getAllAutores() {
        return autorRepository.findAll().stream()
                .map(AutorDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public List<Livro> getLivrosByAutor(UUID autorId) {
        Autor autor = autorRepository.findById(autorId)
                .orElseThrow(() -> new AutorNotFoundException("Autor não encontrado com o ID: " + autorId));
        return autor.getLivros();
    }

    public List<Artigo> getArtigosByAutor(UUID autorId) {
        Autor autor = autorRepository.findById(autorId)
                .orElseThrow(() -> new AutorNotFoundException("Autor não encontrado com o ID: " + autorId));
        return autor.getArtigos();
    }

    @Transactional
    public AutorDTO updateAutor(UUID id, AutorDTO autorDTO) {
        Autor autorExistente = autorRepository.findById(id)
                .orElseThrow(() -> new AutorNotFoundException("Autor não encontrado com o ID: " + id));

        autorExistente.setNome(autorDTO.nome());
        autorExistente.setNacionalidade(autorDTO.nacionalidade());
        autorExistente.setDataNascimento(autorDTO.dataNascimento());
        autorExistente.setDataFalescimento(autorDTO.dataFalescimento());
        autorExistente.setBiografia(autorDTO.biografia());

        Autor updatedAutor = autorRepository.save(autorExistente);

        autorSearchRepository.save(AutorDocument.from(updatedAutor));

        return AutorDTO.fromEntity(updatedAutor);
    }

    @Transactional
    public void deleteAutor(UUID id) {
        if (!autorRepository.existsById(id)) {
            throw new AutorNotFoundException("Autor não encontrado com o ID: " + id);
        }
        
        autorRepository.deleteById(id);
        
        autorSearchRepository.deleteById(id);
    }

}

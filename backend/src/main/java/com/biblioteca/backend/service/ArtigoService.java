package com.biblioteca.backend.service;

import com.biblioteca.backend.document.ArtigoDocument;
import com.biblioteca.backend.dto.request.ArtigoDTO;
import com.biblioteca.backend.entity.Artigo;
import com.biblioteca.backend.entity.Autor;
import com.biblioteca.backend.exception.ArtigoNotFoundException;
import com.biblioteca.backend.exception.AutorNotFoundException;
import com.biblioteca.backend.repository.ArtigoRepository;
import com.biblioteca.backend.repository.AutorRepository;
import com.biblioteca.backend.repository.elastic.ArtigoSearchRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ArtigoService {

    private final ArtigoRepository artigoRepository;
    private final AutorRepository autorRepository;
    private final ArtigoSearchRepository artigoSearchRepository;

    private List<Autor> buscarAutoresPorIds(List<UUID> autoresIds) {
        return autoresIds.stream()
                .map(autorId -> autorRepository.findById(autorId)
                        .orElseThrow(() -> new AutorNotFoundException("Autor não encontrado com o ID: " + autorId)))
                .collect(Collectors.toList());
    }

    @Transactional // <-- ALTERADO
    public ArtigoDTO createArtigo(ArtigoDTO artigoDTO) {
        List<Autor> autores = buscarAutoresPorIds(artigoDTO.autoresIds());

        Artigo artigo = new Artigo();
        artigo.setTitulo(artigoDTO.titulo());
        artigo.setDoi(artigoDTO.doi());
        artigo.setDataPublicacao(artigoDTO.dataPublicacao());
        artigo.setResumo(artigoDTO.resumo());
        artigo.setPalavrasChave(artigoDTO.palavrasChave());
        artigo.setAutores(autores);
        artigo.setRevista(artigoDTO.revista());
        artigo.setVolume(artigoDTO.volume());
        artigo.setNumero(artigoDTO.numero());
        artigo.setPaginaInicial(artigoDTO.paginaInicial());
        artigo.setPaginaFinal(artigoDTO.paginaFinal());

        Artigo savedArtigo = artigoRepository.save(artigo);
        
        artigoSearchRepository.save(ArtigoDocument.from(savedArtigo));

        return ArtigoDTO.fromEntity(savedArtigo);
    }

    public ArtigoDTO getArtigoById(UUID id) {
        Artigo artigo = artigoRepository.findById(id)
                .orElseThrow(() -> new ArtigoNotFoundException("Artigo não encontrado com o ID: " + id));
        return ArtigoDTO.fromEntity(artigo);
    }

    public List<ArtigoDTO> getAllArtigos() {
        return artigoRepository.findAll().stream()
                .map(ArtigoDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public ArtigoDTO updateArtigo(UUID id, ArtigoDTO artigoDTO) {
        Artigo artigoExistente = artigoRepository.findById(id)
                .orElseThrow(() -> new ArtigoNotFoundException("Artigo não encontrado com o ID: " + id));

        List<Autor> autores = buscarAutoresPorIds(artigoDTO.autoresIds());

        artigoExistente.setTitulo(artigoDTO.titulo());
        artigoExistente.setDoi(artigoDTO.doi());
        artigoExistente.setDataPublicacao(artigoDTO.dataPublicacao());
        artigoExistente.setResumo(artigoDTO.resumo());
        artigoExistente.setPalavrasChave(artigoDTO.palavrasChave());
        artigoExistente.setAutores(autores);
        artigoExistente.setRevista(artigoDTO.revista());
        artigoExistente.setVolume(artigoDTO.volume());
        artigoExistente.setNumero(artigoDTO.numero());
        artigoExistente.setPaginaInicial(artigoDTO.paginaInicial());
        artigoExistente.setPaginaFinal(artigoDTO.paginaFinal());

        Artigo updatedArtigo = artigoRepository.save(artigoExistente);
        
        artigoSearchRepository.save(ArtigoDocument.from(updatedArtigo));

        return ArtigoDTO.fromEntity(updatedArtigo);
    }

    @Transactional
    public void deleteArtigo(UUID id) {
        if (!artigoRepository.existsById(id)) {
            throw new ArtigoNotFoundException("Artigo não encontrado com o ID: " + id);
        }
        
        artigoRepository.deleteById(id);
        
        artigoSearchRepository.deleteById(id);
    }

    public List<ArtigoDTO> findByTitulo(String titulo) {
        return artigoRepository.findByTituloContainingIgnoreCase(titulo).stream()
                .map(ArtigoDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public List<ArtigoDTO> findByAutor(UUID autorId) {
        Autor autor = autorRepository.findById(autorId)
                .orElseThrow(() -> new AutorNotFoundException("Autor não encontrado com o ID: " + autorId));
        return artigoRepository.findByAutoresContaining(autor).stream()
                .map(ArtigoDTO::fromEntity)
                .collect(Collectors.toList());
    }
}

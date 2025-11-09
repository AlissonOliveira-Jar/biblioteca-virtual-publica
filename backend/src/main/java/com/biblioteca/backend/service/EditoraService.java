package com.biblioteca.backend.service;

import com.biblioteca.backend.document.EditoraDocument;
import com.biblioteca.backend.dto.request.EditoraDTO;
import com.biblioteca.backend.entity.Editora;
import com.biblioteca.backend.entity.Livro;
import com.biblioteca.backend.exception.EditoraNotFoundException;
import com.biblioteca.backend.repository.EditoraRepository;
import com.biblioteca.backend.repository.elastic.EditoraSearchRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EditoraService {

    private final EditoraRepository editoraRepository;
    private final EditoraSearchRepository editoraSearchRepository;

    @Transactional
    public EditoraDTO createEditora(EditoraDTO editoraDTO) {
        Editora editora = new Editora();
        editora.setNome(editoraDTO.nome());
        editora.setPais(editoraDTO.pais());
        editora.setDataFundacao(editoraDTO.dataFundacao());
        editora.setWebsite(editoraDTO.website());
        
        Editora savedEditora = editoraRepository.save(editora);

        editoraSearchRepository.save(EditoraDocument.from(savedEditora));

        return EditoraDTO.fromEntity(savedEditora);
    }

    public EditoraDTO getEditoraById(UUID id) {
        Editora editora = editoraRepository.findById(id)
                .orElseThrow(() -> new EditoraNotFoundException("Editora não encontrada com o ID: " + id));
        return EditoraDTO.fromEntity(editora);
    }

    public List<EditoraDTO> getAllEditoras() {
        return editoraRepository.findAll().stream()
                .map(EditoraDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public List<Livro> getLivrosByEditora(UUID editoraId) {
        Editora editora = editoraRepository.findById(editoraId)
                .orElseThrow(() -> new EditoraNotFoundException("Editora não encontrada com o ID: " + editoraId));
        return editora.getLivros();
    }

    public List<EditoraDTO> findByName(String nome) {
        List<Editora> editoras = editoraRepository.findByNomeContainingIgnoreCase(nome);
        if (editoras.isEmpty()) {
            throw new EditoraNotFoundException("Nenhuma editora encontrada com o nome: " + nome);
        }
        return editoras.stream()
                .map(EditoraDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public EditoraDTO updateEditora(UUID id, EditoraDTO editoraDTO) {
        Editora editoraExistente = editoraRepository.findById(id)
                .orElseThrow(() -> new EditoraNotFoundException("Editora não encontrada com o ID: " + id));

        editoraExistente.setNome(editoraDTO.nome());
        editoraExistente.setPais(editoraDTO.pais());
        editoraExistente.setDataFundacao(editoraDTO.dataFundacao());
        editoraExistente.setWebsite(editoraDTO.website());

        Editora updatedEditora = editoraRepository.save(editoraExistente);
        
        editoraSearchRepository.save(EditoraDocument.from(updatedEditora));

        return EditoraDTO.fromEntity(updatedEditora);
    }

    @Transactional
    public void deleteEditora(UUID id) {
        if (!editoraRepository.existsById(id)) {
            throw new EditoraNotFoundException("Editora não encontrada com o ID: " + id);
        }
        
        editoraRepository.deleteById(id);
        
        editoraSearchRepository.deleteById(id);
    }

}

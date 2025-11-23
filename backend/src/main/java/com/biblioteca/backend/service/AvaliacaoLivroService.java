package com.biblioteca.backend.service;

import com.biblioteca.backend.repository.LivroRepository;
import com.biblioteca.backend.entity.Livro;
import com.biblioteca.backend.entity.AvaliacaoLivro;
import com.biblioteca.backend.repository.AvaliacaoLivroRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.UUID;
import java.util.Optional;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j

public class AvaliacaoLivroService {

    private final AvaliacaoLivroRepository avaliacaoLivroRepository;
    private final LivroRepository livroRepository;

    @Transactional
    public AvaliacaoLivro registrarAvaliacao(UUID idUsuario, String tituloLivro, Integer nota, String comentario){

        List<Livro> livrosEncontrados = livroRepository.findByTituloContainingIgnoreCase(tituloLivro);

        if (livrosEncontrados.isEmpty()) {
            log.warn("Tentativa de avaliar livro inexistente: {}", tituloLivro);
            throw new IllegalArgumentException("Livro com o título '" + tituloLivro + "' não encontrado.");
        }

        if (livrosEncontrados.size() > 1) {
            log.error("Ambiguidade: Múltiplos livros encontrados para o título similar: {}", tituloLivro);
            throw new IllegalArgumentException("Múltiplos livros encontrados com título similar. Por favor, seja mais específico.");
        }

        Livro livroUnico = livrosEncontrados.get(0);
        if (!livroUnico.getTitulo().equalsIgnoreCase(tituloLivro)) {
            log.warn("Busca parcial. Título fornecido não corresponde exatamente: {}", tituloLivro);
            throw new IllegalArgumentException("O título fornecido não corresponde exatamente a um livro existente. Você quis dizer: " + livroUnico.getTitulo() + "?");
        }

        if (nota < 1 || nota > 5){
            throw new IllegalArgumentException("A nota deve ser entre 1 a 5");
        }

        Optional<AvaliacaoLivro> avaliacaoExistente = avaliacaoLivroRepository.
                findByIdUsuarioAndTituloLivro(idUsuario,tituloLivro);

        AvaliacaoLivro avaliacao;

        if (avaliacaoExistente.isPresent()){
            avaliacao = avaliacaoExistente.get();
            log.info("Nota atualizada do livro: {} pelo usuário: {}", tituloLivro, idUsuario);

            if (!avaliacao.getNota().equals(nota)){
                avaliacao.setNota(nota);
                avaliacao.setAtualizada(true);
            }
            avaliacao.setComentario(comentario);
        } else {
            log.info("Registrado nova avaliação pelo usuário {} para o livro {}", idUsuario, tituloLivro);
            avaliacao = new AvaliacaoLivro(idUsuario,tituloLivro, nota, comentario);
        }
        return avaliacaoLivroRepository.save(avaliacao);
    }

    public Optional<AvaliacaoLivro> buscarAvaliacaoUsuario(UUID idUsuario, String tituloLivro){
        return avaliacaoLivroRepository.findByIdUsuarioAndTituloLivro(idUsuario, tituloLivro);
    }

    public double calcularMediaAvaliacao(String tituloLivro){
        return avaliacaoLivroRepository.findAll().stream()
                .filter(a -> a.getTituloLivro().equals(tituloLivro))
                .mapToDouble(AvaliacaoLivro::getNota)
                .average()
                .orElse(0.0);
    }
}
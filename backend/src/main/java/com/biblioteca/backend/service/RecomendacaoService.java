package com.biblioteca.backend.service;

import com.biblioteca.backend.dto.response.RecomendacaoResponseDTO;
import com.biblioteca.backend.entity.HistoricoLeitura;
import com.biblioteca.backend.entity.Livro;
import com.biblioteca.backend.entity.User;
import com.biblioteca.backend.repository.HistoricoLeituraRepository;
import com.biblioteca.backend.repository.LivroRepository;
import com.biblioteca.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;


@Service
public class RecomendacaoService {

    private final LivroRepository livroRepository;
    private final HistoricoLeituraRepository historicoLeituraRepository;
    private final UserRepository userRepository;

    private static final int MAX_TOP_GENRES = 3;

    public RecomendacaoService(LivroRepository livroRepository,
                               HistoricoLeituraRepository historicoLeituraRepository,
                               UserRepository userRepository){
        this.livroRepository = livroRepository;
        this.historicoLeituraRepository = historicoLeituraRepository;
        this.userRepository = userRepository;
    }

    private List<String> getCleanGenres(String genero) {
        if (genero == null || genero.trim().isEmpty()) {
            return List.of();
        }

        return Arrays.stream(genero.split(","))
                .map(String::trim)
                .filter(g -> !g.isEmpty())
                .map(String::toLowerCase)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<RecomendacaoResponseDTO> getRecomendacoes(UUID userId){
        User user = userRepository.findById(userId)
                .orElseThrow(() -> {
                    System.err.println("Erro: Usuário não encontrado para o ID: " + userId);
                    return new NoSuchElementException("Usuário não encontrado com o ID: " + userId);
                });
        List<HistoricoLeitura> historico = historicoLeituraRepository.findByUserOrderByDataLeituraDesc(user);

        if (historico.isEmpty()){
            System.out.println("Usuário sem histórico de leitura.");
            return List.of();
        }

        Set<UUID> idsLivrosString;
        try {
            idsLivrosString = historico.stream()
                    .map(h -> UUID.fromString(h.getLivroId()))
                    .collect(Collectors.toSet());
        } catch (IllegalArgumentException e) {
            System.err.println("ERRO FATAL DE DADOS: Um ID de Livro no HistoricoLeitura não é um UUID válido.");
            System.err.println("Verifique os dados na tabela HistoricoLeitura para o usuário: " + userId);
            throw new RuntimeException("Falha ao processar IDs de livros lidos: ID inválido encontrado.", e);
        }

        System.out.println("DEBUG GERAL: Usuário: " + user.getName() + " | Quantidade de livros lidos: " + idsLivrosString.size());
        System.out.println("DEBUG GERAL: IDs de livros lidos: " + idsLivrosString);


        List<Livro> allBooks = livroRepository.findAll();
        List<Livro> livrosLidosCompletos = allBooks.stream()
                .filter(livro -> idsLivrosString.contains(livro.getId()))
                .collect(Collectors.toList());

        List<String> generosDosLivrosLidos = livrosLidosCompletos.stream()
                .flatMap(livro -> getCleanGenres(livro.getGenero()).stream())
                .collect(Collectors.toList());


        List<String> topGeneros = generosDosLivrosLidos.stream()
                .map(String::toLowerCase)
                .collect(Collectors.groupingBy(g -> g, Collectors.counting()))
                .entrySet().stream()
                .sorted(Map.Entry.comparingByValue(Comparator.reverseOrder()))
                .limit(MAX_TOP_GENRES)
                .map(Map.Entry::getKey)
                .collect(Collectors.toList());

        if (topGeneros.isEmpty()){
            System.out.println("Nenhum livro favorito!");
            return List.of();
        }
        System.out.println("Gêneros favoritos: " + topGeneros);

        List<Livro> livrosRecomendados = allBooks.stream()
                .filter(livro -> {
                    boolean isLido = idsLivrosString.contains(livro.getId());
                    if (isLido) {
                        System.out.println("DEBUG FILTRO: Descartado " + livro.getTitulo() + " (Já lido).");
                        return false;
                    }
                    String generoLivro = livro.getGenero();
                    boolean isTopGenero = generoLivro != null && topGeneros.contains(generoLivro.toLowerCase());
                    if (!isTopGenero) {
                        System.out.println("DEBUG FILTRO: Descartado " + livro.getTitulo() + " (Gênero '" + generoLivro + "' não é favorito, ou é nulo).");
                        return false;
                    }
                    System.out.println("DEBUG FILTRO: RECOMENDADO: " + livro.getTitulo() + " (Gênero: " + generoLivro + ")");
                    return true;
                })
                .collect(Collectors.toList());

        List<RecomendacaoResponseDTO> recomendacao = livrosRecomendados.stream()
                .map(livro -> new RecomendacaoResponseDTO(
                        livro.getId().toString(),
                        livro.getTitulo(),
                        livro.getAutor() != null ? livro.getAutor().getNome() : "Autor Desconhecido",
                        getCleanGenres(livro.getGenero())
                ))
                .collect(Collectors.toList());
        System.out.println("Retornando: " +recomendacao.size()+ "recomendações!");
        return recomendacao;
    }
}
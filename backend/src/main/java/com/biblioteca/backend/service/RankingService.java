package com.biblioteca.backend.service;

import com.biblioteca.backend.dto.response.LivroRankingDTO;
import com.biblioteca.backend.dto.response.UserRankingDTO;
import com.biblioteca.backend.entity.Livro;
import com.biblioteca.backend.repository.AvaliacaoLivroRepository;
import com.biblioteca.backend.repository.FavoritoRepository;
import com.biblioteca.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RankingService {
    private final FavoritoRepository favoritoRepository;
    private final AvaliacaoLivroRepository avaliacaoLivroRepository;
    private final UserRepository userRepository;


    public List<LivroRankingDTO> getLivroRanking(int limit){
        Map<Object, Long> favoritosPorLivro = favoritoRepository.findAll().stream()
                .filter(f -> f.getLivro() != null)
                .collect(Collectors.groupingBy(
                        f -> f.getLivro(),
                        Collectors.counting()
                ));

        List<LivroRankingDTO> ranking = favoritosPorLivro.entrySet().stream()
                .sorted(Map.Entry.comparingByValue(Comparator.reverseOrder()))
                .limit(limit)
                .map(entry -> {
                    Livro livro = (Livro) entry.getKey();
                    Long contagem = entry.getValue();
                    return new LivroRankingDTO(
                            0,
                            livro.getId().toString(),
                            livro.getTitulo(),
                            livro.getAutor() != null ? livro.getAutor().getNome() : "Autor Desconhecido",
                            contagem,
                            contagem
                    );
                })
                .collect(Collectors.toList());

        for(int i = 0; i < ranking.size(); i++){
            ranking.get(i).setPosicao(i + 1);
        }
        return ranking;
    }

    public List<UserRankingDTO> getUsuarioRanking(int limit){
        Map<UUID, Long> avaliacoesPorUsuarioId = avaliacaoLivroRepository.findAll().stream()
                .collect(Collectors.groupingBy(
                        a -> a.getIdUsuario(),
                        Collectors.counting()
                ));

        List<UserRankingDTO> ranking = avaliacoesPorUsuarioId.entrySet().stream()
                .sorted(Map.Entry.comparingByValue(Comparator.reverseOrder()))
                .limit(limit)
                .map(entry ->{
                    UUID userId = entry.getKey();
                    Long contagemAvaliacoes = entry.getValue();

                    String userName = userRepository.findById(userId)
                            .map(user -> user.getName())
                            .orElse("Usuário Desconhecido");
                    return new UserRankingDTO(
                            0,
                            userId.toString(),
                            userName,
                            contagemAvaliacoes,
                            (int) (contagemAvaliacoes / 5) + 1
                    );
                })
                .collect(Collectors.toList());

        for (int i = 0; i < ranking.size(); i++) {
            ranking.get(i).setPosicao(i + 1);
        }

        return ranking;
    }
}
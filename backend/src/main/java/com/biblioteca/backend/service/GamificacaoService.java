package com.biblioteca.backend.service;

import com.biblioteca.backend.entity.User;
import com.biblioteca.backend.entity.Pontuacao;
import com.biblioteca.backend.entity.HistoricoLeitura;
import com.biblioteca.backend.request.RegistrarLeituraDTO;
import com.biblioteca.backend.response.PontuacaoResponseDTO;
import com.biblioteca.backend.repository.PontuacaoRepository;
import com.biblioteca.backend.repository.HistoricoLeituraRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.Instant;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service

public class GamificacaoService {
    private static final long PONTOS_POR_SESSAO_LEITURA = 20L;
    private static final long TEMPO_MINIMO_ENTRE_PONTOS_SEGUNDOS = 10;
    private static final Logger log = LoggerFactory.getLogger(GamificacaoService.class);

    private final PontuacaoRepository pontuacaoRepository;
    private final NivelarPontuacaoService nivelarPontuacaoService;
    private final HistoricoLeituraRepository historicoLeituraRepository;

    public GamificacaoService(
            PontuacaoRepository pontuacaoRepository,
            HistoricoLeituraRepository historicoLeituraRepository,
            NivelarPontuacaoService nivelarPontuacaoService){

        this.pontuacaoRepository = pontuacaoRepository;
        this.historicoLeituraRepository = historicoLeituraRepository;
        this.nivelarPontuacaoService = nivelarPontuacaoService;
    }

    @Transactional
    public Pontuacao garantirPontuacao(User user){

        return pontuacaoRepository.findByUser(user)
                .orElseGet(() -> {Pontuacao novaPontuacao = new Pontuacao(user);
                    return pontuacaoRepository.save(novaPontuacao);
                });
    }

    @Transactional(readOnly = false)
    public PontuacaoResponseDTO buscarPontuacaoUser(User user) {
        Pontuacao pontuacao = garantirPontuacao(user);
        return new PontuacaoResponseDTO(pontuacao.getPontos(), pontuacao.getNivel());
    }

    @Transactional
    public Pontuacao adicionarPontos(User user, Long pontosAdicionados){

        Pontuacao pontuacao = garantirPontuacao(user);
        pontuacao.adicionarPontos(pontosAdicionados);

        aplicarNivelamento(pontuacao, user);

        return pontuacaoRepository.save(pontuacao);
    }

    @Transactional
    public void deletarPontuacao(User user){
        log.info("Deletando registro de pontuação para o Usuário ID: {}", user.getId());
        pontuacaoRepository.deleteByUser(user);
    }

    private void aplicarNivelamento(Pontuacao pontuacao, User user) {
        int nivelAntigo = pontuacao.getNivel();
        int nivelNovo = nivelarPontuacaoService.calcularNovoNivel(pontuacao.getPontos());

        if (nivelNovo > nivelAntigo){
            pontuacao.setNivel(nivelNovo);
            log.info("Usuário {} subiu de nível. De {} para {}. Pontos totais: {}",
                    user.getId(), nivelAntigo, nivelNovo, pontuacao.getPontos());
        }
    }

    @Transactional
    public Pontuacao concederPontosPorLeitura(User user, RegistrarLeituraDTO request){
        Pontuacao pontuacao = garantirPontuacao(user);
        Instant agora = Instant.now();

        Instant proximaPontuacaoPermitida = pontuacao.getUltimaPontuacaoLeitura()
                .plusSeconds(TEMPO_MINIMO_ENTRE_PONTOS_SEGUNDOS);

        boolean pontosConcedidos = false;

        if (agora.isAfter(proximaPontuacaoPermitida) || agora.equals(proximaPontuacaoPermitida)){

            pontuacao.adicionarPontos(PONTOS_POR_SESSAO_LEITURA);
            pontuacao.setUltimaPontuacaoLeitura(agora);
            pontosConcedidos = true;

            int nivelNovo = nivelarPontuacaoService.calcularNovoNivel(pontuacao.getPontos());
            pontuacao.setNivel(nivelNovo);
        } else {
            System.out.println("Pontuação rejeitada. Tempo mínimo de " + TEMPO_MINIMO_ENTRE_PONTOS_SEGUNDOS + "s não atingido.");
        }

        HistoricoLeitura historico = new HistoricoLeitura(
                user,
                request.getIdLivro(),
                request.getPaginaLida()
        );
        historicoLeituraRepository.save(historico);

        return pontuacaoRepository.save(pontuacao);
    }
    public Optional<Pontuacao> buscarPontuacaoPorUser(User user){
        return pontuacaoRepository.findByUser(user);
    }
}